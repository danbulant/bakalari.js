const got = require("got");
const parser = require('fast-xml-parser');
const crypto = require("crypto");

class Api {
    name = "";
    pswd = "";
    salt = "";
    token = null;
    domain = "";

    genToken() {
        const shasum = crypto.createHash("sha512");
        const shasum2 = crypto.createHash("sha512");
        shasum2.update(this.salt + this.pswd, "utf-8");
        var hashedPassword = shasum2.digest("base64");

        function dateToYMD(date) { //https://stackoverflow.com/a/43365158
            var d = date.getDate();
            var m = date.getMonth() + 1; //Month from 0 to 11
            var y = date.getFullYear();
            return '' + y + '' + (m <= 9 ? '0' + m : m) + '' + (d <= 9 ? '0' + d : d);
        }

        var tokenString = "*login*";
        tokenString += this.name;
        tokenString += "*pwd*";
        tokenString += hashedPassword;
        tokenString += "*sgn*ANDR";
        tokenString += dateToYMD(new Date());

        shasum.update(tokenString, "utf-8");
        var token = shasum.digest("base64");
        token = token.replace(/[\\|\/]/gi, "_")
            .replace(/\+/gi, "-");

        this.token = token;
    }

    setName(name){
        this.name = name;
    }

    async verifyName(){
        var res = await got(`https://${this.domain}/login.aspx?gethx=${this.name}`);
        try {
            var r = parser.parse(res.body);
            if(r.results.res == 1)return r.results;
        } catch(e){
            console.error(e);
        }
        return false;
    }

    async genSalt(){
        var res = await this.verifyName();
        if(!res) return false;

        this.salt = res.salt + res.ikod + res.typ;
        return true;
    }

    setPassword(pswd){
        this.pswd = pswd;
    }

    setDomain(dom){
        this.domain = dom;
    }
    
    async request(pm){
        var res = await got(`https://${this.domain}/login.aspx?hx=${this.token}&pm=${pm}`);
        return parser.parse(res.body);
    }
}

module.exports = Api;

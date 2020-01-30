# bakalari.js
Jednoduchá knihovna pro API bakalářů.

# Instalace
Pokud máte npm, můžete jednoduše nainstalovat:
`npm install bakalari-js --save`
**NPM je momentálně nutnost, jelikož API vyžaduje 2 knihovny (`got` na requesty a `fast-xml-parser` na parsovaní XML)**


Pro seznam dostupných modulů běžte na neoficiální dokumentaci [zde](https://github.com/bakalari-api/bakalari-api).

## Příklad
Jednoduchý příklad na získání rozvrhu pro tento týden:

```js
const Api = require("bakalari-js");
var bak = new Api;

const settings = {
  domain: "domena.tld",
  name: "jmeno",
  password: "heslo"
}
bak.setDomain(settings.domain);
bak.setName(settings.name);
bak.setPassword(settings.password);
bak.genSalt().then(async (salt) => {
    if (!salt) {
        console.error("Neexistující uživatel");
        return;
    }
    bak.genToken();

    var resp = await bak.request(req.params.info);
    var info = resp.results;
    console.log(info);
}).catch(e => {
    console.log("Špatná doména či uživatel");
});
```


## Dokumentace

### Class API
Hlavní třída která se též exportuje.

#### Constructor() => class Api
Momentálně nebere žádné parametry, ale plánuje se možnost objektu s nastavením.

#### setDomain(domain) => undefined
Nastaví doménu na `domain`.

#### setName(name) => undefined
Nastaví jméno uživatele na `name`.

#### setPassword(password) => undefined
Nastaví heslo uživatele na `password`.

#### genSalt() => promise(salt)
Vygeneruje potřebnou sůl k získání tokenu. Pro správnou funkci je třeba mít nastavené předchozí hodnoty (doména, jméno a heslo). Sůl je dostupná až po vyřešení promise. V promise se vrací sůl, avšak ji nemusíte nijak uchovávat - třida si ji uloží jako property, je tedy určena především na kontrolu zda se sůl podařilo vygenerovat.

#### genToken() => undefined
Vygeneruje token pro dnešní den (musí se generovat každý den). Je třeba mít sůl pro vygenerování tokenu. Token je třeba pro requesty.

#### request(module) => promise(data)
Získá data z modulu. Je třeba mít nastavený token. Seznam modulů dostupný [zde](https://github.com/bakalari-api/bakalari-api).

*Ne všechny funkce třídy jsou dokumentované, avšak dané funkce jsou pouze pro interní použití.*

# Podpoření
Můžete mne podpořit na [patreonu](http://patreon.com/danbulant).

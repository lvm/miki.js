var LOS_ARCHIBVOS = require('fs');
var SHO = require('../miki.js');
var MARADO = LOS_ARCHIBVOS.readFileSync('marado.wiki').toString();

SHO.parse(MARADO);
console.log(SHO.as_html());

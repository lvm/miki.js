var LOS_ARCHIBVOS = require('fs');
var SHO = require('../miki.js');
var MARADO = LOS_ARCHIBVOS.readFileSync('marado.wiki').toString();
var SHOPTS = {
    anchors:[
        {re: /(<a href=\')(w:(.[^>]+))(\'>)/gi, sub:'$1http://es.wikipedia.org/wiki/$3$4'},
        {re: /(<a href=\')((.[^w:>]+))(\'>)/gi, sub:'$1#/show/$2$4'}
    ]
};

SHO.parse(MARADO);
console.log(SHO.as_html(SHOPTS));

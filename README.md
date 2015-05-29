# miki.js

Yet Another MediaWiki Parser in JS. This time using regular expressions.

## usage  

    var fs = require('fs');
    var miki = require('./miki.js');
    var diego_wiki = fs.readFileSync('marado.wiki').toString();
    var diego = miki;
    diego.parse(diego_wiki);
    console.log(diego.as_html());

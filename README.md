# miki.js

Yet Another MediaWiki Parser in JS. This time using regular expressions.

## usage  

    var fs = require('fs');
    var miki = require('./miki.js');
    var diego = fs.readFileSync('marado.wiki').toString();
    miki.init(diego);
    miki.process();
    console.log(miki.as_html());

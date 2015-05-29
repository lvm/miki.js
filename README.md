# uiki.js

Yet Another MediaWiki Parser in JS. This time using regular expressions.

## usage  

    var fs = require('fs');
    var uiki = require('./uiki.js');
    var diego = fs.readFileSync('marado.wiki').toString();
    uiki.init(diego);
    uiki.process();
    console.log(uiki.as_html());

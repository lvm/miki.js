var miki = {
    wiki: undefined,
    html: undefined,
    ref: undefined,
};

function replace_re(where, re, sub, comment){
    for(var i=0;i<where.length;i++){
        match = where[i].match(re);
        if(match){
            //console.log( comment||"", match );
            where[i] = where[i].replace(re, sub);
        }
    }
    return where;
}

function match_re(where, re, sub, comment){
    var matches = [];
    for(var i=0;i<where.length;i++){
        match = where[i].match(re);
        if(match){
            //console.log( comment||"", match );
            matches.push(match);
        }
    }
    return matches;
}

miki.parse = function(wiki){
    miki.wiki = wiki; // HUEUHEHUEUHEHUEHUEHUEHUEHUEUHEUHE
    miki.html = miki.wiki.replace("\r\n","\n").split("\n");
    miki.ref = [];

    /*
     * BO headers
     * <h{1,2,3,4,5}>
     */
    miki.html = replace_re(miki.html,
                           /={5}(.+)={5}/i,
                           "<h5>$1</h5>",
                           "===== h5 =====");

    miki.html = replace_re(miki.html,
                           /={4}(.+)={4}/i,
                           "<h4>$1</h4>",
                           "==== h4 ====");

    miki.html = replace_re(miki.html,
                           /={3}(.+)={3}/i,
                           "<h3>$1</h3>",
                           "=== h3 ===");

    miki.html = replace_re(miki.html,
                           /={2}(.+)={2}/i,
                           "<h2>$1</h2>",
                           "== h2 ==");

    miki.html = replace_re(miki.html,
                           /=(.+)=/i,
                           "<h1>$1</h1>",
                           "= h1 =");

    /*
     * EO headers
     */

    /*
     * BO bold & italic
     * <strong> <em>
     */
    miki.html = replace_re(miki.html,
                           /'{3}(.[^']*)'{3}/gi,
                           "<strong>$1</strong>",
                           "'''bold'''");

    miki.html = replace_re(miki.html,
                           /'{2}(.[^']*)'{2}/gi,
                           "<em>$1</em>",
                           "''em''");

    /*
     * EO bold & italic
     */

    /*
     * BO anchors
     * <a>
     */
    //match = html.match(/\[{2}(.[^\|\]]*)(\|(.[^\]]*))?\]{2}/gi);

    miki.html = replace_re(miki.html,
                           /\[{2}(.[^|\]]+)\]{2}/ig,
                           "<a href='self:$1'>$1</a>",
                           "[[abc]] | [[w:abc]]");

    miki.html = replace_re(miki.html,
                           /\[{2}(.[^\]]+)\|(.[^\]]+)\]{2}/gi,  /*/\[{2}(.*)\|(.[^\]]*)\]{2}/i,*/
                           "<a href='$1'>$2</a>",
                           "[[abc|def]]");

    miki.html = replace_re(miki.html,
                           /\[(.[^ ]+)(.+)\]/gi,
                           "<a href='$1'>$2</a>",
                           "[abc def]");
    /*
     * EO anchors
     */

    /*
     * BO lists
     * <ul> <li>
     */

    miki.html = replace_re(miki.html,
                           /^:(.*)/i,
                           "<li>$1</li>",
                           ": abcdef");

    miki.html = replace_re(miki.html,
                           /^\*{2}(.*)/i,
                           "<li>$1</li>",
                           "** abcdef");

    miki.html = replace_re(miki.html,
                           /^\*(.*)/i,
                           "<li>$1</li>",
                           "* abcdef");

    miki.html = miki.html.join("\n");
    miki.html = replace_re(miki.html,
                           /\n\n<li>/i,
                           "\n\n<ul><li>",
                           "<li>abcdef");
    miki.html = replace_re(miki.html,
                           /<\li>\n\n/i,
                           "</li></ul>\n\n",
                           "abcdef</li>");
    miki.html = miki.html.split("\n");

    /*
     * EO bold & italic
     */

    /*
     * BO references
     * <ref>
     */
    miki.ref = match_re(miki.html,
                        /<ref>(.*)<\/ref>/i,
                        "$1",
                        "<ref>abc</ref>");

    // for(var i=0;i<references.length;i++){
    //     console.log(references[i][1]);
    // }

    miki.html = replace_re(miki.html,
                           /<ref>(.*)<\/ref>/i,
                           "$1",
                           "<ref>abc</ref>");

    miki.html = replace_re(miki.html,
                           /{{listaref}}/i,
                           "___LISTAREF___",
                           "{{listaref}}");

    /*
     * EO references
     */

    /*
     * BO sidetable
     *
     */
    miki.html = replace_re(miki.html,
                           /\|(.+)=(.+)/i,
                           "",
                           "|abc=def");

    miki.html = replace_re(miki.html,
                           /{{2}(.*)/i,
                           "",
                           "{{{abc");

    miki.html = replace_re(miki.html,
                           /}{2}/i,
                           "",
                           "}}}");

    /*
     * EO sidetable
     */
}

miki.as_html = function(){
    return miki.html.join("\n");
}

miki.listref = function(){
    return miki.ref;
}


if (typeof exports === 'object') {
    for (var i in miki) {
        exports[i] = miki[i];
    }
}

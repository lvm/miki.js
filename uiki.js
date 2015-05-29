var uiki = {
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

uiki.init = function(wiki){
    uiki.wiki = wiki; // HUEUHEHUEUHEHUEHUEHUEHUEHUEUHEUHE
}

uiki.process = function() {
    uiki.html = uiki.wiki.replace("\r\n","\n").split("\n");
    uiki.ref = [];

    /*
     * BO headers
     * <h{1,2,3,4,5}>
     */
    uiki.html = replace_re(uiki.html,
                           /={5}(.+)={5}/i,
                           "<h5>$1</h5>",
                           "===== h5 =====");

    uiki.html = replace_re(uiki.html,
                           /={4}(.+)={4}/i,
                           "<h4>$1</h4>",
                           "==== h4 ====");

    uiki.html = replace_re(uiki.html,
                           /={3}(.+)={3}/i,
                           "<h3>$1</h3>",
                           "=== h3 ===");

    uiki.html = replace_re(uiki.html,
                           /={2}(.+)={2}/i,
                           "<h2>$1</h2>",
                           "== h2 ==");

    uiki.html = replace_re(uiki.html,
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
    uiki.html = replace_re(uiki.html,
                           /'{3}(.[^']*)'{3}/gi,
                           "<strong>$1</strong>",
                           "'''bold'''");

    uiki.html = replace_re(uiki.html,
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

    uiki.html = replace_re(uiki.html,
                           /\[{2}(.[^|\]]+)\]{2}/ig,
                           "<a href='self:$1'>$1</a>",
                           "[[abc]] | [[w:abc]]");

    uiki.html = replace_re(uiki.html,
                           /\[{2}(.[^\]]+)\|(.[^\]]+)\]{2}/gi,  /*/\[{2}(.*)\|(.[^\]]*)\]{2}/i,*/
                           "<a href='$1'>$2</a>",
                           "[[abc|def]]");

    uiki.html = replace_re(uiki.html,
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
    uiki.html = replace_re(uiki.html,
                           /^\*(.*)/i,
                           "<li>$1</li>",
                           "* abcdef");

    /*
     * EO bold & italic
     */

    /*
     * BO references
     * <ref>
     */
    uiki.ref = match_re(uiki.html,
                        /<ref>(.*)<\/ref>/i,
                        "$1",
                        "<ref>abc</ref>");

    // for(var i=0;i<references.length;i++){
    //     console.log(references[i][1]);
    // }

    uiki.html = replace_re(uiki.html,
                           /<ref>(.*)<\/ref>/i,
                           "$1",
                           "<ref>abc</ref>");

    uiki.html = replace_re(uiki.html,
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
    uiki.html = replace_re(uiki.html,
                           /\|(.+)=(.+)/i,
                           "",
                           "|abc=def");

    uiki.html = replace_re(uiki.html,
                           /{{2}(.*)/i,
                           "",
                           "{{{abc");

    uiki.html = replace_re(uiki.html,
                           /}{2}/i,
                           "",
                           "}}}");

    /*
     * EO sidetable
     */

    //return uiki.html.join("\n");
}

uiki.as_html = function(){
    return uiki.html.join("\n");
}

uiki.listref = function(){
    return uiki.ref;
}


if (typeof exports === 'object') {
    for (var i in uiki) {
        exports[i] = uiki[i];
    }
}

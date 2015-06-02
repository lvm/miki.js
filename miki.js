String.prototype.fix_newlines = function(){
    return this
        .replace(/<\/?br ?\/?>/gi,"\n")
        .replace("\r\n","\n");
}

String.prototype.fix_tabs = function(){
    return this
        .replace(/\t/g,"&emsp;")
}

function replace_re(where, re, sub, comment){
    if( typeof(where) !== "string" ){
        for(var i=0;i<where.length;i++){
            match = where[i].match(re);
            if(match){
                //console.log( comment||"", match );
                where[i] = replace_re(where[i], re, sub, comment);
            }
        }
    }
    else{
        where = where.replace(re, sub);
    }
    return where;
}

function match_re(where, re, comment){
    var matches = [];
    if( typeof(where) !== "string" ){
        for(var i=0;i<where.length;i++){
            match = where[i].match(re);
            if(match){
                //console.log( comment||"", match );
                matches.push(match);
            }
        }
    }
    else{
        match = where.match(re);
        if(match){
            //console.log( comment||"", match );
            matches.push(match);
        }
    }
    return matches;
}

function build_listref(where){
    var re = /<ref><a href='(.*)'>(.*)<\/a><\/ref>/i;
    var r = 0;
    var ref = [];
    var url = "";

    where = replace_re(where, re, "$& _REFHERE_", re.toString());
    for(var i=0;i<where.length;i++){
        if( /_REFHERE_/.test(where[i]) ){
            url = where[i].match(re)[1] || "#";
            where[i] = where[i]
                .replace(/_REFHERE_/, '<a href="#cite_note-n">[n]</a>'.replace(/n/g,r))
                .replace(re, "");
            ref.push( '<li id="#cite_note-nref"><a name="#cite_note-nref" href="{url}">[nref]</a></li>'
                      .replace(/nref/g,r).replace("{url}", url) );
            r++;
        }
    }

    where = replace_re(where,
                       /{{listaref}}/i,
                       "<ul>"+ref.join("")+"</ul>");

    return where;
}

var miki = {
    wiki: undefined,
    html: undefined,
    ref: undefined,
};

miki.parse = function(wiki){
    miki.wiki = wiki; // HUEUHEHUEUHEHUEHUEHUEHUEHUEUHEUHE
    miki.html = miki.wiki.fix_newlines().split("\n");
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
                           /'{3}(.[^']+)'{3}/gi,
                           "<strong>$1</strong>",
                           "'''bold'''");

    miki.html = replace_re(miki.html,
                           /'{2}(.[^']+)'{2}/gi,
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
                           /\[{2}((file|archivo))(.+)\]{2}/ig,
                           "",
                           "[[file:abc|bla|bla]]");

    miki.html = replace_re(miki.html,
                           /\[{2}(.[^|\]]*)\]{2}/ig,
                           "<a href='$1'>$1</a>",
                           "[[abc]] | [[w:abc]]");

    miki.html = replace_re(miki.html,
                           /\[{2}(.[^\]]+)\|(.[^\]]+)\]{2}/gi,
                           "<a href='$1'>$2</a>",
                           "[[abc|def]]");

    miki.html = replace_re(miki.html,
                           /\[(.*:\/\/[^ ]+)(.+)\]/gi,
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
                           "<li>\t$1</li>",
                           ": abcdef");

    miki.html = replace_re(miki.html,
                           /^\*{2}(.*)/i,
                           "<li>\t$1</li>",
                           "** abcdef");

    miki.html = replace_re(miki.html,
                           /^\*(.*)/i,
                           "<li>$1</li>",
                           "* abcdef");

    miki.html = miki.html.join("\n");
    miki.html = replace_re(miki.html,
                           /[^<\/li>]([\n]+)<li>/gi,
                           "\n<ul><li>",
                           "<li>abcdef");
    miki.html = replace_re(miki.html,
                           /<\/li>([\n]+)<ul>/gi,
                           "</li></ul>\n<ul>",
                           "abcdef</li>");
    miki.html = replace_re(miki.html,
                           /<\/li>([\n]+)[^<ul>]/gi,
                           "</li></ul>\n",
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

    // miki.html = replace_re(miki.html,
    //                        /<ref>(.*)<\/ref>/i,
    //                        "$&",
    //                        "<ref>abc</ref>");

    miki.html = build_listref(miki.html);
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
    return miki.html.join("\n").fix_tabs();
}

miki.listref = function(){
    return miki.ref;
}


if (typeof exports === 'object') {
    for (var i in miki) {
        exports[i] = miki[i];
    }
}

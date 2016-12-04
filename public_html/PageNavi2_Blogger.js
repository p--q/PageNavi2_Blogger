// PageNavi_Blogger2モジュール
var PageNavi_Blogger2 = PageNavi_Blogger2 || function() {
    var pg = {  // グローバルスコープに出すオブジェクト。グローバルスコープから呼び出すときはPageNavi_Blogger2になる。
        defaults : {  // 既定値。
            "perPage" : 10, //1ページあたりの投稿数。
            "numPages" : 5,  // ページナビに表示する通常ページボタンの数。スタートページからエンドページまで。
            "window_width" : 320  // ウィンドウ幅がこのpx以下の時はページナビを必要に応じて2行に表示する。iPod touch 6を想定。
        },
        buttuns : {  // ボタンから起動する関数。
            redirect : function(pageNo) {  // ページ番号のボタンをクリックされた時に呼び出される関数。
                vars.pageNo = pageNo;
                if (vars.postLabel == "undefined") {vars.postLabel = false;}  // undefinedが文字列と解釈されているのを修正。
                var startPost = (vars.pageNo - 1) * vars.perPage;  // 新たに表示する先頭ページの先頭になる投稿番号を取得。
                var url;
                if (vars.postLabel) { 
                    url = "/feeds/posts/summary/-/" + vars.postLabel + "?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi_Blogger2.callback.getURL";
                } else {
                    url = "/feeds/posts/summary?start-index=" + startPost + "&max-results=1&alt=json-in-script&callback=PageNavi_Blogger2.callback.getURL";
                }
                writeScript(url);
            }
        },
        callback : {  // フィードを受け取るコールバック関数。
            getURL : function(root){  // フィードからタイムスタンプを得て表示させるURLを作成してそこに移動する。
                var post = root.feed.entry[0];  // フィードから先頭の投稿を取得。
                var timestamp = encodeURIComponent( post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29));  // 先頭の投稿からタイプスタンプを取得。
                var addr_label = "/search/label/" + vars.postLabel + "?updated-max=" + timestamp + "&max-results=" + vars.perPage + "#PageNo=" + vars.pageNo;
                var addr_page = "/search?updated-max=" + timestamp + "&max-results=" + vars.perPage + "#PageNo=" + vars.pageNo; 
                location.href =(vars.postLabel)?addr_label:addr_page;  // ラベルインデックスページとインデックスページでURLが異なることへの対応。
            }, 
            getTotalPostCount : function(root){ 
                var total_posts = parseInt(root.feed.openSearch$totalResults.$t, 10);  // 取得したフィードから総投稿総数を得る。
                createButtons(total_posts);  // 総投稿数をもとにページナビのボタンを作成する。
            }
        },
        all: function(array_elementIDs) {  // ここから開始する。引数にページナビを置換する要素のidを配列に入れる。
            array_elementIDs.forEach(function(e){
                var elem = document.getElementById(e);  // elementIDの要素の取得。
                if (elem) {vars.elements.push(elem);}  // elementIDの要素を配列に取得。
            });
            if (vars.elements.length > 0) {createPageNavi();}  // ページナビの作成。
        }
    }; // end of pg
    var vars = {  // PageNavi_Blogger2モジュール内の"グローバル"変数。
        perPage : pg.defaults.perPage,  // デフォルト値の取得。
        numPages : pg.defaults.numPages,  // デフォルト値の取得。
        window_width : pg.defaults.window_width,  // デフォルト値の取得。
        jumpPages : pg.defaults.numPages, // ジャンプボタンでページ番号が総入れ替えになる設定値。
        postLabel : null,  // ラベル名。
        pageNo : null,  // ページ番号。
        currentPageNo : null,  // 現在のページ番号。
        elements : [],  // ページナビを挿入するhtmlの要素の配列。
        buttunElems : []  // ボタン要素を入れる配列。
    };
    function createElem(tag){  // tagの要素を作成して返す。
       return document.createElement(tag); 
    }   
    function createButtons(total_posts) {  // 総投稿数からページナビのボタンを作成。
        var numPages = vars.numPages;  // ページナビに表示するページ数。
        var prevText = '«';  // 左向きスキップのための矢印。
        var nextText = '»';  // 右向きスキップのための矢印。
        var diff =  Math.floor(numPages / 2);  // スタートページ - 現在のページ = diff。
        var pageStart = vars.currentPageNo - diff;  // スタートページの算出。
        if (pageStart < 1) {pageStart = 1;}  // スタートページが1より小さい時はスタートページを1にする。
        var lastPageNo = Math.ceil(total_posts / vars.perPage); // 総投稿数から総ページ数を算出。
        var pageEnd = pageStart + numPages - 1;  // エンドページの算出。
        if (pageEnd > lastPageNo) {pageEnd = lastPageNo;} // エンドページが総ページ数より大きい時はエンドページを総ページ数にする。
        if (pageStart > 1) {vars.buttunElems.push(createFirstPageButton(1));}  // スタートページが2以上のときはスタートページより左に1ページ目のボタンを作成する。
        if (pageStart == 3) {vars.buttunElems.push(createNormalButton(2, 2));} // スタートページが3のときはジャンプボタンの代わりに2ページ目のボタンを作成する。
        if (pageStart > 3) {  // スタートページが4以上のときはジャンプボタンを作成する。
            var prevNumber = pageStart - vars.jumpPages + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
            (prevNumber < 2)?vars.buttunElems.push(createFirstPageButton(prevText)):vars.buttunElems.push(createNormalButton(prevNumber, prevText));  // ページ番号が1のときだけボタンの作り方が異なるための場合分け。
        }
        for (var j = pageStart; j <= pageEnd; j++) {vars.buttunElems.push((j == vars.currentPageNo)?createCurrentNode(j):((j == 1)?createFirstPageButton(j):createNormalButton(j, j)));}  // スタートボタンからエンドボタンまで作成。
        if (pageEnd == lastPageNo - 2) {vars.buttunElems.push(createNormalButton(lastPageNo - 1, lastPageNo - 1));}  // エンドページと総ページ数の間に1ページしかないときは右ジャンプボタンは作成しない。
        if (pageEnd < (lastPageNo - 2)) {  // エンドページが総ページ数より3小さい時だけ右ジャンプボタンを作成。
            var nextnumber = pageEnd + 1 + diff;  // ジャンプボタンでジャンプしたときに表示するページ番号。
            if (nextnumber > lastPageNo) {nextnumber = lastPageNo;} // 表示するページ番号が総ページ数になるときは総ページ数の番号にする。
            vars.buttunElems.push(createNormalButton(nextnumber, nextText));  // 右ジャンプボタンの作成。
        }
        if (pageEnd < lastPageNo) {vars.buttunElems.push(createNormalButton(lastPageNo, lastPageNo));}  // 総ページ番号ボタンの作成。
        writeHtml(pageStart, pageEnd, lastPageNo);  // htmlの書き込み。
    };
    function createPageNavi() {  // URLからラベル名と現在のページ番号を得、その後総投稿数を得るためのフィードを取得する。
        var thisUrl = location.href;  // 現在表示しているURL。
        if (/\/search\/label\//i.test(thisUrl)) {  // ラベルインデックスページの場合URLからラベル名を取得。
            vars.postLabel = /\/search\/label\/(.+)(?=\?)/i.exec(thisUrl)[1];  // 後読みは未実装の可能性あるので使わない。
        } 
        if (!/\?q=|\.html$/i.test(thisUrl)) {  // 検索結果や固定ページではないとき。
            vars.currentPageNo = (/#PageNo=/i.test(thisUrl))?/#PageNo=(\d+)/i.exec(thisUrl)[1]:1;  // URLから現在のページ番号の取得。
            var url;  // フィードを取得するためのURL。
            if (vars.postLabel) {  // 総投稿数取得のためにフィードを取得するURLの作成。ラベルインデックスのときはそのラベル名の総投稿数を取得するため。
                url = '/feeds/posts/summary/-/' + vars.postLabel + "?alt=json-in-script&callback=PageNavi_Blogger2.callback.getTotalPostCount&max-results=1";          
            } else {
                url = "/feeds/posts/summary?max-results=1&alt=json-in-script&callback=PageNavi_Blogger2.callback.getTotalPostCount";
            }
            writeScript(url); 
        }
    };    
    function createNormalButton(pageNo, text) {  // redirectするボタンの作成。
        //ボタンから起動する関数はグローバルスコープから呼ばれるのでpgではなくPageNavi_Blogger2で呼び出す。
        var spanNode = createButtonNode(text);      
        spanNode.firstChild.href = "#";
        //spanNode.firstChild.onclick = function(){alert("ボタン");};
        spanNode.firstChild.onclick = function() {
            pg.buttuns.redirect(pageNo,vars.perPage,vars.postLabel);
            //alert("ボタン");
            return false;
        }; // vars.postLabelは文字列なので、クオーテーションが必要。undefinedも文字列として解釈される。
        return spanNode;
    }
    function createFirstPageButton(text) {  // 1メージ目のボタンのhtmlを返す。ボタン表示は1かジャンプ矢印になる。
        var spanNode = createButtonNode(text); 
        spanNode.firstChild.href = (!vars.postLabel)?"/":"/search/label/" + vars.postLabel + "?max-results=" + vars.perPage;
        return spanNode;
    }
    function createButtonNode(text){
        var spanNode = createElem('span');
        spanNode.className = "displaypageNum";
        spanNode.appendChild(createElem('a'));
        spanNode.firstChild.textContent = text;
        return spanNode;
    }
    function createCurrentNode(j) {
        var spanNode = createElem('span');
        spanNode.className = "pagecurrent";        
        spanNode.textContent = j;
        return spanNode;
    }
    function writeScript(url) {  // document.write()の代替。URLを読み込む。
        var ws = createElem('script');
        ws.type = 'text/javascript';
        ws.src = url;
        document.getElementsByTagName('head')[0].appendChild(ws);
    };
    function writeHtml(pageStart, pageEnd, lastPageNo) {  // htmlの書き込み。
        var divNode = createElem('div');
        vars.buttunElems.forEach(function(b){divNode.appendChild(b);});
        vars.elements.forEach(function(e){
            // var dupNode = divNode.cloneNode(true);
            var dupNode = divNode;
            e.appendChild(dupNode);
            
//            e.appendChild(divNode);
            
        });  // 要素を書き換え。
        //
        //
        //
        //
        //
        //
//        vars.elements[0].appendChild(divNode);
        
        
        
//        var left = vars.buttunElems.join('');  // 左ジャンプボタンとその左側のボタンのhtml。
//        var center = vars.buttunElems.join('');  // スタートページからエンドページまでのボタンのhtml。
//        var right = vars.buttunElems.join('');  // 右ジャンプボタンとその右側のボタンのhtml。
//        var html;
//        if (  window.innerWidth > vars.window_width || (pageEnd < 11) || (pageStart > lastPageNo - vars.numPages)) {  // すべてのボタンを1行で表示する場合。
//            html = left + center + right; // 配列の要素をすべて結合する。
//        } else {  // スクリーン幅がせまく、かつ、（表示の終わりのページ番号が10より大きい時、または、表示の始まりのページ番号が最終ページ番号とページナビに表示するページ数の差以下の時)
//            if (pageEnd >= lastPageNo - 2) {  // 右のジャンプボタンがないときは右のみ次行に表示させない。
//                center += right;
//                right = null;
//            }
//            html = '<div style="text-align: center;line-height:2.2;">' + center + '</div>';
//            if (left || right){  // ジャンプボタンより外側は2行目に表示する。
//                html += '<div style="line-height:2.4;">';
//                if (left) {html += '<span style="text-align: left;float: left;">' + left + '</span>';}
//                if (right) {html += '<span style="float: right;">' + right + '</span>';}
//                html += '</div>';
//            } 
//        }
//        vars.elements.forEach(function(e){e.innerHTML = html;});  // 要素を書き換え。
    };
    return pg;
}();
//デフォルト値を変更したいときは以下のコメントアウトをはずして設定する。
//PageNavi_Blogger2.defaults["perPage"] = 10 //1ページあたりの投稿数。
//PageNavi_Blogger2.defaults["numPages"] = 5 // ページナビに表示するページ数。
//PageNavi_Blogger2.defaults["window_width"] = 320 // ウィンドウ幅がこの幅px以下の時はページナビを2行にする。
//PageNavi_Blogger2.all(["blog-pager","blog-pager2"]);  // ページナビの起動。引き数にHTMLの要素のidを配列で入れる。
PageNavi_Blogger2.all(["blog-pager"]);  // ページナビの起動。引き数にHTMLの要素のidを配列で入れる。
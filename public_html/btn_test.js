
    function createNormalButton(text) {  // redirectするボタンの作成。
        //ボタンから起動する関数はグローバルスコープから呼ばれるのでpgではなくPageNavi_Blogger2で呼び出す。
        var spanNode = createButtonNode(text);      
        spanNode.firstChild.href = "#";
        spanNode.firstChild.onclick = function(){alert("ボタン");};
//        spanNode.firstChild.onclick = function() {
////            pg.buttuns.redirect(pageNo,vars.perPage,vars.postLabel);
//            alert("ボタン");
//            return false;
//        }; // vars.postLabelは文字列なので、クオーテーションが必要。undefinedも文字列として解釈される。
        return spanNode;
    }
    function createButtonNode(text){
        var spanNode = createElem('span');
        spanNode.className = "displaypageNum";
        spanNode.appendChild(createElem('a'));
        spanNode.firstChild.textContent = text;
        return spanNode;
    }
    function createElem(tag){  // tagの要素を作成して返す。
       return document.createElement(tag); 
    }   
    
    var btnelem = createNormalButton("テスト");
    var elem = document.getElementById("id");  // elementIDの要素の取得。
    elem.appendChild(btnelem);
$(document).foundation();

// 本来はサーバー側で処理してユーザーからは見えないようにする
const API_KEY = "60e919407001d7a00adc7f4a8764a2d9";
const MAIN_BLOCK = document.getElementById("main-block");

let favshops = new FavoriteShops();

// 全ての子要素を削除する
function removeAllChild() {
  while (MAIN_BLOCK.firstChild) MAIN_BLOCK.removeChild(MAIN_BLOCK.firstChild);
}

// API 呼び出しの関数
function loadUrl() {
  // 全ての子要素を削除する
  removeAllChild();

  // 検索ワードを取得する
  let searchData = document.getElementById("search-id").value;
  let _url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=${API_KEY}&freeword=${searchData}`;

  let xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    let res = JSON.parse(xhttp.responseText);
    for (let i = 0; i < res.rest.length; i++) {
      let card = new CardItem(res.rest[i]);
      MAIN_BLOCK.appendChild(card.node);
    }
  }
  // データ取得開始
  xhttp.open("GET", _url, true);
  xhttp.send();
}
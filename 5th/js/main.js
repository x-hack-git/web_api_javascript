$(document).foundation();

// 本来はサーバー側で処理してユーザーからは見えないようにする
const API_KEY = "60e919407001d7a00adc7f4a8764a2d9";
const MAIN_BLOCK = document.getElementById("main-block");
const FAVORITE_SHOPS_KEY = "favorite_shops";

let favorite_shops = localStorage.getItem(FAVORITE_SHOPS_KEY);
// 未定義だった場合は初期化、そうでない場合は文字を配列型に変換しておく
if(!favorite_shops){
  favorite_shops = [];
}else{
  favorite_shops = favorite_shops.split(",");
}

// API 呼び出しの関数
function loadUrl() {
  // 全ての子要素を削除する
  while (MAIN_BLOCK.firstChild) MAIN_BLOCK.removeChild(MAIN_BLOCK.firstChild);
  // 検索ワードを取得する
  let searchData = document.getElementById("search-id").value;
  let _url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=${API_KEY}&freeword=${searchData}`;

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let res = JSON.parse(xhttp.responseText);
      for (let i = 0; i < res.rest.length; i++) {
        let card = new CardItem(res.rest[i]);
        MAIN_BLOCK.appendChild(card.node);
      }
    }
  }
  // データ取得開始
  xhttp.open("GET", _url, true);
  xhttp.send();
}

// カードブロックのクラス
class CardItem {
  constructor (item){
    this.id = item.id;
    this.node = document.createElement("div");
    this.node.classList.add("column");
    this.node.innerHTML = this.card_item(
      item.name,
      item.pr.pr_short,
      item.image_url.shop_image1,
      item.address,
    );
    // お気に入りリストに存在するか？
    if(favorite_shops.includes(this.id)){
      this.node.querySelector(".favorite").classList.add("on");
    }
    // クリックした時の処理
    this.node.querySelector(".favorite").onclick = function () {
      let id = this.getAttribute("data-id");
      if(this.classList.contains("on")) {
        this.classList.remove("on");
        favorite_shops = favorite_shops.filter((item) => {
          if(item != id) return item;
        })
      }else{
        this.classList.add("on");
        if(!favorite_shops.includes(id)){
          favorite_shops.push(id);
        }
        localStorage.setItem(FAVORITE_SHOPS_KEY, favorite_shops);
      }
    }
    // 要素のカスタム属性(HTML5カスタムデータ属性)に識別子をセットする
    this.node.querySelector(".favorite").setAttribute("data-id", this.id);
  }

  card_item(title, text, image, address) {
    return `
      <div class="card" style="width: 300px;">
        <div class="card-divider">
          ${title}
        </div>
        <div class="sample-box">
          <img src="${image}">
          <div class="favorite">
            <i class="fa fa-star"></i>
          </div>
        </div>
        <div class="card-section">
          <p>${text}</p>
          <p>${address}</p>
        </div>
      </div>
    `;
  }
}
// カードブロックのクラス
// レストランの1店舗の情報が集約されたクラス
class CardItem {
  constructor(item) {
    this.id = item.id;
    this.node = document.createElement("div");
    this.node.classList.add("column");
    this.node.innerHTML = this.card_item(item);
    this.fav_icon = this.node.querySelector(".favorite");
    // お気に入りリストに存在するか？
    if (favshops.includes(this.id)) {
      this.fav_icon.classList.add("on");
    }
    // クリックした時の処理
    this.fav_icon.onclick = () => {
      let id = this.fav_icon.getAttribute("data-id");
      this.toggleFavorite(id);
    }
    // 要素のカスタム属性(HTML5カスタムデータ属性)に識別子をセットする
    this.fav_icon.setAttribute("data-id", this.id);
  }

  // お気に入りのon/off切り替え
  toggleFavorite(id) {
    let classes = this.fav_icon.classList;
    if (classes.contains("on")) {
      classes.remove("on");
      favshops.remove(id);
    } else {
      classes.add("on");
      favshops.add(id);
    }
  }

  // レストラン情報を表示するカードのHTMLを生成する
  card_item(item) {
    return `
      <div class="card" style="width: 300px;">
        <div class="card-divider">
          ${item.name}
        </div>
        <div class="sample-box">
          <img class="image" src="${item.image_url.shop_image1}">
          <div class="favorite">
            <i class="fa fa-star"></i>
          </div>
        </div>
        <div class="card-section">
          <p>${item.pr.pr_text}</p>
          <p>${item.address}</p>
        </div>
      </div>
    `;
  }
}
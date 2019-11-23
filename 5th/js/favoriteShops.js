// ローカルストレージへのデータの書き込みを制御する関数
class FavoriteShops {

  constructor() {
    this.FAVORITE_SHOPS_KEY = "favorite_shops";
    this.favorite_shops = localStorage.getItem(this.FAVORITE_SHOPS_KEY);
    if (!this.favorite_shops) {
      this.favorite_shops = [];
    } else {
      this.favorite_shops = this.favorite_shops.split(",");
    }
  }

  // 引数に与えられたデータを配列に追加する処理
  add(id) {
    // 早期リターン early return
    if (this.favorite_shops.includes(id)) return;

    this.favorite_shops.push(id);
    localStorage.setItem(this.FAVORITE_SHOPS_KEY, this.favorite_shops);
  }

  // 引数に与えられたデータを配列から削除する処理
  remove(id) {
    this.favorite_shops = this.favorite_shops.filter((item) => {
      if (item != id) return item;
    });
    localStorage.setItem(this.FAVORITE_SHOPS_KEY, this.favorite_shops);
  }

  // idがデータに含まれているか？ 
  includes(id) {
    return this.favorite_shops.includes(id);
  }
}
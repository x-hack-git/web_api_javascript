"use strict";
// モデルを考える
// モデルとは：そのアプリケーションのやりたいことを説明（＝ユーザーストーリー）するときに出てくる登場人物
// 食べログAPIで店を検索したい
// お気に入りに店を追加したい
// ↓ストーリーから仕様に落とし込む
// 詳細設計（クラス[なにが]とファンクション[何をする]を定義）
// サーチメソッドのあるぐるなびAPIクラスを作成する
// サーチメソッドは店クラスのインスタンスの配列を返す

// 店クラスの定義
const API_KEY = "201d6d74395c32817d558de2e04183d2";
// キーワードでの検索結果を表示する
const button = document.getElementById("searchButton");

button.addEventListener("click", () => {
  let searchWord = document.getElementById("searchWord").value;
  let gurunabiAPI = new GurunabiAPI();
  gurunabiAPI.search(searchWord, restaurants => {
    let render = new Renderer();
    render.clearHTML();
    render.renderToHtml(restaurants);
  });
});
// お気に入りを表示する
const favButton = document.getElementById("favlist");
favButton.addEventListener("click", () => {
  let gurunabiAPI = new GurunabiAPI();
  let favorite = new Favorite();
  let shopIdList = favorite.getAll();
  gurunabiAPI.getRestaurantsByIds(shopIdList);
});
// 店クラス
class Restaurant {
  constructor(name, image, shopId) {
    this.name = name;
    this.image = image;
    this.shopId = shopId;
  }
}
// ぐるなびAPIクラス（サーチメソッド）
class GurunabiAPI {
  search(searchWord, callback) {
    //let searchWord = document.getElementById("search-id").Value;
    let url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=${API_KEY}&freeword=${searchWord}`;
    this.sendRequest(url, callback);
  }
  sendRequest(url) {
    const request = new XMLHttpRequest();
    request.onload = function() {
      let res = JSON.parse(request.responseText);
      let restaurants = [];
      for (let i = 0; i < res.rest.length; i++) {
        let restaurantName = res.rest[i].name;
        let restaurantImage = res.rest[i].image_url.shop_image1;
        let restaurantId = res.rest[i].id;
        let restaurant = new Restaurant(
          restaurantName,
          restaurantImage,
          restaurantId
        );
        restaurants.push(restaurant);
      }
      
      let render = new Renderer();
      render.clearHTML();
      render.renderToHtml(restaurants);
      
      //callback(restaurants);
    };
    request.open("GET", url, true);
    request.send();
  }
  // shopidからレストランを取得するメソッド
  getRestaurantsByIds(favoriteShopIdList) {
    let strFavoriteShopIdList = favoriteShopIdList.join(",");
    let url = `https://api.gnavi.co.jp/RestSearchAPI/v3/?keyid=201d6d74395c32817d558de2e04183d2&id=${strFavoriteShopIdList}`;
    this.sendRequest(url);
  }
}
// レンダークラス（htmlにレンダリングされる）
class Renderer {
  renderToHtml(restaurants) {
    document.body.appendChild(wrapper);
    for (let i = 0; i < restaurants.length; i++) {
      let restaurant = restaurants[i];
      let div = document.createElement("div");
      div.innerHTML = restaurant.name;
      wrapper.appendChild(div);
      let iconWrapper = document.createElement("span");
      iconWrapper.addEventListener("click", () => {
        //console.log(restaurant.shopId);
        let favorite = new Favorite();
        if (favorite.getAll().includes(restaurant.shopId)) {
          favorite.remove(restaurant.shopId);
        } else {
          favorite.add(restaurant.shopId);
        }
      });
      let icon = document.createElement("i");
      icon.classList.add("far");
      icon.classList.add("fa-heart");
      iconWrapper.appendChild(icon);
      div.append(iconWrapper);
      let img_node = document.createElement("img");
      img_node.src = restaurant.image;
      div.append(img_node);
    }
  }
  clearHTML() {
    let wrapper = document.getElementById("wrapper");
    while (wrapper.firstChild) {
      wrapper.removeChild(wrapper.firstChild);
    }
  }
}
// お気に入りクラス
// shop_idとステータスをもつ
// ローカルストレージに追加、削除、取得するメソッドをもつ
class Favorite {
  add(shopId) {
    let favoriteShopIdList = this.getAll();
    favoriteShopIdList.push(shopId);
    localStorage.setItem(
      "favoriteShopIdList",
      JSON.stringify(favoriteShopIdList)
    );
  }
  remove(shopId) {
    let favoriteShopIdList = this.getAll();
    let newFaoriteShopIdList = favoriteShopIdList.filter(
      shop => shop !== shopId
    );
    localStorage.setItem(
      "favoriteShopIdList",
      JSON.stringify(newFaoriteShopIdList)
    );
  }
  getAll() {
    let favoriteShopIdList = localStorage.getItem("favoriteShopIdList")
      ? JSON.parse(localStorage.getItem("favoriteShopIdList"))
      : [];
    return favoriteShopIdList;
  }
}
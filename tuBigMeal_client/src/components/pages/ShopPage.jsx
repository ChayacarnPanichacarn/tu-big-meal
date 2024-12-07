// import React from 'react'

import { useLocation } from "react-router-dom"
import ShopInfo from "../ShopInfo";
import { useEffect, useState } from "react";
import MenusInShop from "../MenusInShop";

export default function ShopPage() {
    const location = useLocation();
    const {shop} = location.state || {};
    const [suggestedMenus,setSuggestedMenus] = useState([]);
    const [othersMenus,setOthersMenus] = useState([]);

    useEffect(() => {

      window.scrollTo(0,0);

      async function fetchSuggestedMenus() {
        const encodedShopName = encodeURIComponent(shop.shopName);
        const res = await fetch(`http://localhost:3000/suggestedMenusInShop?shopName=${encodedShopName}`);
  
        //go fetch data from "index.js" inside node project
  
        const data = await res.json();
        // console.log(data);
        // console.log(data);
        setSuggestedMenus(data);
      }

      async function fetchOthersMenus() {
        const encodedShopName = encodeURIComponent(shop.shopName);
        const res = await fetch(`http://localhost:3000/othersMenusInShop?shopName=${encodedShopName}`);
  
        //go fetch data from "index.js" inside node project
  
        const data = await res.json();
        // console.log(data);
        // console.log(data);
        setOthersMenus(data);
      }
  
      fetchSuggestedMenus();
      fetchOthersMenus()
    }, [shop]);

    return (
      <div className="shopPage">
          <ShopInfo shop={shop} />
          <MenusInShop menus={suggestedMenus} header={"เมนูแนะนำ"} page={'shop-page'}/>
          <MenusInShop menus={othersMenus} header={"เมนูอื่นภายในร้าน"} page={'shop-page'} />
          <br></br><br></br><br></br><br></br>
      </div>
    )
}

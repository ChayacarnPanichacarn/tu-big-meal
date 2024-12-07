// import React from 'react'

// import { useAsyncError } from "react-router-dom";
import AllShops from "../AllShops";
import Carousel from "../Carousel";
import SearchBar from "../SearchBar";
import SearchResults from "../SearchResults";
import Suggestions from "../Suggestions";
import Filter from "../Filter";
import { useEffect, useState} from "react";
// import {useContext } from "react";
// import { UserContext } from "../../context/UserContext"

export default function Homepage() {

  const [query,setQuery] = useState("");
  const showPage = query.length <= 0;

  const [canteen, setCanteen] = useState(localStorage.getItem('canteen') || 'ทั้งหมด')
  const [category, setCategory] = useState(localStorage.getItem('category') || 'ทั้งหมด');

  const [allSuggestedMenus, setAllSuggestedMenus] = useState([]);
  const [menus, setMenus] = useState([]);

  const [allShops,setAllShops] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {

    async function fetchSuggestedMenus() {
      const res = await fetch('http://localhost:3000/suggestedMenus');

      const data = await res.json();
      setAllSuggestedMenus(data);
    }

    async function fetchAllShops() {
      const res = await fetch('http://localhost:3000/shops');

      const data = await res.json();
      setAllShops(data);
    }

    fetchSuggestedMenus();
    fetchAllShops();
  }, []);

  const checkMenus = async(shopName, canteen, category) => {

    try{
      const response = await fetch(`http://localhost:3000/findShopByShopName?shopName=${encodeURIComponent(shopName)}`,{
          method: 'GET',
          headers:{
              'Content-Type': 'application/json',
          },
      });

      if(response.ok){
          const shop = await response.json();
          return (canteen === 'ทั้งหมด' || shop.canteen === canteen) && (category === 'ทั้งหมด' || shop.category === category);
      }

    }catch(error){
      console.log(error.message);
    }
  }

  useEffect(() => {

    async function filterMenusAndShop() {

      if(canteen === 'ทั้งหมด' && category === 'ทั้งหมด'){
        setShops(allShops);
        
        localStorage.setItem("AllSuggestedMenus", JSON.stringify(allSuggestedMenus));
        setMenus(allSuggestedMenus.filter((_, idx) => {return idx < 12}));
      }
      else{
        const filteredShops = allShops.filter((shop) => {
          return (canteen === 'ทั้งหมด' || shop.canteen === canteen) && (category === 'ทั้งหมด' || shop.category === category)
        })
        setShops(filteredShops);
  
        const filteredMenus = await Promise.all(
          allSuggestedMenus.map(async(menu) => {return await checkMenus(menu.shopName, canteen, category)})
        );
        
        const allFilteredSuggestMenus = allSuggestedMenus.filter((_, idx) => filteredMenus[idx])
        localStorage.setItem("AllSuggestedMenus", JSON.stringify(allFilteredSuggestMenus));
        setMenus(allFilteredSuggestMenus.filter((_, idx) => {return idx < 12}))
      }
    }

    filterMenusAndShop();
    
  }, [canteen, category, allShops, allSuggestedMenus]);

  return (
    <div className="homepage">
      <SearchBar query={query} setQuery={setQuery}/>
      {showPage? (
        <div>
          <Carousel shops={allShops} />
          <Filter canteen={canteen} setCanteen={setCanteen} category={category} setCategory={setCategory} />
          <Suggestions menus={menus} header={"เมนูแนะนำ"} page={'homepage'} />
          <AllShops shops={shops} />
        </div>
      ):(
        <SearchResults query={query} setQuery={setQuery}/>
      )}

    </div>
  )
}

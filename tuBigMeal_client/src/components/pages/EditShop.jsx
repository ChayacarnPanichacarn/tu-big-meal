// import React from 'react'
import { useEffect, useState } from "react";

import EditShopInfo from "../EditShopInfo";
import EditMenu from "../EditMenu";
import { UserContext } from "../../context/UserContext"
import { useContext } from "react";
import EditMode from "../EditMode";

export default function EditShop() {

  const {user} = useContext(UserContext);
  const [shop, setShop] = useState(null);
  const [shopMode, setShopMode] = useState(true);

  useEffect(() => {
    async function fetchOwnersShop() {
      try{
        const res = await fetch(`http://localhost:3000/ownersShop?gmail=${user.gmail}`);
        const data = await res.json();

        if(res.ok){
          setShop(data);
        }
        else{
          console.log("Error fetching shop: ",data.message);
        }
      }catch(error){
        console.log("Server error: ",error);
      }
    }
    fetchOwnersShop();

  }, [user]);

  return (
    <div>
      <EditMode shopMode ={shopMode} setShopMode={setShopMode}/>

      {shopMode? 
        <EditShopInfo shop={shop} setShop={setShop}/> 
        : (
          <div>
            <EditMenu shop={shop} />
            <br></br><br></br><br></br>
          </div>)
      }
  
    </div>
  )
}

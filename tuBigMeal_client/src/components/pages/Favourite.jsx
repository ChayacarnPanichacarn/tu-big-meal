import { useState, useEffect, useContext } from "react";
import MenusInShop from "../MenusInShop";
import { UserContext } from "../../context/UserContext"

export default function Favourite() {

  const [favMenus ,setFavMenus] = useState([]);
  const {user} = useContext(UserContext);

  useEffect(() => {

    const fetchFavouriteMenus = async() => {

      if(user.favourite.length > 0){
        try{
          const response = await fetch('http://localhost:3000/findMenusByListOfNameAndShop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user.favourite),
          });
  
          if(response.ok){
            const data = await response.json();
            // console.log(data);
            setFavMenus(data);
          }
          else{
            const errorData = await response.json();
            console.log("Error: ", errorData.message);
          }
  
        }catch(error){
          console.error('Error:', error);
        }
      }
      else{
        setFavMenus([]);
      }
    }

    fetchFavouriteMenus();
  }, [user])

  return (
    <div>
      <MenusInShop menus={favMenus} header={"เมนูที่คุณถูกใจ"} page={'fav-page'} />
      <br></br><br></br><br></br>
    </div>
  )
}

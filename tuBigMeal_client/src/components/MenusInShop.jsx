import Proptypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import "./MenusInShop.css"
import { UserContext} from "../context/UserContext"
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

function MenusInShop(props) {

    const {menus, header, page} = props;
    const {user, setUser} = useContext(UserContext);
    const navigate = useNavigate();

    const [fav, setFav] = useState([]);

    useEffect(() => {
        if(user){
            const favList = user.favourite;
            setFav(menus.map((menu) => {
                return favList.some((fav) => fav.menuName === menu.menuName && fav.shopName === menu.shopName);
            }))
        }

    }, [user, menus])

    const goToShop = async(shopName) => {

        const response = await fetch(`https://tu-big-meal.onrender.com/findShopByShopName?shopName=${encodeURIComponent(shopName)}`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            const shop = await response.json();
            navigate('/shop-detail', {state: {shop}});
        }
    }

    const clickFavButton = async(i) => {

        try{
            if(user){
                let list = user.favourite;

                //add
                if(!fav[i]){
                    list.push({shopName: menus[i].shopName, menuName: menus[i].menuName});
                }
                //delete
                else{
                    list = list.filter((menu) => 
                        !(menu.shopName === menus[i].shopName && menu.menuName === menus[i].menuName)
                    )
                }

                //almost change nothing but at least in case delete, button turned grey before page refresh
                setFav((prev) =>
                    prev.map((fav,index) => (index === i ? !fav : fav))
                );

                const response = await fetch('https://tu-big-meal.onrender.com/editUserFavourite', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                    "gmail": user.gmail,
                    list
                    }),
                });
                
                if(response.ok){
                    const data = await response.json();
                    // console.log(data);
                    setUser(data.user);
                }
                else{
                    const errorData = await response.json();
                    console.log("Error: ", errorData.message);
                }
            }
            else{
                alert("กรุณาเข้าสู่ระบบเพื่อเข้าถึงการใช้งานฟีเจอร์");
            }

        }catch(error){
            console.error('Error:', error);
        }
    }

    return (
        <div className="edit-menu">
            <div className="suggest-heading">
                <h3>{header}</h3>
            </div>

            <div className="menu-container">

                {menus.length > 0 ? (

                    menus.map((menu, i) => (
                    <div className="menu-box" key={i}>

                        {/* for show in shop page (not link) */}
                        {page === 'shop-page' && (
                            <div className="menu-image">
                                <img src={menu.menuImg} alt="Suggest"></img>
                            </div>
                        )}
                        {page === 'shop-page' && (
                            <div className="menu-text">
                                <p>{menu.menuName}</p>
                                <span>ราคา {menu.normalPrice} บาท</span>
                            </div>
                        )}

                        {/* for show in favourite page (link to shop) */}
                        {page === 'fav-page' && (
                            <div className="menu-image menu-image-fav">
                                <img src={menu.menuImg} alt="Suggest" onClick={() => goToShop(menu.shopName)}></img>
                            </div>
                        )}
                        {page === 'fav-page' && (
                            <div className="menu-text menu-text-fav">
                                <p onClick={() => goToShop(menu.shopName)}>{menu.menuName}</p>
                                <span>{menu.shopName}</span>
                                <span>ราคา {menu.normalPrice} บาท</span>
                            </div>
                        )}

                        <button 
                        className={fav[i] ? "fav-button-click": "fav-button"}
                        onClick={() => clickFavButton(i)}
                        >
                            <FontAwesomeIcon icon={faHeart} />
                        </button>
                    </div>
                    ))
                ):(
                    page === 'fav-page'? (
                        <div className="no-fav-menus">
                            <p>ไม่มีรายการที่ถูกใจ</p>
                            <FontAwesomeIcon icon={faCircleExclamation} />
                        </div>
                    ):(
                        null
                    )
                )}

            </div>
        </div>
    );
}

MenusInShop.propTypes = {
    menus: Proptypes.array,
    header: Proptypes.string,
    page: Proptypes.string
}

export default MenusInShop;

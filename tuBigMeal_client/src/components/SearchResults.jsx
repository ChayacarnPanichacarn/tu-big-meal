import "./SearchResults.css"
import { useEffect, useState } from "react";
import Proptypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowLeft, faFaceSadTear} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";

function SearchResults(props) {

    const {query, setQuery} = props;
    const [searchedMenus,setSearchedMenus] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSearchedMenus() {

            if(!query) return;

            const encodedQuery = encodeURIComponent(query);
            const res = await fetch(`https://tu-big-meal.onrender.com/searchMenus?searchQuery=${encodedQuery}`);

            const data = await res.json();
            setSearchedMenus(data);
        }

        fetchSearchedMenus()
    }, [query]);

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

    return (
        <div className="search-results">
            <div className="back">
                <button className="turn-back" onClick={() => setQuery("")}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <p>ย้อนกลับ</p>
            </div>

            {searchedMenus.length > 0 ? 
                (<div className="menu-search">
                    {searchedMenus.map((menu) => (
                        <div className="menu-item" key={menu._id}>
                            <img onClick={() => goToShop(menu.shopName)} src={menu.menuImg}></img>
                            <div className="menu-content">
                                <h3 onClick={() => goToShop(menu.shopName)}>{menu.menuName}</h3>
                                <p>{menu.shopName}</p>
                                <p>ราคา {menu.normalPrice} บาท</p>
                            </div>
                        </div>
                    ))}
                </div>):
                (<div className="no-result">
                    <FontAwesomeIcon icon={faFaceSadTear} />
                    <p>ไม่พบเมนูที่ค้นหา</p>
                </div>
                )}
        </div>
    )
}

SearchResults.propTypes = {
    query: Proptypes.string.isRequired,
    setQuery: Proptypes.func
}


export default SearchResults;

// import React from 'react'
import "./Suggestions.css"
import Proptypes from 'prop-types';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faArrowRight} from '@fortawesome/free-solid-svg-icons';
// import { useState } from "react";

function Suggestions(props) {

    const {menus, header, page} = props;
    const navigate = useNavigate();

    const goToShop = async(shopName) => {

        const response = await fetch(`http://localhost:3000/findShopByShopName?shopName=${encodeURIComponent(shopName)}`,{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
            },
        });

        if(response.ok){
            const shop = await response.json();
            navigate('/shop-detail', {state: {shop}});

            // console.log(shop);
        }
    }

    return (
    <div className="suggestions">
        <div className="suggest-heading">
            <h3>{header}</h3>
        </div>

        <div className="suggest-container">

            {menus.length > 0 ? (
                menus.map((menu, i) => (
                    <div className="suggest-box" key={i}>
                        <button className="suggest-image" onClick={() => goToShop(menu.shopName)}>
                            <img src={menu.menuImg} alt="Suggest"></img>
                        </button>

                        <div className="suggest-text">
                            <p className="menu-title" onClick={() => goToShop(menu.shopName)}>{menu.menuName}</p>
                            <p className="shopName-suggest">{menu.shopName}</p>
                            <span>{menu.normalPrice} บาท</span>
                        </div>
                    </div>
                ))
            ):null}
        </div>
        
        {page === 'homepage' && (<div className="seeAll-suggestion">
            <button onClick={() => navigate('/suggest-page')}>ดูทั้งหมด <FontAwesomeIcon icon={faArrowRight} /></button>
        </div>)}

    </div>
    );
}

Suggestions.propTypes = {
    menus: Proptypes.array,
    header: Proptypes.string,
    page: Proptypes.string
}

export default Suggestions;
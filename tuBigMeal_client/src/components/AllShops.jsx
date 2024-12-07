// import React from 'react'
import "./AllShops.css"
import Proptypes from 'prop-types';
import {Link} from 'react-router-dom';


function AllShops(props) {

    const {shops} = props;

    return (
        <div className="allshops">
            <div className="shop-heading">
                <h3>ร้านอาหารทั้งหมด</h3>
            </div>
    
            <div className="shop-container">

                {shops.map((shop, i) => (
                    <div className="shop-box" key={i}>
                        <div className="shop-image">
                            <Link to={`/shop-detail`} state={{shop}}>
                                <img src={shop.shopImg} alt="AllShops"></img>
                            </Link>
                        </div>
        
                        <div className="shop-name">
                            <Link to={`/shop-detail`} state={{shop}}>
                                <p className="menu-title">{shop.shopName}</p>
                            </Link>
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
      )
}

AllShops.propTypes = {
    shops: Proptypes.array
}


export default AllShops;

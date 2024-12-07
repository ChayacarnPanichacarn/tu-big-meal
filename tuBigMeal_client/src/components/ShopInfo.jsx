// import React from 'react'
import "./ShopInfo.css"
import Proptypes from 'prop-types';

function ShopInfo(props) {

    const {shop} = props;
    const deliveryList = (shop.delivery).split(",");

    return (
    <div className="shop-info">

        <div className="shop-detail">
            <div className="imgWrapper">
                <img src={shop.shopImg} alt=""></img>
            </div>

            <div className="contentWrapper">
                <div className="content">
                    <h2>{shop.shopName}</h2>
                    <h3>{shop.shopDetail}</h3>
                    <p>ประเภทร้านอาหาร: {shop.category}</p>
                    <p>เวลาทำการ: {shop.dateTime}</p>
                    <p>โรงอาหาร: {shop.canteen}</p>
                </div>
            </div>
        </div>

        {deliveryList.length > 1 && (
            <div className="part3-delivery">
                <h3>บริการเดลิเวรี่</h3>
                <div className="list">
                    {deliveryList.includes("Grab Food") && (
                        <div className="form-element">
                            <label htmlFor="grabFood">
                                <div className="logo">
                                    <img src="https://seeklogo.com/images/G/grab-logo-7020E74857-seeklogo.com.png"></img>
                                </div>
                                <div className="title">
                                    Grab Food
                                </div>
                            </label>
                        </div>
                    )}

                    {deliveryList.includes("Food Panda") && (
                        <div className="form-element">
                            <label htmlFor="foodPanda">
                                <div className="logo">
                                    <img src="https://pbs.twimg.com/profile_images/1616004993290752001/Qb2pr6Db_400x400.png"></img>
                                </div>
                                <div className="title">
                                    Food Panda
                                </div>
                            </label>
                        </div>
                    )}

                    {deliveryList.includes("Line Man") && (
                        <div className="form-element">
                            <label htmlFor="lineMan">
                                <div className="logo">
                                    <img src="https://elmercadobangkok.com/wp-content/uploads/2021/05/el-linema-logo-02-1024x1024.jpg"></img>
                                </div>
                                <div className="title">
                                    Line Man
                                </div>
                            </label>
                        </div>
                    )}

                    {deliveryList.includes("Robinhood") && (
                        <div className="form-element">
                            <label htmlFor="robinhood">
                                <div className="logo">
                                    <img src="https://mallika.co.th/wp-content/uploads/2022/05/Logo-Robinhood-c.png"></img>
                                </div>
                                <div className="title">
                                    Robinhood
                                </div>
                            </label>
                        </div>
                    )}

                    {deliveryList.includes("Shopee Food") && (
                        <div className="form-element">
                            <label htmlFor="shopeeFood">
                                <div className="logo">
                                    <img src="https://mallika.co.th/wp-content/uploads/2022/05/logo-shopeefood-c.png"></img>
                                </div>
                                <div className="title">
                                    Shopee Food
                                </div>
                            </label>
                        </div>
                    )}

                    {deliveryList.includes("gojek") && (
                        <div className="form-element">
                            <label htmlFor="gojek">
                                <div className="logo">
                                    <img src="https://d1imgdcsrvbfip.cloudfront.net/attachment_images/1aca75793fd121adafdb850403b091337c65d042.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXVZDCJJC5AJQ47UT%2F20210617%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210617T151226Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEKn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDNULeBC%2FEJ4%2FjzrCyiKbAwAax%2Fs6FeHEWfaxl7VNbWb%2FoJfswQpvNJIKiQj2BdKqglqd%2Bse9ux6Wqoq6FUyllFnNL7SiroMj8MhluoULu0PVW0W5WPrxzbrIow06desSh1QBfGdqFrUdbdfNy1GRYOwKXeKCRr5T9eJBmsVNfMxrol7y0KGEZ%2FegAIg0VoXvQqBuo3Y5JV0Ag94H61iLv6vNq%2BwgbTzRda68ta494705aMwz6bF2aigXHIEWCvrEHviAmXS8K1uOPJ6auBLkVVa%2Bv9gdhQcUDDwSZU073Rs%2BafNQHSmwwuwZ1ybXgeBZREm6ac3QiLmAe0D8xjPOsnONRKaBoswdes1dY12bjpzae%2FnbvPtEI5QjQ3km3XyFAO6003u%2BTs8ByKvRYnJyOe9kDokpAW1uDyc0Y6nopgLSHu%2BBp63UEl%2BQCDQpDsdCht5tF2qbFAgmcL8Q3g8SqnMao6ULT7MxL5Szf84LMSKvvTtR8EGnq0dNrcK7kBouqPe6h3jAyoeRr1kwD5%2Bc5dbn%2B3glrPK%2BOUIcCo4%2BxRKBWDVEcJ3FRyYQvijHya2GBjI1FgNGm2nxIyJafRgxih4x4ec14civqQG9yQ%2BOMPPPjwFse5HcJd6%2FsYnUAmYtrlizOGNufcE%3D&X-Amz-Signature=4308f93bf89a97270428da4ea8d6e70882f74235a2cd019f556079ee58855f2b"></img>
                                </div>
                                <div className="title">
                                    gojek
                                </div>
                            </label>
                        </div>
                    )}
                </div>
            </div>
        )}

    </div>
    )
}

ShopInfo.propTypes = {
    shop: Proptypes.object
}

export default ShopInfo;

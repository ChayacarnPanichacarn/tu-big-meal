// import React from 'react'
import "./EditShopInfo.css"
import Proptypes from 'prop-types';
import { useEffect, useState, useContext } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare, faXmark, faAngleDown, faAngleUp} from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../context/UserContext"

export default function EditShopInfo(props) {

    const {user} = useContext(UserContext);

    const {shop, setShop} = props;
    const [shopName, setShopName] = useState("");
    const [shopDetail, setShopDetail] = useState("");
    const [category, setCategory] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [canteen, setCanteen] = useState("");

    // * symbol
    const [asterisk, setAsterisk] = useState('');

    const [grabChecked, setGrabChecked] = useState(false);
    const [pandaChecked, setPandaChecked] = useState(false);
    const [lineChecked, setLineChecked] = useState(false);
    const [robinChecked, setRobinChecked] = useState(false);
    const [shopeeChecked, setShopeeChecked] = useState(false);
    const [gojekChecked, setGojekChecked] = useState(false);

    const [showEditShop, setShowEditShop] = useState(false);
    const [showEditBanner, setShowEditBanner] = useState(false);

    const [shopImg, setShopImg] = useState("https://img.freepik.com/premium-vector/store-icon-logo-vector-illustration_598213-5580.jpg");
    const [shopURL, setShopURL] = useState("");

    const [bannerImg, setBannerImg] = useState("https://img.freepik.com/premium-photo/healthy-food-background-fruits-berries-nuts-cereals_1077884-13006.jpg?semt=ais_hybrid");
    const [bannerURL, setBannerURL] = useState("");

    //cat-egory and can-teen
    const [dropdowncat, setDropDownCat] = useState(false);
    const [dropdowncan, setDropDownCan] = useState(false);

    useEffect(() => {
        if(shop){
            if(shop.shopName) setShopName(shop.shopName);
            if(shop.shopDetail) setShopDetail(shop.shopDetail);
            if(shop.category) setCategory(shop.category);
            if(shop.dateTime) setDateTime(shop.dateTime);
            if(shop.canteen) setCanteen(shop.canteen);
            if(shop.shopImg) setShopImg(shop.shopImg);
            if(shop.adsImg) setBannerImg(shop.adsImg);

            if(shop.delivery){
                let deliveryList = (shop.delivery).split(",");
                if(deliveryList.includes("Grab Food")) setGrabChecked(true);
                if(deliveryList.includes("Food Panda")) setPandaChecked(true);
                if(deliveryList.includes("Line Man")) setLineChecked(true);
                if(deliveryList.includes("Robinhood")) setRobinChecked(true);
                if(deliveryList.includes("Shopee Food")) setShopeeChecked(true);
                if(deliveryList.includes("gojek")) setGojekChecked(true);
            }

            setAsterisk("");
        }
        else{
            setAsterisk(<span className="required-asterisk">*</span>);
        }
    }, [shop])

    const handleBrowseFile = async (id) => {

        const fileInput = document.getElementById(id);
        const file = fileInput.files[0];
    
        if(file){
          //create FormData object to hold the file
          const formData = new FormData();
          formData.append('image', file);
    
          try{

            const response = await fetch(`http://localhost:3000/uploadImage?fileName=${encodeURIComponent(file.name)}`,{
              method: 'POST',
              body: formData
            });
    
            const data = await response.json();
    
            if(response.ok){
                if(id === "browseShopInput"){
                    setShopImg(data.imageUrl);
                }
                else if(id === "browseBannerInput"){
                    setBannerImg(data.imageUrl);
                }
            }
            else{
              console.error("Error uploading file: ", data.message);
            }
    
          }catch(error){
            console.error("Upload profile error: ", error)
          }
        }
    
      };

    const handleEditInfo = async () => {

        if(shop){
            const editedData = {};

            if(shopName !== shop.shopName && shopName !== "") {editedData.shopName = shopName;}
            if(shopDetail !== shop.shopDetail && shopDetail !== "") {editedData.shopDetail = shopDetail};
            if(category !== shop.category && category !== "") {editedData.category = category};
            if(dateTime !== shop.dateTime && dateTime !== "") {editedData.dateTime = dateTime};
            if(canteen !== shop.canteen && canteen !== "") {editedData.canteen = canteen};

            if(shopImg !== shop.shopImg && shopImg !== "https://img.freepik.com/premium-vector/store-icon-logo-vector-illustration_598213-5580.jpg") {editedData.shopImg = shopImg};
            if(bannerImg !== shop.adsImg && bannerImg !== "https://img.freepik.com/premium-photo/healthy-food-background-fruits-berries-nuts-cereals_1077884-13006.jpg?semt=ais_hybrid") {editedData.adsImg = bannerImg};

            let deliveryChecked = "";
            if(grabChecked) {deliveryChecked = deliveryChecked.concat(",Grab Food")};
            if(pandaChecked) {deliveryChecked = deliveryChecked.concat(",Food Panda")};
            if(lineChecked) {deliveryChecked = deliveryChecked.concat(",Line Man")};
            if(robinChecked) {deliveryChecked = deliveryChecked.concat(",Robinhood")};
            if(shopeeChecked) {deliveryChecked = deliveryChecked.concat(",Shopee Food")};
            if(gojekChecked) {deliveryChecked = deliveryChecked.concat(",gojek")};
                
            // console.log(deliveryChecked);

            if(deliveryChecked !== shop.delivery) {editedData.delivery = deliveryChecked};

            if(shopName !== shop.shopName && shopName !== "ชื่อร้าน"){
                try{
                    const result = await fetch(`http://localhost:3000/editShopNameOnMenus`,{
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "oldName" : shop.shopName, 
                            "newName": shopName
                        })
                    });
    
                    if(result.ok){
                        // const data = await result.json();
                        // console.log(data);
                    }
                    else{
                        const errorData = await result.json();
                        console.log("Eror: ", errorData.message);
                    }
    
                }catch(error){
                    console.log("server error: ", error);
                }
            }

            try{

                if(Object.keys(editedData).length > 0){
                    const response = await fetch(`http://localhost:3000/editShop`,{
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "owner" : shop.shopOwner, 
                            "editedData": editedData
                        })
                    });
                
                    if(!response.ok){
                        const errorData = await response.json();
                        console.log("error: ",errorData);
                    }
                    else{
                        const data = await response.json();
                        // console.log(data);
                        setShop(data.shop);
                        alert('เปลี่ยนแปลงข้อมูลร้านค้าสำเร็จ');
                    }
                }

            }catch(error){
                console.log("server error: ", error);
            }
        }
        else{
            const newData = {};

            if(shopName !== "") {newData.shopName = shopName}
            if(shopDetail !== "") {newData.shopDetail = shopDetail};
            if(category !== "") {newData.category = category};
            if(dateTime !== "") {newData.dateTime = dateTime};
            if(canteen !== "") {newData.canteen = canteen};

            if(shopImg !== "https://img.freepik.com/premium-vector/store-icon-logo-vector-illustration_598213-5580.jpg") {newData.shopImg = shopImg};
            if(bannerImg !== "https://img.freepik.com/premium-photo/healthy-food-background-fruits-berries-nuts-cereals_1077884-13006.jpg?semt=ais_hybrid") {newData.adsImg = bannerImg};

            let deliveryChecked = "";
            if(grabChecked) {deliveryChecked = deliveryChecked.concat(",Grab Food")};
            if(pandaChecked) {deliveryChecked = deliveryChecked.concat(",Food Panda")};
            if(lineChecked) {deliveryChecked = deliveryChecked.concat(",Line Man")};
            if(robinChecked) {deliveryChecked = deliveryChecked.concat(",Robinhood")};
            if(shopeeChecked) {deliveryChecked = deliveryChecked.concat(",Shopee Food")};
            if(gojekChecked) {deliveryChecked = deliveryChecked.concat(",gojek")};

            if(deliveryChecked !== "") {newData.delivery = deliveryChecked};
            newData.shopOwner = user.gmail;

            try{
                if(Object.keys(newData).length > 1){
                    const response = await fetch(`http://localhost:3000/addShop`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            "owner" : user.gmail, 
                            "newData": newData
                        })
                    });
                
                    if(!response.ok){
                        const errorData = await response.json();
                        console.log("error: ",errorData);
                    }
                    else{
                        const data = await response.json();
                        // console.log(data);
                        setShop(data.shop);
                        alert('เพิ่มข้อมูลร้านค้าสำเร็จ');
                    }
                }
            }catch(error){
                console.log("server error: ", error);
            }
        }
    }

    return (
        <form className="edit-shop" onSubmit={(e) => {
            e.preventDefault();
            handleEditInfo();
        }}>
            <div className="part1-editInfo">
                <div className="imgWrapper">
                    <img src={shopImg} alt=""></img>

                    <button type="button" className="edit-shop-button" onClick={(e) => {
                        e.stopPropagation(); //prevent bubbling
                        setShowEditShop(!showEditShop);
                    }}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>

                {showEditShop && (
                    <div className="uploadShop-option">
                        <div className="browseShop-option">
                            <input type="file" id="browseShopInput" accept="image/*" ></input>
                            <button type="button" onClick={() => handleBrowseFile("browseShopInput")}>อัพโหลด</button>
                        </div>
                        <p>หรือ</p>

                        <div className="urlShop-option">
                            <input
                            type="URL" value={shopURL}
                            placeholder="URL ของรูปภาพ"
                            onChange={(e) => setShopURL(e.target.value)}>
                            </input>
                            <button type="button" onClick={() => setShopImg(shopURL)}>อัพโหลด</button>
                        </div>

                        <button type="button" className="closeShop-option" onClick={() => setShowEditShop(!showEditShop)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                )}

                <div className="contentWrapper-edit">
                    <p>ชื่อร้านค้า {asterisk}</p>
                    <input 
                    type="text"
                    value={shopName}
                    placeholder="ชื่อร้านค้า"
                    onChange={(e) => {setShopName(e.target.value)}}
                    required />

                    <p>คำอธิบายร้าน {asterisk}</p>
                    <textarea 
                    type="text"
                    value={shopDetail}
                    placeholder="ไม่เกิน 150 ตัวอักษร"
                    onChange={(e) => {setShopDetail(e.target.value)}}
                    required />

                    <p>ประเภทร้านอาหาร {asterisk}</p>
                    <div className="select-menu">
                        <div className="select-btn">
                            <input placeholder="กรุณาระบุ" value={category} readOnly required></input>
                            <button className="dropdown-menu" type="button" onClick={() => setDropDownCat(!dropdowncat)}>
                                <FontAwesomeIcon icon={ dropdowncat? faAngleUp : faAngleDown} />
                            </button>
                        </div>

                        {dropdowncat && 
                            <ul className="options">
                                <li className={"ตามสั่ง" === category? "option option-selected":"option"} onClick={() => {setCategory("ตามสั่ง"); setDropDownCat(false);}}>ตามสั่ง</li>

                                <li className={"ก๋วยเตี๋ยว" === category? "option option-selected":"option"} onClick={() => {setCategory("ก๋วยเตี๋ยว"); setDropDownCat(false);}}>ก๋วยเตี๋ยว</li>

                                <li className={"ข้าวแกง" === category? "option option-selected":"option"} onClick={() => {setCategory("ข้าวแกง"); setDropDownCat(false);}}>ข้าวแกง</li>

                                <li className={"อาหารนานาชาติ" === category? "option option-selected":"option"} onClick={() => {setCategory("อาหารนานาชาติ"); setDropDownCat(false);}}>อาหารนานาชาติ</li>

                                <li className={"อิสลาม" === category? "option option-selected":"option"} onClick={() => {setCategory("อิสลาม"); setDropDownCat(false);}}>อิสลาม</li>

                                <li className={"ขนมและเครื่องดื่ม" === category? "option option-selected":"option"} onClick={() => {setCategory("ขนมและเครื่องดื่ม"); setDropDownCat(false);}}>ขนมและเครื่องดื่ม</li>
                            </ul>
                        }
                    </div>

                    <p>เวลาทำการ: {asterisk}</p>
                    <input 
                    type="text"
                    value={dateTime}
                    placeholder="เช่น จันทร์-ศุกร์ 9:00-17:00 น."
                    onChange={(e) => {setDateTime(e.target.value)}}
                    required />

                    <p>โรงอาหาร {asterisk}</p>
                    <div className="select-menu">
                        <div className="select-btn">
                            <input placeholder="กรุณาระบุ" value={canteen} readOnly required></input>
                            <button className="dropdown-menu" type="button" onClick={() => setDropDownCan(!dropdowncan)}>
                                <FontAwesomeIcon icon={ dropdowncan? faAngleUp : faAngleDown} />
                            </button>
                        </div>

                        {dropdowncan && 
                            <ul className="options">
                                <li className={"กรีนแคนทีน" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("กรีนแคนทีน"); setDropDownCan(false);}}>กรีนแคนทีน</li>

                                <li className={"ทิวสน" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("ทิวสน"); setDropDownCan(false);}}>ทิวสน</li>

                                <li className={"SC" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("SC"); setDropDownCan(false);}}>SC</li>
                            </ul>
                        }
                    </div>

                </div>
            </div>

            <div className="part2-editInfo">
                <h3>แบนเนอร์</h3>

                <div className="bannerWrapper">
                    <img src={bannerImg}></img>
                    <button type="button" className="edit-banner-button" onClick={(e) => {
                        e.stopPropagation();
                        setShowEditBanner(!showEditBanner);
                    }}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                    </button>
                </div>

                {showEditBanner && (
                    <div className="uploadBanner-option">
                        <div className="browseBanner-option">
                            <input type="file" id="browseBannerInput" accept="image/*" ></input>
                            <button type="button" onClick={() => handleBrowseFile("browseBannerInput")}>อัพโหลด</button>
                        </div>
                        <p>หรือ</p>

                        <div className="urlBanner-option">
                            <input
                            type="URL" value={bannerURL}
                            placeholder="URL ของรูปภาพ"
                            onChange={(e) => setBannerURL(e.target.value)}>
                            </input>
                            <button type="button" onClick={() => setBannerImg(bannerURL)}>อัพโหลด</button>
                        </div>

                        <button type="button" className="closeBanner-option" onClick={() => setShowEditBanner(!showEditBanner)}>
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                )}
            </div>

            <div className="part3-delivery">
                <h3>บริการเดลิเวรี่</h3>
                <div className="list">
                    <div className="form-element">
                        <input type="checkbox" name="platform" value="grabFood" id="grabFood" checked={grabChecked} onChange={() => setGrabChecked(!grabChecked)}></input>
                        <label htmlFor="grabFood">
                            <div className="logo">
                                <img src="https://seeklogo.com/images/G/grab-logo-7020E74857-seeklogo.com.png"></img>
                            </div>
                            <div className="title">
                                Grab Food
                            </div>
                        </label>
                    </div>

                    <div className="form-element">
                        <input type="checkbox" name="platform" value="foodPanda" id="foodPanda" checked={pandaChecked} onChange={() => setPandaChecked(!pandaChecked)}></input>
                        <label htmlFor="foodPanda">
                            <div className="logo">
                                <img src="https://pbs.twimg.com/profile_images/1616004993290752001/Qb2pr6Db_400x400.png"></img>
                            </div>
                            <div className="title">
                                Food Panda
                            </div>
                        </label>
                    </div>

                    <div className="form-element">
                        <input type="checkbox" name="platform" value="lineMan" id="lineMan" checked={lineChecked} onChange={() => setLineChecked(!lineChecked)}></input>
                        <label htmlFor="lineMan">
                            <div className="logo">
                                <img src="https://elmercadobangkok.com/wp-content/uploads/2021/05/el-linema-logo-02-1024x1024.jpg"></img>
                            </div>
                            <div className="title">
                                Line Man
                            </div>
                        </label>
                    </div>

                    <div className="form-element">
                        <input type="checkbox" name="platform" value="robinhood" id="robinhood" checked={robinChecked} onChange={() => setRobinChecked(!robinChecked)}></input>
                        <label htmlFor="robinhood">
                            <div className="logo">
                                <img src="https://mallika.co.th/wp-content/uploads/2022/05/Logo-Robinhood-c.png"></img>
                            </div>
                            <div className="title">
                                Robinhood
                            </div>
                        </label>
                    </div>

                    <div className="form-element">
                        <input type="checkbox" name="platform" value="shopeeFood" id="shopeeFood" checked={shopeeChecked} onChange={() => setShopeeChecked(!shopeeChecked)}></input>
                        <label htmlFor="shopeeFood">
                            <div className="logo">
                                <img src="https://mallika.co.th/wp-content/uploads/2022/05/logo-shopeefood-c.png"></img>
                            </div>
                            <div className="title">
                                Shopee Food
                            </div>
                        </label>
                    </div>

                    <div className="form-element">
                        <input type="checkbox" name="platform" value="gojek" id="gojek" checked={gojekChecked} onChange={() => setGojekChecked(!gojekChecked)}></input>
                        <label htmlFor="gojek">
                            <div className="logo">
                                <img src="https://d1imgdcsrvbfip.cloudfront.net/attachment_images/1aca75793fd121adafdb850403b091337c65d042.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAXVZDCJJC5AJQ47UT%2F20210617%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20210617T151226Z&X-Amz-Expires=900&X-Amz-SignedHeaders=host&X-Amz-Security-Token=FwoGZXIvYXdzEKn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDNULeBC%2FEJ4%2FjzrCyiKbAwAax%2Fs6FeHEWfaxl7VNbWb%2FoJfswQpvNJIKiQj2BdKqglqd%2Bse9ux6Wqoq6FUyllFnNL7SiroMj8MhluoULu0PVW0W5WPrxzbrIow06desSh1QBfGdqFrUdbdfNy1GRYOwKXeKCRr5T9eJBmsVNfMxrol7y0KGEZ%2FegAIg0VoXvQqBuo3Y5JV0Ag94H61iLv6vNq%2BwgbTzRda68ta494705aMwz6bF2aigXHIEWCvrEHviAmXS8K1uOPJ6auBLkVVa%2Bv9gdhQcUDDwSZU073Rs%2BafNQHSmwwuwZ1ybXgeBZREm6ac3QiLmAe0D8xjPOsnONRKaBoswdes1dY12bjpzae%2FnbvPtEI5QjQ3km3XyFAO6003u%2BTs8ByKvRYnJyOe9kDokpAW1uDyc0Y6nopgLSHu%2BBp63UEl%2BQCDQpDsdCht5tF2qbFAgmcL8Q3g8SqnMao6ULT7MxL5Szf84LMSKvvTtR8EGnq0dNrcK7kBouqPe6h3jAyoeRr1kwD5%2Bc5dbn%2B3glrPK%2BOUIcCo4%2BxRKBWDVEcJ3FRyYQvijHya2GBjI1FgNGm2nxIyJafRgxih4x4ec14civqQG9yQ%2BOMPPPjwFse5HcJd6%2FsYnUAmYtrlizOGNufcE%3D&X-Amz-Signature=4308f93bf89a97270428da4ea8d6e70882f74235a2cd019f556079ee58855f2b"></img>
                            </div>
                            <div className="title">
                                gojek
                            </div>
                        </label>
                    </div>
                </div>

            </div>

            <div className="edit-button">
                <button type="submit" >บันทึก</button>
            </div>
            
        </form>
    )
}

EditShopInfo.propTypes = {
    shop: Proptypes.object,
    setShop: Proptypes.func
}

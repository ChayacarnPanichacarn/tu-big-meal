// import React from 'react'
import "./EditMenu.css"
import Proptypes from 'prop-types';
import { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare, faXmark, faCamera, faTriangleExclamation, faPlus} from '@fortawesome/free-solid-svg-icons';

export default function EditMenu(props) {

    const {shop} = props;
    const [menus,setMenus] = useState([]);
    const [header, setHeader] = useState("แก้ไขเมนู");
    const [showEditMenu, setShowEditMenu] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState([]);
    const [showEditNewMenu, setShowEditNewMenu] = useState(false);
    const [numOfSuggested, SetNumOfSuggested] = useState();

    const [menuName, setMenuName] = useState([]);
    const [menuPrice, setMenuPrice] = useState([]);
    const [menuImg, setMenuImg] = useState([]);
    const [menuSuggest, setMenuSuggest] = useState([]);

    const [newMenuName, setNewMenuName] = useState('');
    const [newMenuPrice, setNewMenuPrice] = useState('');
    const [newMenuImg, setNewMenuImg] = useState('https://res.cloudinary.com/heyset/image/upload/v1689582418/buukmenow-folder/no-image-icon-0.jpg');
    const [newMenuSuggest, setNewMenuSuggest] = useState(false);

    const fetchAllMenus = useCallback(async() => {

        const encodedShopName = encodeURIComponent(shop.shopName);
        const res = await fetch(`https://tu-big-meal.onrender.com/menusInShop?shopName=${encodedShopName}`);

        const data = await res.json();

        const suggestedMenus = data.filter((menu) => {
            return menu.suggested === 'yes';
        });

        const othersMenus = data.filter((menu) => {
            return menu.suggested === 'no';
        });

        setMenus(suggestedMenus.concat(othersMenus));
        SetNumOfSuggested(suggestedMenus.length);

        if((suggestedMenus.concat(othersMenus)).length === 0) setHeader('เพิ่มเมนู');
    }, [shop]);

    useEffect(() => {
        if(shop){
            fetchAllMenus();
        }
        else{
            setHeader('เพิ่มเมนู');
        }

    }, [shop, fetchAllMenus]);

    //not run in the first render
    useEffect(() => {
        setShowEditMenu(Array(menus.length).fill(false));
        setMenuName(menus.map((menu) => menu.menuName));
        setMenuPrice(menus.map((menu) => menu.normalPrice));
        setMenuImg(menus.map((menu) => menu.menuImg));
        setMenuSuggest(menus.map((menu) => menu.suggested === 'yes'? true: false));
        setShowConfirmDelete(Array(menus.length).fill(false));
    },[menus]);

    const handleBrowseFile = async (id) => {
        const fileInput = document.getElementById(id);
        const file = fileInput.files[0];
    
        if(file){
          //create FormData object to hold the file
          const formData = new FormData();
          formData.append('image', file);

          const encodedFileName = encodeURIComponent(file.name);
    
          try{
            const response = await fetch(`https://tu-big-meal.onrender.com/uploadImage?fileName=${encodedFileName}`,{
              method: 'POST',
              body: formData
            });
    
            const data = await response.json();
    
            if(response.ok){
                const index = id.split(',').pop();

                handleMenuImgChange(index,data.imageUrl);
            }
            else{
              console.error("Error uploading file: ", data.message);
            }
    
          }catch(error){
            console.error("Upload profile error: ", error)
          }
        }
    
    };        
    

    const handleEditMenu = async (i) => {
        const editedData = {};

        if(menuName[i] !== menus[i].menuName) {editedData.menuName = menuName[i];}
        if(menuPrice[i] !== menus[i].normalPrice) {editedData.normalPrice = menuPrice[i]}
        if(menuImg[i] !== menus[i].menuImg) {editedData.menuImg = menuImg[i];}
        if(menuSuggest[i] !== (menus[i].suggested === 'yes')) {editedData.suggested = menuSuggest[i]? "yes":"no"}

        try{
            if(Object.keys(editedData).length > 0){
                const response = await fetch(`https://tu-big-meal.onrender.com/editMenu`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      "oldMenuName" :menus[i].menuName, 
                      "shopName": menus[i].shopName,
                      "editedData": editedData
                    })
                });
            
                if(!response.ok){
                    const errorData = await response.json();
                    console.log("error: ",errorData);
                }
                else{
                    // const data = await response.json();
                    // console.log(data);
                    alert('แก้ไขเมนูสำเร็จ');
    
                    fetchAllMenus();
                }
            }
        }catch(error){
            console.log("server error: ", error);
        }
    }

    const handleAddMenu = async () => {
        const addedData = {};

        addedData.menuName = newMenuName;
        addedData.shopName = shop.shopName;
        addedData.rating = "0";
        addedData.normalPrice = newMenuPrice;
        addedData.suggested = newMenuSuggest? "yes": "no"; 
        if(newMenuImg !== "https://res.cloudinary.com/heyset/image/upload/v1689582418/buukmenow-folder/no-image-icon-0.jpg") {addedData.menuImg = newMenuImg}

        try{
            
            const response = await fetch(`https://tu-big-meal.onrender.com/addMenu`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({addedData, shopName: shop.shopName, menuName: newMenuName})
            });
        
            if(!response.ok){
                const errorData = await response.json();
                console.log("error: ",errorData);
            }
            else{
                // const data = await response.json();
                // console.log(data);
                alert('เพิ่มเมนูสำเร็จ');

                fetchAllMenus();
                setShowEditNewMenu(false);
            }

            resetInformation(-1);
        }catch(error){
            console.log("server error: ", error);
        }
    }

    const handleDeleteMenu = async (index) => {
        try{
            const response = await fetch(`https://tu-big-meal.onrender.com/deleteMenu`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  "menuName" :menus[index].menuName,
                  "shopName": menus[index].shopName
                })
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error('Error deleting menu: ', errorData.message);
                return;
            }

            // const data = await response.json();
            // console.log(data);
            alert('ลบเมนูสำเร็จ');

            fetchAllMenus();

        }catch(error){
            console.log("server error: ", error);
        }
    }

    const toggleEditMenu = (index, closed) => {
        if(index === -1){
            setShowEditNewMenu(!showEditNewMenu);
        }
        else{
            setShowEditMenu((prev) =>
                prev.map((show,i) => (i === index ? !show : show))
            );
        }
        if(closed){
            resetInformation(index);
        }
    };

    const toggleConfirmDelete = (index) => {
        setShowConfirmDelete((prev) =>
            prev.map((show,i) => (i === index ? !show : show))
        );
    };

    const handleMenuNameChange = (index, value) => {
        setMenuName((prev) => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };

    const handleMenuImgChange = (index, value) => {
        if(index === "-1"){
            setNewMenuImg(value);
        }
        else{
            setMenuImg((prev) => {
                const newList = [...prev];
                newList[index] = value;
                return newList;
            });
        }
    };

    const handleMenuPriceChange = (index, value) => {
        setMenuPrice((prev) => {
            const newList = [...prev];
            newList[index] = value;
            return newList;
        });
    };


    const handleMenuSuggestClick = (click, index) => {
        //2 case 1.for create new menu's suggestion 2.for edit menu's suggestion
        if(index === -1){
            if(click){
                setNewMenuSuggest(click !== newMenuSuggest && numOfSuggested <3 ? !newMenuSuggest: newMenuSuggest);
                if(click !== newMenuSuggest && numOfSuggested >= 3) alert('สามารถแนะนำได้ไม่เกิน 3 เมนู');
            }
            else{
                setNewMenuSuggest(click !== newMenuSuggest? !newMenuSuggest: newMenuSuggest);
            }
        }
        else{
            if(click){
                setMenuSuggest((prev) =>
                    prev.map((suggest,i) => (i === index ? (click !== suggest && numOfSuggested < 3 ? !suggest:suggest): suggest))
                )
                if(click !== menuSuggest[index] && numOfSuggested >= 3) alert('สามารถแนะนำได้ไม่เกิน 3 เมนู');
            }
            else{
                setMenuSuggest((prev) =>
                    prev.map((suggest,i) => (i === index ? (click !== suggest? !suggest:suggest): suggest))
                );
            }
        }
    }

    const handleMenuSuggestChange = (index) => {
        setMenuSuggest((prev) =>
            prev.map((suggest,i) => (i === index ? !suggest : suggest))
        );
    }

    const resetInformation = (i) => {
        if(i === -1){
            setNewMenuName('');
            setNewMenuPrice('');
            setNewMenuImg('https://res.cloudinary.com/heyset/image/upload/v1689582418/buukmenow-folder/no-image-icon-0.jpg');
            setNewMenuSuggest(false);
        }
        else{
            if(menuName[i] !== menus[i].menuName){
                handleMenuNameChange(i, menus[i].menuName);
            }
            if(menuPrice[i] !== menus[i].normalPrice){
                handleMenuPriceChange(i, menus[i].normalPrice);
            }
            if(menuImg[i] !== menus[i].menuImg){
                handleMenuImgChange(i, menus[i].menuImg);
            }
            if(menuSuggest[i] !== (menus[i].suggested === 'yes')){
                handleMenuSuggestChange(i);
            }
        }
    }

    return (
    <div className="edit-menu">
        <div className="menu-heading">
            <h3>{header}</h3>
            {!shop && <p className="p-warning">(กรุณาเพิ่มข้อมูลร้านอาหารก่อนเพิ่มเมนู)</p>}
        </div>

        <div className="menu-container">

            {menus.map((menu,i) => {
                return (
                    <div key={`menubox,${i}`}>
                        <div className="menu-box">
                            <div className="menu-image">
                                <img src={menu.menuImg} alt="Suggest"></img>
                            </div>

                            <div className="menu-text">
                                <span>{menu.rating} ดาว {menu.normalPrice} บาท</span>
                                <p>{menu.menuName}</p>
                                {(menu.suggested === 'yes') && <div className="suggested-menu-tag"><p>เมนูแนะนำ</p></div>}
                            </div>

                            <button className="edit-menu-button" onClick={() => toggleEditMenu(i,false)}>
                                <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                        </div>

                        {showEditMenu[i] && (
                            <div className="edit-menu-tap" key={`edit-tap,${i}`}>

                                <div className="edit-menu-img">
                                    <img src={menuImg[i]} alt="" />

                                    <div className="menu-img-input">
                                        <input type="file" 
                                        id={`menuImg,${i}`} 
                                        onChange={() => handleBrowseFile(`menuImg,${i}`)}>
                                        </input>

                                        <FontAwesomeIcon icon={faCamera} />
                                    </div>
                                </div>

                                <p>ชื่อเมนู</p>
                                <input
                                type="text" 
                                value={menuName[i]}
                                onChange={(e) => handleMenuNameChange(i,e.target.value)}
                                ></input>

                                <p>ราคา</p>
                                <input
                                type="text" 
                                value={menuPrice[i]}
                                onChange={(e) => handleMenuPriceChange(i,e.target.value)}
                                ></input>

                                <p>แนะนำ</p>
                                <div className="edit-menu-radio">
                                    <input
                                    type="radio"
                                    name="suggest"
                                    id={`radio-yes,${i}`}
                                    checked={menuSuggest[i]}
                                    onChange={() => handleMenuSuggestClick(true,i)}
                                    ></input>
                                    <label htmlFor={`radio-yes,${i}`}>ใช่</label>

                                    <input
                                    type="radio"
                                    name="suggest"
                                    id={`radio-no,${i}`}
                                    checked={!menuSuggest[i]}
                                    onChange={() => handleMenuSuggestClick(false,i)}
                                    ></input>
                                    <label htmlFor={`radio-no,${i}`}>ไม่</label>
                                </div>

                                <div className="edit-menu-choices">
                                    <button className="save-edit-menu" 
                                    onClick={() => handleEditMenu(i)}
                                    >บันทึก</button>

                                    <button className="delete-edit-menu"
                                    onClick={() => toggleConfirmDelete(i)}
                                    >ลบเมนู</button>
                                </div>
                                
                                <button className="close-menu-tap" onClick={() => toggleEditMenu(i,true)}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        )}

                        {showConfirmDelete[i] && (
                            <div className="confirm-delete-tap" key={`confirm-delete,${i}`}>
                                <div className="warning-deleteMenu">
                                    <FontAwesomeIcon icon={faTriangleExclamation} />
                                </div>
                                <p>ยืนยันการลบเมนู</p>

                                <div className="confirmDelete-choices">
                                    <button onClick={() => handleDeleteMenu(i)}>ยืนยัน</button>
                                    <button onClick={() => toggleConfirmDelete(i)}>ยกเลิก</button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            })}

            <div key={`menubox-new`}>
                <div className="add-menu-box">
                    <button className="add-menu-button" onClick={() => toggleEditMenu(-1,false)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </button>
                </div>

                {showEditNewMenu && (
                    <div className="edit-menu-tap" key={`create-menu-tap`}>

                        {/* By default, after click form summission the page will automatically reload*/}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            handleAddMenu();
                        }}>
                            <div className="edit-menu-img">
                                <img src={newMenuImg} alt="" />

                                <div className="menu-img-input">
                                    <input type="file"
                                    id='menuImg,-1'
                                    onChange={() => handleBrowseFile('menuImg,-1')}
                                    ></input>

                                    <FontAwesomeIcon icon={faCamera} />
                                </div>
                            </div>

                            <label htmlFor="newMenuName" className="addMenu-required-label">
                                ชื่อเมนู <span className="required-asterisk">*</span>
                            </label>
                            <input
                            type="text"
                            id="newMenuName"
                            value={newMenuName}
                            placeholder="ชื่อเมนู"
                            onChange={(e) => setNewMenuName(e.target.value)}
                            autoComplete="off"
                            required
                            ></input>

                            <label htmlFor="newMenuPrice" className="addMenu-required-label">
                                ราคา <span className="required-asterisk">*</span>
                            </label>
                            <input
                            type="text" 
                            id="newMenuPrice"
                            value={newMenuPrice}
                            placeholder="ราคาอาหาร (บาท)"
                            onChange={(e) => setNewMenuPrice(e.target.value)}
                            autoComplete="off"
                            required
                            ></input>

                            <p>แนะนำ</p>
                            <div className="edit-menu-radio">
                                <input
                                type="radio"
                                name="suggest"
                                id={`radio-yes-new`}
                                checked={newMenuSuggest}
                                onChange={() => handleMenuSuggestClick(true,-1)}
                                ></input>
                                <label htmlFor={`radio-yes-new`}>ใช่</label>

                                <input
                                type="radio"
                                name="suggest"
                                id={`radio-no-new`}
                                checked={!newMenuSuggest}
                                onChange={() => handleMenuSuggestClick(false,-1)}
                                ></input>
                                <label htmlFor={`radio-no-new`}>ไม่</label>
                            </div>

                            <div className="edit-menu-choices">
                                <button type="submit" className="save-edit-menu" 
                                >บันทึก</button>
                            </div>
                            
                            <button className="close-menu-tap" onClick={() => toggleEditMenu(-1,true)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>

                        </form>
                    </div>
                )}
            </div>
        </div>

    </div>
    )
}
EditMenu.propTypes = {
    shop: Proptypes.object
}

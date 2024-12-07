// import React from 'react'
import { useEffect, useState } from "react";
import "./Filter.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleDown, faAngleUp, faPaperPlane} from '@fortawesome/free-solid-svg-icons';
import Proptypes from 'prop-types';

export default function Filter(props) {

    const {canteen, setCanteen, category, setCategory} = props;

    const [dropdowncan, setDropDownCan] = useState(false);
    const [dropdowncat, setDropDownCat] = useState(false);

    useEffect(() => {
        localStorage.setItem("canteen", canteen);
        localStorage.setItem("category",category);
    },[canteen, category]);

    return (
    <div className="filter">
        <div className="filter-symbol">
            <FontAwesomeIcon icon={faPaperPlane} />
        </div>

        <div className="select-menu-homepage">
            <div className="select-btn-homepage">
                <input className="can-input-homepage" placeholder="กรุณาระบุ" value={canteen} readOnly required></input>
                <button className="dropdown-menu" type="button" onClick={() => setDropDownCan(!dropdowncan)}>
                    <FontAwesomeIcon icon={ dropdowncan? faAngleUp : faAngleDown} />
                </button>
            </div>

            {dropdowncan && 
                <ul className="options-can">
                    <li className={"ทั้งหมด" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("ทั้งหมด"); setDropDownCan(false);}}>ทั้งหมด</li>

                    <li className={"กรีนแคนทีน" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("กรีนแคนทีน"); setDropDownCan(false);}}>กรีนแคนทีน</li>

                    <li className={"ทิวสน" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("ทิวสน"); setDropDownCan(false);}}>ทิวสน</li>

                    <li className={"SC" === canteen? "option option-selected":"option"} onClick={() => {setCanteen("SC"); setDropDownCan(false);}}>SC</li>
                </ul>
            }
        </div>

        <div className="select-menu-homepage">
            <div className="select-btn-homepage">
                <input className="cat-input-homepage" placeholder="กรุณาระบุ" value={category} readOnly required></input>
                <button className="dropdown-menu" type="button" onClick={() => setDropDownCat(!dropdowncat)}>
                    <FontAwesomeIcon icon={ dropdowncat? faAngleUp : faAngleDown} />
                </button>
            </div>

            {dropdowncat && 
                <ul className="options-cat">
                    <li className={"ทั้งหมด" === category? "option option-selected":"option"} onClick={() => {setCategory("ทั้งหมด"); setDropDownCat(false);}}>ทั้งหมด</li>

                    <li className={"ตามสั่ง" === category? "option option-selected":"option"} onClick={() => {setCategory("ตามสั่ง"); setDropDownCat(false);}}>ตามสั่ง</li>

                    <li className={"ก๋วยเตี๋ยว" === category? "option option-selected":"option"} onClick={() => {setCategory("ก๋วยเตี๋ยว"); setDropDownCat(false);}}>ก๋วยเตี๋ยว</li>

                    <li className={"ข้าวแกง" === category? "option option-selected":"option"} onClick={() => {setCategory("ข้าวแกง"); setDropDownCat(false);}}>ข้าวแกง</li>

                    <li className={"อาหารนานาชาติ" === category? "option option-selected":"option"} onClick={() => {setCategory("อาหารนานาชาติ"); setDropDownCat(false);}}>อาหารนานาชาติ</li>

                    <li className={"อิสลาม" === category? "option option-selected":"option"} onClick={() => {setCategory("อิสลาม"); setDropDownCat(false);}}>อิสลาม</li>

                    <li className={"ขนมและเครื่องดื่ม" === category? "option option-selected":"option"} onClick={() => {setCategory("ขนมและเครื่องดื่ม"); setDropDownCat(false);}}>ขนมและเครื่องดื่ม</li>
                </ul>
            }
        </div>
    </div>
    )
}

Filter.propTypes = {
    canteen: Proptypes.string,
    setCanteen: Proptypes.func,
    category: Proptypes.string,
    setCategory: Proptypes.func
}

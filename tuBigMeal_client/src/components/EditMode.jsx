// import React from 'react'
// import { useState } from "react"
import "./EditMode.css"
import PropTypes from "prop-types";

export default function EditMode(props) {

    const {shopMode, setShopMode} = props;

    const setChoice = (shop) => {
        setShopMode(shop !== shopMode? !shopMode: shopMode);
    }

    return (
    <div className="editMode">
        <div className="button-box">
            <div className = {shopMode? "btn-left": "btn-right"}></div>
            <button type="button" className="toggle-btn" onClick={() => setChoice(true)}>ร้านค้า</button>
            <button type="button" className="toggle-btn" onClick={() => setChoice(false)}>เมนู</button>
        </div>
    </div>
    )
}

EditMode.propTypes = {
    shopMode: PropTypes.bool,
    setShopMode: PropTypes.func
}

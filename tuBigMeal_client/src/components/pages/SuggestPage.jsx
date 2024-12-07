// import React from 'react'

import { useState} from "react";
import Suggestions from "../Suggestions";

export default function SuggestPage() {
    const [suggestedMenus] = useState(JSON.parse(localStorage.getItem("AllSuggestedMenus")) || []);

    return (
    <div>
        <Suggestions menus={suggestedMenus} header={"เมนูแนะนำ"} page={'suggest-page'}/>
    </div>
    )
}

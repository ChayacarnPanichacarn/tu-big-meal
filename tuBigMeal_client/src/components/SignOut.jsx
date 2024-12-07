// import React from 'react'
import "./SignOut.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPersonRunning} from '@fortawesome/free-solid-svg-icons';
import { UserContext } from "../context/UserContext"
import { useContext } from "react";

export default function SignOut() {

    const {setUser} = useContext(UserContext);

    const clearUserToken = async() => {
        try{
            const response = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if(response.ok){
                // const data = await response.json();
                // console.log(data.message);
                localStorage.clear();
                setUser(null);
                alert("ออกจากระบบสำเร็จ");
            }else{
                console.error("Failed to log out: ", response.statusText);
                alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งในภายหลัง");
            }

        }catch(error){
            console.log("Error during logout: ", error);
            alert("ระบบขัดข้องขณะออกจากระบบ");
        }
    }

    return (
        <div className="sign-out-back">
            <div className="sign-out">
                <div className="log-out-icon">
                    <FontAwesomeIcon icon={faPersonRunning} />
                </div>

                <p>ต้องการออกจากระบบ?</p>

                <button className="confirm-logout" onClick={clearUserToken}>ยืนยัน</button>
            </div>
        </div>
    )
}

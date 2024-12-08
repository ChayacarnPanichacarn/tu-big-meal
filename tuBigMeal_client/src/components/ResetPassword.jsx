// import React from 'react'
import { useContext, useState} from "react"
import { RecoveryContext } from "./pages/SignIn"

export default function ResetPassword() {

    const {email, handleLogIn} = useContext(RecoveryContext);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const changePassword = async() => {
        try{
            if(newPassword === confirmPassword && newPassword !== ""){
                const response = await fetch(`https://tu-big-meal.onrender.com/changePassword`,{
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      email,
                      newPassword
                    })
                });

                if(!response.ok){
                    const errorData = await response.json();
                    console.log("error: ",errorData);
                    return;
                }

                // const data = await response.json();
                // console.log(data.message);

                handleLogIn(email, newPassword);

            }else{
                alert("รหัสผ่านใหม่ไม่ตรงกัน");
            }
        }catch(error){
            console.error("server error: ", error);
        }
    }

    return (
        <div className='signIn-logIn-wrapper'>
            <h1>เปลี่ยนรหัสผ่าน</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                changePassword();
            }}>
                <input
                value={email}
                readOnly
                ></input>

                <input
                type="password" value={newPassword}
                placeholder="รหัสผ่านใหม่"
                onChange={(e) => setNewPassword(e.target.value)}
                required
                ></input>

                <input
                type="password" value={confirmPassword}
                placeholder="ยืนยันรหัสผ่านใหม่"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                ></input>

                <div>
                    <button type="submit" className="confirm-button" >ตกลง</button>
                </div>

            </form>
        </div>
    )
}

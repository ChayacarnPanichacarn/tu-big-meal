// import Proptypes from 'prop-types';
import "./SignUpandLogIn.css"
import { useContext, useState } from "react"

import { RecoveryContext } from "./pages/SignIn"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faShop} from '@fortawesome/free-solid-svg-icons';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';

export default function SignUpandLogIn() {

    const {email, setEmail, setPage, setOTP, handleLogIn} = useContext(RecoveryContext);

    const [haveAccount, setHaveAccount] = useState(false);
    const [accountType, setAccountType] = useState("viewer");

    const [gmailLogIn, setGmailLogIn] = useState("");
    const [passwordLogIn, setPasswordLogIn] = useState("");
    
    const [gmailSignUp, setGmailSignUp] = useState("");
    const [passwordSignUp, setPasswordSignUp] = useState("");
    const [accountName, setAccountName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNum, setPhoneNum] = useState("");
    const [address, setAddress] = useState("");

    const navigateToOtp = async() => {
        try{
            if(email !== ""){

                const res = await fetch(`http://localhost:3000/validateEmail?email=${encodeURIComponent(email)}`,{
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();

                if(data.result === "validated"){
                    const OTP = Math.floor(Math.random() * 9000 + 1000);
                    setOTP(OTP);

                    const response = await fetch(`http://localhost:3000/sendRecoveryEmail`,{
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            OTP, 
                            "recipient_email": email
                        })
                    });
                
                    if(!response.ok) {
                        const errorData = await response.json();
                        console.error("Error sending email: ", errorData.message);
                        return;
                    }

                    // const data = await response.json();
                    // console.log(data.message);
                    setPage("OTP");
                }
                else{
                    alert("ไม่พบบัญชีผู้ใช้ที่ผูกกับอีเมลนี้");
                }
            }
            else{
                alert("กรุณาระบุอีเมลของท่าน");
            }
        }catch(error){
            console.error("server error: ", error);
        }
    }

    const handleSignUp = async () => {
        let userData = {};

        if(accountType === 'viewer'){
            userData = {
                gmail: gmailSignUp,
                password: passwordSignUp,
                userName: accountName,
                role: 'viewer'
            }
        }
        else if(accountType === 'owner'){
            userData = {
                gmail: gmailSignUp,
                password: passwordSignUp,
                userName: accountName,
                firstName: firstName,
                lastName: lastName,
                phoneNum: phoneNum,
                address: address,
                role: 'owner'
            }
        }

        try{
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                alert(errorData.message);
                return;
            }

            // alert('Sign-up successful');
    
            // const data = await response.json();
            // console.log('Sign-up successful:', data);
            await handleLogIn(gmailSignUp,passwordSignUp);
        }catch(error){
            console.error('Error during sign-up: ', error)
            alert('Server error');
        }
    };


    return (
        <div className='signIn-logIn-wrapper'>

            {!haveAccount ? (
                <div className='sign-up'>
                    <h1>สร้างบัญชี</h1>
                    <h5>กรุณาระบุประเภทบัญชี</h5>

                    <div className="account-option">
                        <button 
                        className={accountType === "viewer" ? "account-choice-click": "account-choice"} 
                        onClick={() => setAccountType("viewer")}>
                            <FontAwesomeIcon icon={faCircleUser} />
                            <p>ผู้ใช้ทั่วไป</p>
                        </button>

                        <button 
                        className={accountType == "owner" ? "account-choice-click":"account-choice"}
                        onClick={() => setAccountType("owner")}>
                            <FontAwesomeIcon icon={faShop} />
                            <p>เจ้าของร้านค้า</p>
                        </button>
                    </div>

                    <p className="p-warning">(กรุณากรอกข้อมูลให้ครบ)</p>

                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleSignUp();
                    }}>

                        <input
                        type="accountName" value={accountName}
                        placeholder='ชื่อบัญชี'
                        onChange={(e) => setAccountName(e.target.value)}
                        required
                        ></input>

                        <input
                        type="gmail" value={gmailSignUp}
                        placeholder='อีเมล'
                        onChange={(e) => setGmailSignUp(e.target.value)}
                        required
                        ></input>

                        {accountType === "owner" && (
                            <>
                            <input
                            type="firstName" value={firstName}
                            placeholder='ชื่อจริง'
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            ></input>
                            
                            <input
                            type="lastName" value={lastName}
                            placeholder='นามสกุล'
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            ></input>

                            <input
                            type="phoneNum" value={phoneNum}
                            placeholder='เบอร์โทรศัพท์'
                            onChange={(e) => setPhoneNum(e.target.value)}
                            required
                            ></input>

                            <input
                            type="address" value={address}
                            placeholder='ที่อยู่ที่ติดต่อได้'
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            ></input>
                            </>
                        )}
                        
                        <input
                        type="password" value={passwordSignUp}
                        placeholder='รหัสผ่าน'
                        onChange={(e) => setPasswordSignUp(e.target.value)}
                        required
                        ></input>

                        <input type='password' placeholder='กรอกรหัสผ่านอีกครั้ง' required></input>

                        <div>
                            <button type="submit" className="confirm-button">ยืนยัน</button>
                        </div>

                    </form>
                    
                    <div className='other-option'>
                        มีบัญชีอยู่แล้ว? <button onClick={() => setHaveAccount(true)}>เข้าสู่ระบบ</button>
                    </div>
                </div>
            ):(
                <div className='log-in'>
                    <h1>เข้าสู่ระบบ</h1>
                    <form onSubmit={(e) => {
                            e.preventDefault();
                            handleLogIn(gmailLogIn,passwordLogIn);
                        }}>

                        <input
                        type="gmail" value={gmailLogIn}
                        placeholder="อีเมล"
                        onChange={(e) => {setGmailLogIn(e.target.value); setEmail(e.target.value)}}
                        required
                        ></input>

                        <input
                        type="password" value={passwordLogIn}
                        placeholder="รหัสผ่าน"
                        onChange={(e) => setPasswordLogIn(e.target.value)}
                        required
                        ></input>

                        <div className="forgot-pass">
                            <a href="#" onClick={() => navigateToOtp()}>ลืมรหัสผ่าน?</a>
                        </div>

                        <button type="submit" className="confirm-button">ยืนยัน</button>
                    </form>
                    
                    <div className='other-option'>
                        ไม่เคยมีบัญชี? <button onClick={() => setHaveAccount(false)}>สร้างบัญชี</button>
                    </div>
                </div>
            )}
        
        </div>
    )
}


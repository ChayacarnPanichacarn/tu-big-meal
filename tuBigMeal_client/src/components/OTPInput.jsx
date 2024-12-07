
import { useContext, useState, useEffect} from "react"
import './OTPInput.css'
import { RecoveryContext } from "./pages/SignIn"

export default function OTPInput() {

    const {email, OTP, setOTP, setPage} = useContext(RecoveryContext);

    const [timerCount, setTimer] = useState(30);
    const [deliverable, setDeliverable] = useState(false);

    const [firstDigit, setFirstDigit] = useState("");
    const [secondDigit, setSecondDigit] = useState("");
    const [thirdDigit, setThirdDigit] = useState("");
    const [fourthDigit, setFourthDigit] = useState("");

    const isButtonDisabled = firstDigit === "" || secondDigit === "" || thirdDigit === "" || fourthDigit === "";

    useEffect(() => {
        if(!deliverable){
            let interval = setInterval(() => {
                setTimer((lastTimerCount) => {
                    //safeguard
                    if(lastTimerCount <= 0){
                        return lastTimerCount;
                    }
                    if(lastTimerCount <= 1) {
                        clearInterval(interval);
                        setDeliverable(true);
                    }
                    return lastTimerCount - 1;
                });
            }, 1000);
    
            //Clear interval in unusual state (ex. user navigates away or component unmounts)
            return () => clearInterval(interval);
        }
    }, [deliverable])

    const checkOTP = () => {
        let otp = OTP;
        let fourth = Math.floor(otp % 10);
        otp/=10;
        let third = Math.floor(otp % 10);
        otp/=10;
        let second = Math.floor(otp % 10);
        otp/=10;
        let first = Math.floor(otp % 10);

        if(first == firstDigit && second == secondDigit && third == thirdDigit && fourth == fourthDigit){
            setPage("reset");
        }
        else{
            console.log("Wrong OTP. Please try again");
            alert("รหัส OTP ไม่ถูกต้อง");
        }
    }

    const resendOTP = async() => {
        if(!deliverable) return;
        try{
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

            setTimer(30);
            setDeliverable(false);

        }catch(error){
            console.error("server error: ", error);
        }
    }

    return (
    <div className='otp-card'>
        <h1>ยืนยันรหัส OTP</h1>
        <p>ได้ทำการส่งรหัสไปยัง {email}</p>

        <div className="otp-card-input">
            <input type="text" maxLength="1" autoFocus
                value={firstDigit}
                onChange={(e) => setFirstDigit(e.target.value)}
            ></input>

            <input type="text" maxLength="1"
                value={secondDigit}
                onChange={(e) => setSecondDigit(e.target.value)}
            ></input>

            <input type="text" maxLength="1"
                value={thirdDigit}
                onChange={(e) => setThirdDigit(e.target.value)}
            ></input>

            <input type="text" maxLength="1"
                value={fourthDigit}
                onChange={(e) => setFourthDigit(e.target.value)}
            ></input>

        </div>

        <p>ไม่ได้รับรหัส OTP? 
            <a href="#" onClick={() => resendOTP()} className={deliverable? "deliverable" :"undeliverable"}>
                {deliverable? " ส่งอีกครั้ง":` ส่งอีกครั้งใน ${timerCount} วินาที`}
            </a>
        </p>
        <button id="submit-otp" disabled={isButtonDisabled} onClick={() => checkOTP()}>ยืนยันรหัส</button>
    </div>
    )
}

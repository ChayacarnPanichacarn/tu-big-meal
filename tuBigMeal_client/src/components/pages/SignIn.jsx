import {createContext} from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpandLogIn from "../SignUpandLogIn";
import SignOut from "../SignOut";
import { UserContext } from "../../context/UserContext"
import { useContext, useState } from "react";
import OTPInput from "../OTPInput";
import ResetPassword from "../ResetPassword";

export const RecoveryContext = createContext();

export default function SignIn() {
  const {user, setUser} = useContext(UserContext);
  const [page ,setPage] = useState("login");
  const [email, setEmail] = useState("");
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();

  const handleLogIn = async (gmail, password) => {

    try{
      const response = await fetch(`https://tu-big-meal.onrender.com/login?gmail=${gmail}&password=${password}`, {
        method: 'GET',
        credentials: 'include'//include HttpOnly cookies
      });

      if(!response.ok) {
        const errorData = await response.json();
        // setErrorMessage(errorData.message);
        alert(errorData.message);
        return;
      }

      const data = await response.json();
      setUser(data.user);
      // console.log("login successful: ",data.user);
      alert(data.message);

      navigate('/');

    }catch (error){
      console.error("server error: ", error);
    }
  };

  return (
    <RecoveryContext.Provider 
      value={{page, setPage, email, setEmail, OTP, setOTP, handleLogIn}}>
      <div>
        {!user ? (
          page === "login" ? (
            <SignUpandLogIn/>
          ) : page === "OTP" ? (
            <OTPInput />
          ) : page === "reset" ? (
            <ResetPassword />
          ) : null
        ):(
          <SignOut />
        )}
      </div>
    </RecoveryContext.Provider>
  )
}

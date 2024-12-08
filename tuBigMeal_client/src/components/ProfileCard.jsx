// import React from 'react'
import "./ProfileCard.css"
import { useContext, useState } from "react"
import { UserContext } from "../context/UserContext"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPenToSquare, faXmark} from '@fortawesome/free-solid-svg-icons';

export default function ProfileCard() {
  const {user, setUser} = useContext(UserContext);

  const [password, setPassword] = useState(user.password);
  const [accountName, setAccountName] = useState(user.userName);
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [phoneNum, setPhoneNum] = useState(user.phoneNum);
  const [address, setAddress] = useState(user.address);
  const [imgURL, setImgURL] = useState("");
  const [imgPath, setImgPath] = useState("");
  const [img, setImg] = useState(user.profilePic === ''? "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" : user.profilePic);
  const [showUploadOptions, setShowUploadOptions] = useState(false);
  
  // window.scrollTo(0,0);

  const handleBrowseFile = async () => {
    const fileInput = document.getElementById("profilePicInput");
    const file = fileInput.files[0];

    if(file){
      //create FormData object to hold the file
      const formData = new FormData();
      formData.append('image', file);
      // formData.append('uploadType','profilePic');

      try{
        const response = await fetch(`https://tu-big-meal.onrender.com/uploadImage?fileName=${encodeURIComponent(file.name)}`,{
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if(response.ok){
          // console.log(data.message);

          setImgPath(data.imageUrl);
          setImg(data.imageUrl);
        }
        else{
          console.error("Error uploading file: ", data.message);
        }

      }catch(error){
        console.error("Upload profile error: ", error)
      }
    }

  };

  const handleEditProfile = async() => {
    try{
      const editedData = {};
      if(password !== user.password) {editedData.password = password}
      if(firstName !== user.firstName) {editedData.firstName = firstName};
      if(lastName !== user.lastName) {editedData.lastName = lastName};
      if(phoneNum !== user.phoneNum) {editedData.phoneNum = phoneNum};
      if(address !== user.address) {editedData.address = address};
      if(accountName !== user.userName) {editedData.userName = accountName};
      if(imgURL !== "") {editedData.profilePic = imgURL};
      if(imgPath !== "") {editedData.profilePic = imgPath};

      if(Object.keys(editedData).length > 0){
        const response = await fetch(`https://tu-big-meal.onrender.com/editProfile`,{
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            "gmail" :user.gmail, 
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
          alert('แก้ไขโปรไฟล์สำเร็จ');
          setUser(data.user);
        }
      }
      
    }catch(error){
      console.log("server error: ", error);
    }
  }

  return (
    <div className="profile-card">
        <div className="image">
            <img src={img} alt="" className="profile-img" />

            <button className="upload-img-button" onClick={() => setShowUploadOptions(!showUploadOptions)}>
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
        </div>

        {showUploadOptions && (
          <div className="upload-option">
            <div className="browse-option">
              <input type="file" id="profilePicInput" accept="image/*" ></input>
              <button onClick={handleBrowseFile}>อัพโหลด</button>
            </div>
            <p>หรือ</p>

            <div className="url-option">
              <input
                type="URL" value={imgURL}
                placeholder="URL ของรูปภาพ"
                onChange={(e) => setImgURL(e.target.value)}>
              </input>
              <button onClick={() => setImg(imgURL)}>อัพโหลด</button>
            </div>

            <button className="close-option" onClick={() => setShowUploadOptions(!showUploadOptions)}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        )}

        <h3>จัดการโปรไฟล์</h3>
        <div className="input-list">
            <p>ชื่อบัญชี</p>
            <input
            type="accountName" 
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            ></input>

            <p>อีเมล</p>
            <input
            type="gmail" 
            placeholder={user.gmail}
            readOnly
            ></input>

            {user.role === "owner" && (
                <>
                  <p>ชื่อจริง</p>
                  <input
                  type="firstName" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  ></input>
                  
                  <p>นามสกุล</p>
                  <input
                  type="lastName" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  ></input>

                  <p>เบอร์โทรศัพท์</p>
                  <input
                  type="phoneNum" 
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(e.target.value)}
                  ></input>

                  <p>ที่อยู่</p>
                  <textarea
                  type="address" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="address-input"
                  ></textarea>
                </>
            )}

            <p>รหัสผ่าน</p>
            <input
            type="text" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ></input>
        </div>

        <button className="submit-button" onClick={handleEditProfile}>บันทึก</button>
    </div>
  )
}

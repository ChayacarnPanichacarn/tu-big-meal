import {useContext, useState} from 'react'
import {Link, NavLink} from 'react-router-dom'
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFaceSmileWink} from '@fortawesome/free-solid-svg-icons';
import "./Navbar.css"

export default function Navbar() {
    const [menuOpen,setMenuOpen] = useState(false);
    const { user } = useContext(UserContext);

    return (
    <nav>
        <Link to="/" className='title'><FontAwesomeIcon icon={faFaceSmileWink} /> TU BIG MEAL</Link>
        <div className='menu' onClick={() => {
            setMenuOpen(!menuOpen);
        }}>
            <span></span>
            <span></span>
            <span></span>
        </div>
        
        <ul className={menuOpen ? "open" : ""}>
            {user ? (
                user.role === "owner"?(
                    <>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/">หน้าหลัก</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/profile">จัดการโปรไฟล์</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/favourite">รายการที่ถูกใจ</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/shop">จัดการร้านค้า</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/sign-in">ออกจากระบบ</NavLink>
                        </li>
                    </>
                ):(
                    <>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/">หน้าหลัก</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/profile">จัดการโปรไฟล์</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/favourite">รายการที่ถูกใจ</NavLink>
                        </li>
                        <li onClick={() => setMenuOpen(!menuOpen)}>
                            <NavLink to="/sign-in">ออกจากระบบ</NavLink>
                        </li>
                    </>
                )
            ) : (
                <li onClick={() => setMenuOpen(!menuOpen)}>
                    <NavLink to="/sign-in">เข้าสู่ระบบ</NavLink>
                </li>
            )}
        </ul>
    </nav>
    )
}


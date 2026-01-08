
import { Bell, Building2, Search } from "lucide-react";
import styles from "./Header.module.css";
import boyimage from '../assets/boy.png';
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Header(){
    const[profile, setProfile] = useState([]);
     const { user } = useSelector((state) => state.login);


    const user_id = user?.user_id;
    const nav=useNavigate();
      useEffect(() => {
            async function getProfile() {
                try {
                    const res = await axios.get(`${API_URL}/getuserdetails/${user_id}`);
                    if (res.data && res.data.length > 0) {
                        setProfile(res.data[0]);
                    }
                } catch (error) {
                    console.log("Error fetching profile:", error);
                } finally {
                    setLoading(false);
                }
            }
            if (user_id) getProfile();
            else setLoading(false);
        }, [user_id]);
    
    return(
        <nav className={styles.topNav}>
                <div className={styles.navContent}>
                    <div className={styles.brandSection}>
                        <Building2 size={28} className={styles.brandIcon} />
                        <span className={styles.brandName} onClick={()=>nav('/home')}>MyBank</span>
                    </div>

                    <div className={styles.navActions}>
                        <button className={styles.iconButton}>
                            <Search size={20} />
                        </button>
                        <button className={styles.iconButton}>
                            <Bell size={20} />
                            <span className={styles.notificationDot}></span>
                        </button>
                        <div className={styles.userMenu}>
                            <img src={boyimage} alt="User" className={styles.userAvatar} onClick={()=>nav('/profile')} />
                            <span className={styles.userName}>{profile.FirstName}</span>
                        </div>
                    </div>
                </div>
            </nav>
    )
}
export default Header;
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";

function Navbar() {
    const nav=useNavigate();
    const handlehome=()=>{
        nav('/home')
    }
    return (
        <nav className={styles.navbar}>
            <div className={styles.logo} onClick={handlehome}>MyBank</div>

            <ul className={styles.navLinks}>
                <li><Link to="/Home">Home</Link></li>
                <li><Link to="/deposit">Transfer Money</Link></li>
                <li><Link to="/transactions">Transactions</Link></li>
                <li><Link to="/profile">Profile</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;

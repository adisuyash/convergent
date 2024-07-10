import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";
import "../index.css";

const Header = () => {  
  return (
    <header className="font-['Inter']" style={styles.header}>
      <Link to="/" style={styles.title}>
        <h1 style={styles.logoText}>Convergent</h1>
      </Link>
      <div style={styles.connectButtonContainer}>
        <ConnectButton
          profileModal={true}
          showBalance={false}
          showProfilePicture={true}
        />
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#272A2F",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  title: {
    textDecoration: "none",
    color: "#D9D9D9",
  },
  logoText: {
    margin: 0,
    fontSize: "24px",
    fontWeight: "bold",
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
  },
  nav: {
    textDecoration: "none",
    color: "#D9D9D9",
    margin: "0 15px",
    fontWeight: "500",
    fontSize: "18px",
    transition: "color 0.3s",
  },
  connectButtonContainer: {
    display: "flex",
    alignItems: "center",
  },
};

export default Header;

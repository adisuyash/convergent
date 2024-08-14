import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";
import "../index.css";

const Header = () => {
  return (
    <header className="font-['Inter']" style={styles.header}>
      <div style={styles.leftSection}>
        <Link to="/" style={styles.title}>
          <h1 style={styles.logoText}>Convergent</h1>
        </Link>
        <nav style={styles.navigation}>
          <Link to="/trade" style={styles.navLink}>
            Trade
          </Link>
          <Link to="/vaults" style={styles.navLink}>
            Vaults
          </Link>
          <Link to="/portfolio" style={styles.navLink}>
            Portfolio
          </Link>
          <Link to="/referral" style={styles.navLink}>
            Referral
          </Link>
          <Link to="/points" style={styles.navLink}>
            Points
          </Link>
          <Link to="/Leaderboard" style={styles.navLink}>
            Leaderboard
          </Link>
          <Link to="/more" style={styles.navLink}>
            More
          </Link>
        </nav>
      </div>
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
    fontSize: "40px",
    fontWeight: "bold",
  },
  connectButtonContainer: {
    display: "flex",
    alignItems: "center",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    marginLeft: "5rem",
  },
  navLink: {
    textDecoration: "none",
    color: "#FFFFFF",
    marginRight: "4rem",
    fontSize: "1.3rem",
    lineHeight: 1,
  },
};

export default Header;

import { ConnectButton } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";

const Header = () => {
  const navLinks = [
    {
      title: "Perpetual",
      path: "/trade",
    },
    {
        title: "Dashboard",
        path: "/trade",
    },
    {
        title: "Market Place",
        path: "/trade",
    },
  ];
  
  return (
    <header style={styles.header}>
      <Link to="/" style={styles.title}>
        <h1 style={styles.logoText}>Perpetuals</h1>
      </Link>
      <nav style={styles.navContainer}>
        {navLinks.map((link) => (
          <Link key={link.title} to={link.path} style={styles.nav}>
            {link.title}
          </Link>
        ))}
      </nav>
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
    backgroundColor: "#282c34",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    color: "#fff",
  },
  title: {
    textDecoration: "none",
    color: "#fff",
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
    color: "#61dafb",
    margin: "0 15px",
    fontSize: "18px",
    fontWeight: "500",
    transition: "color 0.3s",
  },
  navHover: {
    color: "#21a1f1",
  },
  connectButtonContainer: {
    display: "flex",
    alignItems: "center",
  },
};

export default Header;

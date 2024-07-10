import { Link } from "react-router-dom";

const Header = () => {
  const navLinks = [
    {
      title: "Twitter",
      path: "/",
    },
    {
        title: "LinkedIn",
        path: "/",
    },
    {
        title: "Discord",
        path: "/",
    },
  ];
  
  return (
    <header className="font-['Inter']" style={styles.header}>
      <p style={styles.logoText}>Copyright Main Name</p>
        <nav style={styles.navContainer}>
        {navLinks.map((link) => (
          <Link key={link.title} to={link.path} style={styles.nav}>
            {link.title}
          </Link>
        ))}
      </nav>
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
    position: "fixed",
   left: "0",
   bottom: "0",
   width: "100%",
  },
  title: {
    textDecoration: "none",
    color: "#fff",
  },
  logoText: {
    margin: 0,
    fontSize: "18px",
  },
  navContainer: {
    display: "flex",
    alignItems: "center",
  },
  nav: {
    textDecoration: "none",
    color: "#D9D9D9",
    margin: "0 15px",
    fontSize: "16px",
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

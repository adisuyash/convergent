import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <HomeHeader />
      <div style={styles.div}>
        <h2>Perpetuals on AO!</h2>
            <p> Get ready to trade Perpetuals on Arweave!</p>
      {connected ? (
          <button style={styles.viewPostsButton}>
            <Link to="/trade" style={styles.viewPostsLink}>
              Start Trading
            </Link>
          </button>
        ) : (
          <ConnectButton style={styles.connectButton} />
        )}
      </div>
      <Footer />
    </main>
  );
};

export default Home;

const styles = {
  div: {
    height: "calc(100vh - 72px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  viewPostsButton: {
    padding: "10px 20px",
    backgroundColor: "#000",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  viewPostsLink: {
    color: "#fff",
    textDecoration: "none",
  },
};

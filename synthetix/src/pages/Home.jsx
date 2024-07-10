import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import HomeHeader from "../components/HomeHeader";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import "../index.css";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <HomeHeader />
      <div className="place-content-center text-[#D9D9D9] font-['Inter']" style={styles.div}>
        <h2 className="grid-item">Perpetuals on AO!</h2>
        <p className="paragraph grid-item">Get ready to trade Perpetuals on Arweave!</p>
        {connected ? (
          <div>
            <button className="start-trade grid-item" style={styles.viewPostsButton}>
            <Link className="text-[#16181D] font-medium" to="/trade" style={styles.viewPostsLink}>
              Start Trading
            </Link>
          </button>
          </div>
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
    height: "calc(100vh - 128px)",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 0px"
  },
  viewPostsButton: {
    padding: "10px 20px",
    backgroundColor: "#FF8929",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";
import "../index.css";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <div style={styles.div}>
        <h2>Convergent on AO!</h2>
        <p> Get ready to trade synthetic assets using Convergent on Arweave!</p>
        {connected ? (
          <button style={styles.viewPostsButton}>
            <Link to="/trade" style={styles.viewPostsLink}>
              Start Trading
            </Link>
          </button>)
          :
     (
      <ConnectButton style={styles.connectButton} />
      )
      }
    </div>
    </main >
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

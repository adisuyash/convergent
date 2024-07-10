import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import { Link } from "react-router-dom";
import "../index.css";

const Home = () => {
  const { connected } = useConnection();

  return (
    <main>
      <div style={styles.div}>
      <h2 className="text-7xl font-bold">Convergent</h2>
      <p className="text-3xl text-center mb-10"> Trade Perpetuals on Arweave</p>

        {connected ? (
          <Link className ="my-5 text-xl" to="/trade" style={styles.buttonLink}>
            Start Trading
          </Link>
        ) : (
          <ConnectButton style={styles.connectButton} />
        )}
      </div>
    </main>
  );
};

export default Home;

const styles = {
  div: {
    height: "calc(100vh - 128px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    textAlign: "center",
  },
  heading: {
    marginBottom: "20px",
  },
  paragraph: {
    marginBottom: "30px",
    maxWidth: "600px",
  },
  buttonLink: {
    display: "inline-block",
    padding: "12px 24px",
    backgroundColor: "#FF8929",
    color: "#16181D",
    textDecoration: "none",
    borderRadius: "4px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
  },
};
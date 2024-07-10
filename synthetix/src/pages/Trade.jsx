import { useEffect, useState } from "react";
import TradeHeader from "../components/TradeHeader";
import Footer from "../components/Footer";
import TradingViewWidget from '../components/TradingViewWidget';
import Positions from '../components/Positions';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const Mark = () => {
    const { connected } = useConnection();
    const processId = "";
    const [isFetching, setIsFetching] = useState(false);
    const [markList, setMarkList] = useState([]);
    const [error, setError] = useState(null);
  
    const syncMark = async () => {
      if (!connected) {
        return;
      }
  
      try {
        const result = await dryrun({
          process: processId,
          data: "",
          tags: [
            { name: "Action", value: "" },
          ],
          anchor: "1234",
        });
  
        const filteredResult = result.Messages.map((message) => {
          const parsedData = JSON.parse(message.Data);
          return parsedData;
        });
        console.log("Filtered result", filteredResult);
        setMarkList(filteredResult[0] || []);
      } catch (error) {
        console.error("Failed to fetch the mark value", error);
        setError("Failed to fetch the mark value");
      } finally {
        setIsFetching(false);
      }
    };
  
    useEffect(() => {
      setIsFetching(true);
      syncMark();
    }, [connected]);
  
    return (
      <div>
        <div style={styles.main}>
            <TradeHeader />
            <main style={styles.container}>
            <div style={styles.parentDiv}>
                <h2 style={styles.heading}>Mark</h2>
                {isFetching && <p style={styles.message}>Loading...</p>}
                {error && <p style={styles.errorText}>{error}</p>}
                {!isFetching && markList.length > 0 && (
                <ul style={styles.list}>
                    {/* {markList.map((follower, index) => (
                    <li key={index} style={styles.listItem}>
                        {follower.FollowerPID}
                    </li>
                    ))} */} EDIT TO DISPLAY DATA
                </ul>
                )}
            </div>
            </main>
            <TradingViewWidget />
            <Positions />
        </div>
        <Footer />
      </div>
    );
  };
    
  export default Mark;

  const styles = {
    main: {
      backgroundColor: "#16181D",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
    },
    container: {
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    heading: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    parentDiv: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      marginBottom: "20px",
      marginTop: "20px",
      padding: "40px",
      textAlign: "center",
    },
    message: {
      fontSize: "18px",
      color: "#555",
      marginBottom: "10px",
    },
    errorText: {
      fontSize: "18px",
      color: "red",
      marginBottom: "10px",
    },
    list: {
      listStyleType: "none",
      padding: 0,
      margin: 0,
      textAlign: "left",
    },
    listItem: {
      padding: "12px 20px",
      backgroundColor: "#f0f0f0",
      borderRadius: "8px",
      marginBottom: "10px",
      fontSize: "16px",
      color: "#333",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
  };

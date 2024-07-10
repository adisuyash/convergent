import { useEffect, useState } from "react";
import TradeHeader from "../components/TradeHeader";
import Footer from "../components/Footer";
import TradingViewWidget from "../components/TradingViewWidget";
import Positions from "../components/Positions";
import Orderbook from "../components/Orderbook";
import BuyandSell from "../components/BuyandSell";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

<<<<<<< HEAD
const Oracle = () => {
    const { connected } = useConnection();
    const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
    const [isFetching, setIsFetching] = useState(false);
    const [oracleList, setOracleList] = useState([]);
    const [error, setError] = useState(null);
  
    const syncOracle = async () => {
      if (!connected) {
        return;
      }
  
      try {
        const result = await dryrun({
          process: processId,
          data: "",
          tags: [
            { name: "Action", value: "GetIndexPrice" },
          ],
          anchor: "1234",
        });
        console.log("Oracle: ", result)
        const filteredResult = result.Messages.map((message) => {
          const parsedData = JSON.parse(message.Data);
          return parsedData;
        });
        console.log("Oracle Filtered result: ", filteredResult);
        setOracleList(filteredResult[0] || []);
      } catch (error) {
        console.error("Failed to fetch the oracle value", error);
        setError("Failed to fetch the oracle value");
      } finally {
        setIsFetching(false);
      }
    };
  
    useEffect(() => {
      setIsFetching(true);
      syncOracle();
    }, [connected]);
  
    return (
      <div>
        <div style={styles.main}>
            <TradeHeader />
            <main style={styles.container}>
            <div style={styles.parentDiv}>
                <h2 style={styles.heading}>Oracle</h2>
                {isFetching && <p style={styles.message}>Loading...</p>}
                {error && <p style={styles.errorText}>{error}</p>}
                {!isFetching && oracleList.length > 0 && (
                    oracleList.map((oracle, index) => (
                    <p key={index}>{oracle.IndexPrice}</p>
                    ))
                )}           
            </div>
            </main>
            </div>
            <TradingViewWidget />
            <Orderbook />
            <BuyandSell />
            <Positions />
        <Footer />
      </div>
    );
  };
    
  export default Oracle;
=======
const Mark = () => {
  const { connected } = useConnection();
  const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
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
        tags: [{ name: "Action", value: "" }],
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
    <main>
      <TradeHeader />
      <div>
        <main>
          <div>
            <h2 style={styles.heading}>Mark</h2>
            {isFetching && <p style={styles.message}>Loading...</p>}
            {error && <p style={styles.errorText}>{error}</p>}
            {!isFetching && markList.length > 0 && (
              <ul style={styles.list}>
                {/* {markList.map((follower, index) => (
                    <li key={index} style={styles.listItem}>
                        {follower.FollowerPID}
                    </li>
                    ))} */}{" "}
                EDIT TO DISPLAY DATA
              </ul>
            )}
          </div>
        </main>
      </div>
      <div className="tradediv flex">
      <TradingViewWidget />
        <Orderbook />
        <BuyandSell />
      </div>
      <Positions />
      <Footer />
    </main>
  );
};
>>>>>>> ba80235a53c94463785be36268936f0a9d3e85d9

export default Mark;

const styles = {};

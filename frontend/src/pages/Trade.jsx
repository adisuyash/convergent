import { useEffect, useState } from "react";
import TradeHeader from "../components/TradeHeader";
import TradingViewWidget from "../components/TradingViewWidget";
import Positions from "../components/Positions";
import Orderbook from "../components/Orderbook";
import BuyandSell from "../components/BuyandSell";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

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
        tags: [{ name: "Action", value: "GetIndexPrice" }],
        anchor: "1234",
      });
      console.log("Oracle: ", result);
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
          <div
            style={{
              border: "1px solid white",
              padding: "10px",
              margin: "10px",
            }}
          >
            <div style={styles.parentDiv}>
              <h2 style={styles.heading}>Oracle Price</h2>
              {isFetching && <p style={styles.message}>Loading...</p>}
              {error && <p style={styles.errorText}>{error}</p>}
              {!isFetching &&
                oracleList.length > 0 &&
                oracleList.map((oracle, index) => (
                  <p className="text-center" key={index}>
                    ${oracle.IndexPrice}
                  </p>
                ))}
            </div>
          </div>
        </main>
      </div>
      <div className="flex gap-0">
        <TradingViewWidget />
        <Orderbook />
        <BuyandSell />
      </div>
      <Positions />
    </div>
  );
};

export default Oracle;

const styles = {};

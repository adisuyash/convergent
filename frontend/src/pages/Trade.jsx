import { useEffect, useState, useCallback } from "react";
import TradeHeader from "../components/TradeHeader";
import TradingViewWidget from "../components/TradingViewWidget";
import Positions from "../components/Positions";
import Orderbook from "../components/Orderbook";
import BuyandSell from "../components/BuyandSell";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const Values = () => {
  const { connected } = useConnection();
  const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
  const [isFetching, setIsFetching] = useState(false);
  const [valueList, setValueList] = useState([]);
  const [error, setError] = useState(null);

  const syncValue = useCallback(async () => {
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
      console.log("Values: ", result);
      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Value Filtered result: ", filteredResult);
      setValueList(filteredResult[0] || []);
    } catch (error) {
      console.error("Failed to fetch the values", error);
      setError("Failed to fetch the values");
    } finally {
      setIsFetching(false);
    }
  }, [connected, processId]);

  useEffect(() => {
    setIsFetching(true);
    syncValue();
  }, [connected, syncValue]);

  return (
    <div style={styles.mainContainer}>
      <TradeHeader />
      <main>
        <div>
          {isFetching ? (
            <p>Loading...</p>
          ) : error ? (
            <p style={styles.error}>{error}</p>
          ) : (
            <div style={styles.marketDataGrid}>
              {valueList.map((item, index) => (
                <div key={index} style={styles.marketDataRow}>
                  <div style={styles.cell}>
                    <span style={styles.currency}>ARWEAVE / USD</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}>Oracle Price</span>
                    <span style={styles.value}>{item.IndexPrice}</span>
                  </div>

                  {/* To add the below mentioned details like Mark, 24hr change, Funding etc afterwards */}
                  <div style={styles.cell}>
                    <span style={styles.label}></span>
                    <span style={styles.value}>{item.Mark}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}></span>
                    <span style={styles.value}>{item.Change}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}></span>
                    <span style={styles.value}>{item.Volume}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}></span>
                    <span style={styles.value}>{item.Interest}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}></span>
                    <span style={styles.value}>{item.Funding}</span>
                  </div>
                  
              {/* <div style={styles.cell}>
                    <span style={styles.label}>Mark</span>
                    <span style={styles.value}>{item.Mark}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}>24h Change</span>
                    <span style={styles.value}>{item.Change}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}>24h Volume</span>
                    <span style={styles.value}>{item.Volume}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}>Open Interest</span>
                    <span style={styles.value}>{item.Interest}</span>
                  </div>
                  <div style={styles.cell}>
                    <span style={styles.label}>Funding / Countdown</span>
                    <span style={styles.value}>{item.Funding}</span>
                  </div> */}
                </div>
              ))}
            </div>
          )}
        </div>
      </main >
      <div className="flex gap-5">
        <div className="flex-[3]">
          <TradingViewWidget />
        </div>
        <div className="flex-[1]">
          <Orderbook />
        </div>
        <div className="flex-[1]">
          <BuyandSell />
        </div>
      </div>

      <Positions />
    </div>

  );
};

const styles = {
  marketDataGrid: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#2C2C2C',
    padding: '10px',
    color: 'white',
    border: '1px solid #444',
    borderRadius: '4px',
  },
  marketDataRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  cell: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0 10px',
  },
  label: {
    fontSize: '16px',
    color: '#888',
    marginBottom: '5px',
  },
  currency: {
    fontSize: '20px',
    color: '#FFF',
    marginBottom: '5px',
  },
  value: {
    fontSize: '14px',
    fontWeight: 'bold',
  },
};

export default Values;
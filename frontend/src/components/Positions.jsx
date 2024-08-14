import React, { useState, useEffect } from "react";
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";
import "../index.css";

const DataDisplay = () => {
  const { connected } = useConnection();
  const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!connected) {
      return;
    }

    try {
      const result = await dryrun({
        process: processId,
        data: "",
        tags: [{ name: "Action", value: "GetPositions" }],
        anchor: "1234",
      });
      console.log("Positions: ", result);

      const filteredResult = result.Messages.map((message) => {
        const parsedData = JSON.parse(message.Data);
        return parsedData;
      });
      console.log("Positions Filtered result: ", filteredResult);
      setData(filteredResult[0] || []);
    } catch (error) {
      console.error("Failed to fetch the data values", error);
      setError("Failed to fetch the data values");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    fetchData();
  }, [connected]);
  console.log("Data state:", data);
  return (
    <div style={styles.container}>
      <h1 style={styles.h1}>Positions</h1>
      {isFetching ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={styles.error}>{error}</p>
      ) : (
        <div style={styles.tableContainer}>
          {data.map((item, index) => (
            <div key={index} style={styles.row}>
              <div style={styles.cell}>
                <span style={styles.label}>Market</span>
                <span style={styles.value}>{item.BaseCurrency}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Side</span>
                <span style={styles.value}>{item.Side}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Size</span>
                <span style={styles.value}>{item.Amount}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Avg. Entry</span>
                <span style={styles.value}>{item.EntryPrice}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Market Price</span>
                <span style={styles.value}>{item.IndexPrice}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Liq Price</span>
                <span style={styles.value}>{item.LiquidationPrice}</span>
              </div>
              <div style={styles.cell}>
                <span style={styles.label}>Funding</span>
                <span style={styles.value}>{item.FundingRate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  tableContainer: {
    overflowX: "auto",
  },
  row: {
    display: "flex",
    padding: "10px 0",
  },
  cell: {
    flex: "1 0 auto",
    padding: "0 10px",
    display: "flex",
    flexDirection: "column",
    minWidth: "100px",
  },
  label: {
    fontSize: "12px",
    color: "#666",
    marginBottom: "5px",
  },
  value: {
    fontSize: "14px",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontWeight: "bold",
  },
  h1: {
    fontSize: "30px",
    borderBottom: "1px solid #FFFFFF",
  },
};

export default DataDisplay;

import React, { useState, useEffect } from 'react';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

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
          tags: [
            { name: "Action", value: "GetPositions" },
          ],
          anchor: "1234",
        });
        console.log("Positions: ", result)
  
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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>Side</th>
            <th>Size</th>
            <th>Avg. Entry</th>
            <th>Market Price</th>
            <th>Liq Price</th>
            <th>uP&L</th>
            <th>Funding</th>
            <th>Realized P&L</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>AR</td>
              <td>{item.Side}</td>
              <td>{item.Amount}</td>
              <td>{item.EntryPrice}</td>
              <td>{item.IndexPrice}</td>
              <td>{item.LiquidationPrice}</td>
              <td>{item.uPL}</td>
              <td>{item.FundingRate}</td>
              <td>{item.realizedPL}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataDisplay;
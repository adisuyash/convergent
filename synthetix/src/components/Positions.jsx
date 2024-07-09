import React, { useState, useEffect } from 'react';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

const DataDisplay = () => {
    const { connected } = useConnection();
    const processId = "";
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
            { name: "Action", value: "" },
          ],
          anchor: "1234",
        });
  
        const filteredResult = result.Messages.map((message) => {
          const parsedData = JSON.parse(message.Data);
          return parsedData;
        });
        console.log("Filtered result", filteredResult);
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
            <th>TP/SL</th>

          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.market}</td>
              <td>{item.side}</td>
              <td>{item.size}</td>
              <td>{item.avgEntry}</td>
              <td>{item.marketPrice}</td>
              <td>{item.liqPrice}</td>
              <td>{item.uP&L}</td>
              <td>{item.funding}</td>
              <td>{item.realizedP&L}</td>
              <td>{item.tp/sl}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataDisplay;
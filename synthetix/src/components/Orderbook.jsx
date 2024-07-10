import React, { useState, useEffect } from 'react';
import '../Orderbook.css';
import { useConnection } from "@arweave-wallet-kit/react";
import { dryrun } from "@permaweb/aoconnect";

function Orderbook() {
    const { connected } = useConnection();
    const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
    const [isFetching, setIsFetching] = useState(false);
    const [asks, setAsks] = useState([]);
    const [bids, setBids] = useState([]);
    const [spread, setSpread] = useState(0);
    const [error, setError] = useState(null);

    const calculateSpread = (lowestAsk, highestBid) => {
        if (lowestAsk && highestBid) {
            const spreadValue = lowestAsk.price - highestBid.price;
            setSpread(spreadValue.toFixed(2));
        }
    };

    const fetchOrderbookData = async () => {
        if (!connected) {
            return;
        }
        setIsFetching(true);
        setError(null);
        try {
            const result = await dryrun({
                process: processId,
                data: "",
                tags: [
                    { name: "Action", value: "" },
                ],
                anchor: "1234",
            });

            const filteredResult = result.Messages.map((message) => JSON.parse(message.Data));
            console.log("Filtered result", filteredResult);

            const orderBookData = filteredResult[0] || [];

            const askOrders = orderBookData.filter(order => order.type === 'ask')
                                           .sort((a, b) => a.price - b.price);
            const bidOrders = orderBookData.filter(order => order.type === 'bid')
                                           .sort((a, b) => b.price - a.price);

            setAsks(askOrders.slice(0, 10)); // Get top 10 ask orders
            setBids(bidOrders.slice(0, 10)); // Get top 10 bid orders

            if (askOrders.length > 0 && bidOrders.length > 0) {
                calculateSpread(askOrders[0], bidOrders[0]);
            }

        } catch (error) {
            console.error("Failed to fetch the orderbook data", error);
            setError("Failed to fetch the orderbook data");
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        if (connected) {
            fetchOrderbookData();
        }
    }, [connected]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (isFetching) {
        return <div>Loading...</div>;
    }

    return (
        <div className="orderbook">
            <h2>Orderbook</h2>
            <div className="orderbook-container">
                <div className="order-column asks">
                    <h3>Asks (Sell Orders)</h3>
                    <div className="order-header">
                        <span>Price</span>
                        <span>Amount</span>
                        <span>Total</span>
                    </div>
                    {asks.map((order, index) => (
                        <div key={index} className="order-row ask">
                            <span>{order.price.toFixed(2)}</span>
                            <span>{order.amount.toFixed(4)}</span>
                            <span>{(order.price * order.amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="spread-display">
                    <h3>Spread: {spread}</h3>
                </div>
                <div className="order-column bids">
                    <h3>Bids (Buy Orders)</h3>
                    <div className="order-header">
                        <span>Price</span>
                        <span>Amount</span>
                        <span>Total</span>
                    </div>
                    {bids.map((order, index) => (
                        <div key={index} className="order-row bid">
                            <span>{order.price.toFixed(2)}</span>
                            <span>{order.amount.toFixed(4)}</span>
                            <span>{(order.price * order.amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orderbook;
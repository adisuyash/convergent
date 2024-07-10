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
            const spreadValue = lowestAsk.Price - highestBid.Price;
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
                    { name: "Action", value: "GetOrderbook" },
                ],
                anchor: "1234",
            });

            console.log("Orderbook result: ", result)

            const filteredResult = result.Messages.map((message) => JSON.parse(message.Data));
            console.log("Orderbook Filtered result", filteredResult);

            const orderBookData = filteredResult[0] || [];

            const askOrders = orderBookData.filter(order => order.Side === 'Short')
                .sort((a, b) => a.Price - b.Price);
            const bidOrders = orderBookData.filter(order => order.Side === 'Long')
                .sort((a, b) => b.Price - a.Price);

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

    return (
        <div className="orderbook p-5">
            <h2 className='font-bold text-3xl'>Orderbook</h2>
            <div className="orderbook-container flex">
                <div className="order-column asks">
                    <h3 className='text-lg text-center'>Asks (Sell Orders)</h3>
                    <div className="order-header flex gap-20">
                        <span>Price</span>
                        <span>Amount</span>
                        <span>Total</span>
                    </div>
                    {asks.map((order, index) => (
                        <div key={index} className="order-row ask flex gap-20">
                            <span>{order.Price.toFixed(2)}</span>
                            <span>{order.Amount.toFixed(4)}</span>
                            <span>{(order.Price * order.Amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="spread-display">
                    <h3 className='text-lg text-center'>Spread: {spread}</h3>
                </div>
                <div className="order-column bids">
                    <h3 className='text-lg text-center'>Bids (Buy Orders)</h3>
                    <div className="order-header flex gap-20">
                        <span>Price</span>
                        <span>Amount</span>
                        <span>Total</span>
                    </div>
                    {bids.map((order, index) => (
                        <div key={index} className="order-row bid flex gap-20">
                            <span>{order.Price.toFixed(2)}</span>
                            <span>{order.Amount.toFixed(4)}</span>
                            <span>{(order.Price * order.Amount).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Orderbook;
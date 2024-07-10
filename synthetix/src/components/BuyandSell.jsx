import React, { useState } from 'react';
import '../BuySellComponent.css';
import { message } from "@permaweb/aoconnect";
import { useConnection } from "@arweave-wallet-kit/react";
import { createDataItemSigner } from "@permaweb/aoconnect";

function BuySellComponent() {
    const [orderType, setOrderType] = useState('buy_long');
    const processId = "PVU35t7MLuI_6f73ix-GWULD5qadJBEHIr3PV7Zj75k";
    const [price, setPrice] = useState('');
    const [size, setSize] = useState('');
    const [leverage, setLeverage] = useState(1);
    const [status, setStatus] = useState('');
    const { connected } = useConnection();
  
    const submitOrderToBackend = async (orderDetails) => {
        try {
          const side = orderType === 'buy_long' ? 'Long' : 'Short';
          
          const res = await message({
            process: processId,
            signer: createDataItemSigner(window.arweaveWallet),
            tags: [
              { name: "Action", value: "PlaceOrder" },
              { name: "MarketID", value: "2298405b" },
              { name: "OrderType", value: side },
              { name: "Side", value: side },
              { name: "Amount", value: orderDetails.size.toString() },
              { name: "Price", value: orderDetails.price.toString() },
              { name: "Leverage", value: orderDetails.leverage.toString() }
            ],
            data: JSON.stringify(orderDetails),
          });
          console.log("Response from backend:", res);
          return `${action} order placed successfully`;
        } catch (error) {
          console.error("Error submitting to backend:", error);
          throw error;
        }
      };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!connected) {
        setStatus("Not connected");
        return;
      }
  
      try {
        const orderDetails = { price, size, leverage };
        const result = await submitOrderToBackend(orderDetails);
        setStatus(result);
      } catch (error) {
        setStatus(`Failed to place ${orderType === 'buy_long' ? 'buy' : 'sell'} order`);
      }
  
      // Reset form after submission
      setPrice('');
      setSize('');
      setLeverage(1);
    };

  return (
    <div className="buy-sell-component">
      <h2 className='font-bold text-3xl'>Place Order</h2>
      <div className="order-type-toggle">
        <button 
          className={orderType === 'buy_long' ? 'active buy' : 'buy'}
          onClick={() => setOrderType('buy_long')}
        >
          Buy / Long
        </button>
        <button 
          className={orderType === 'sell_short' ? 'active sell' : 'sell'}
          onClick={() => setOrderType('sell_short')}
        >
          Sell / Short
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="price">Price (USD):</label>
          <input className='text-[#16181D]'
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </div>
        <div className="form-group">
          <label htmlFor="size">Size:</label>
          <input className='text-[#16181D]'
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            min="0"
            step="0.0001"
          />
        </div>
        <div className="form-group">
          <label htmlFor="leverage">Leverage: {leverage}x</label>
          <input
            type="range"
            id="leverage"
            min="1"
            max="25"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value))}
          />
        </div>
        <button type="submit" className={`submit-button ${orderType === 'buy_long' ? 'buy' : 'sell'}`}>
          {orderType === 'buy_long' ? 'BUY' : 'SELL'}
        </button>
      </form>
      {status && <p className="status">{status}</p>}
    </div>
  );
}

export default BuySellComponent;
import React, { useState } from 'react';
import '../BuySellComponent.css';

function BuySellComponent() {
  const [orderType, setOrderType] = useState('buy_long'); // 'buy_long' or 'sell_short'
  const [price, setPrice] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the order to your backend or blockchain
    console.log('Order submitted:', { orderType, price, size });
    // Reset form after submission
    setPrice('');
    setSize('');
  };

  return (
    <div className="buy-sell-component">
      <h2>Place Order</h2>
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
          <input
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
          <input
            type="number"
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            min="0"
            step="0.0001"
          />
        </div>
        <button type="submit" className={`submit-button ${orderType === 'buy_long' ? 'buy' : 'sell'}`}>
            {orderType === 'buy_long' ? 'BUY' : 'SELL'}
        </button>
      </form>
    </div>
  );
}

export default BuySellComponent;
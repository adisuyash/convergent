function checkLiquidations(marketId)
  local market = dbAdmin:exec(string.format([[
    SELECT IndexPrice FROM Markets WHERE MarketID = "%s";
  ]], marketId))[1]
  
  local positions = dbAdmin:exec(string.format([[
    SELECT * FROM Positions WHERE MarketID = "%s";
  ]], marketId))
  
  for _, position in ipairs(positions) do
    if (position.Side == "Long" and market.IndexPrice <= position.LiquidationPrice) or
       (position.Side == "Short" and market.IndexPrice >= position.LiquidationPrice) then
      liquidatePosition(position, market.IndexPrice)
    end
  end
end

function liquidatePosition(position, marketPrice)
  local pnl = calculatePnL(position, marketPrice)
  
  -- Close the position
  dbAdmin:exec(string.format([[
    DELETE FROM Positions WHERE PositionID = "%s";
  ]], position.PositionID))
  
  -- Update user balance
  dbAdmin:exec(string.format([[
    UPDATE Users
    SET Balance = Balance + %f
    WHERE UID = "%s";
  ]], pnl, position.UID))
  
  -- Create a market order to close the position
  local orderId = generateUniqueId()
  local side = position.Side == "Long" and "Sell" or "Buy"
  dbAdmin:exec(string.format([[
    INSERT INTO Orders (OrderID, UID, MarketID, Type, Side, Amount, Price, Timestamp, Status)
    VALUES ("%s", "%s", "%s", "Market", "%s", %f, %f, %d, "Open");
  ]], orderId, position.UID, position.MarketID, side, position.Amount, marketPrice, os.time()))
  
  print(string.format("Liquidated position %s for user %s", position.PositionID, position.UID))
end

function calculatePnL(position, marketPrice)
  local positionValue = position.Amount * marketPrice
  local entryValue = position.Amount * position.EntryPrice
  local pnl = position.Side == "Long" and (positionValue - entryValue) or (entryValue - positionValue)
  return pnl
end

-- This function should be called frequently (e.g., every minute)
function runLiquidationCheck()
  local markets = dbAdmin:exec("SELECT MarketID FROM Markets;")
  for _, market in ipairs(markets) do
    checkLiquidations(market.MarketID)
  end
end
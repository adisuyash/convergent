function updatePosition(userId, marketId, side, amount, price)
  local position = dbAdmin:exec(string.format([[
    SELECT * FROM Positions 
    WHERE UID = "%s" AND MarketID = "%s";
  ]], userId, marketId))[1]
  
  if position then
    if position.Side == side then
      -- Increase position
      local newAmount = position.Amount + amount
      local newEntryPrice = (position.EntryPrice * position.Amount + price * amount) / newAmount
      
      dbAdmin:exec(string.format([[
        UPDATE Positions
        SET Amount = %f, EntryPrice = %f
        WHERE PositionID = "%s";
      ]], newAmount, newEntryPrice, position.PositionID))
    else
      -- Reduce or flip position
      if amount < position.Amount then
        -- Reduce position
        local newAmount = position.Amount - amount
        dbAdmin:exec(string.format([[
          UPDATE Positions
          SET Amount = %f
          WHERE PositionID = "%s";
        ]], newAmount, position.PositionID))
      else
        -- Flip position
        local newAmount = amount - position.Amount
        dbAdmin:exec(string.format([[
          UPDATE Positions
          SET Side = "%s", Amount = %f, EntryPrice = %f
          WHERE PositionID = "%s";
        ]], side, newAmount, price, position.PositionID))
      end
    end
  else
    -- Create new position
    local positionId = generateUniqueId()
    dbAdmin:exec(string.format([[
      INSERT INTO Positions (PositionID, UID, MarketID, Side, EntryPrice, Amount, Leverage, LiquidationPrice)
      VALUES ("%s", "%s", "%s", "%s", %f, %f, 1, 0);
    ]], positionId, userId, marketId, side, price, amount))
  end
  
  calculateLiquidationPrice(userId, marketId)
end

function calculateLiquidationPrice(userId, marketId)
  local position = dbAdmin:exec(string.format([[
    SELECT * FROM Positions 
    WHERE UID = "%s" AND MarketID = "%s";
  ]], userId, marketId))[1]
  
  if position then
    local market = dbAdmin:exec(string.format([[
      SELECT IndexPrice FROM Markets WHERE MarketID = "%s";
    ]], marketId))[1]
    
    local liquidationPrice
    if position.Side == "Long" then
      liquidationPrice = position.EntryPrice * (1 - 1 / position.Leverage)
    else
      liquidationPrice = position.EntryPrice * (1 + 1 / position.Leverage)
    end
    
    dbAdmin:exec(string.format([[
      UPDATE Positions
      SET LiquidationPrice = %f
      WHERE PositionID = "%s";
    ]], liquidationPrice, position.PositionID))
  end
end
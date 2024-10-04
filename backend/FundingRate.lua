function calculateFundingRate(marketId)
  local market = dbAdmin:exec(string.format([[
    SELECT * FROM Markets WHERE MarketID = "%s";
  ]], marketId))[1]
  
  local positions = dbAdmin:exec(string.format([[
    SELECT * FROM Positions WHERE MarketID = "%s";
  ]], marketId))
  
  local longValue = 0
  local shortValue = 0
  
  for _, position in ipairs(positions) do
    local positionValue = position.Amount * market.IndexPrice
    if position.Side == "Long" then
      longValue = longValue + positionValue
    else
      shortValue = shortValue + positionValue
    end
  end
  
  local imbalance = (longValue - shortValue) / (longValue + shortValue)
  local fundingRate = imbalance * 0.01 -- 1% max funding rate
  
  dbAdmin:exec(string.format([[
    UPDATE Markets
    SET FundingRate = %f, LastFundingTime = %d
    WHERE MarketID = "%s";
  ]], fundingRate, os.time(), marketId))
  
  return fundingRate
end

function applyFunding(marketId)
  local market = dbAdmin:exec(string.format([[
    SELECT * FROM Markets WHERE MarketID = "%s";
  ]], marketId))[1]
  
  local positions = dbAdmin:exec(string.format([[
    SELECT * FROM Positions WHERE MarketID = "%s";
  ]], marketId))
  
  for _, position in ipairs(positions) do
    local fundingAmount = position.Amount * market.IndexPrice * market.FundingRate
    if position.Side == "Long" then
      fundingAmount = -fundingAmount
    end
    
    dbAdmin:exec(string.format([[
      UPDATE Users
      SET Balance = Balance + %f
      WHERE UID = "%s";
    ]], fundingAmount, position.UID))
  end
end

-- This function should be called periodically (e.g., every hour)
function updateFunding(marketId)
  local fundingRate = calculateFundingRate(marketId)
  applyFunding(marketId)
  print(string.format("Updated funding rate for market %s: %f", marketId, fundingRate))
end
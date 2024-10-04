Handlers.add("Dex.CreateMarket",
  function (msg)
    return msg.Action == "CreateMarket"
  end,
  function (msg)
    local marketId = msg.MarketID or generateUniqueId()
    dbAdmin:exec(string.format([[
      INSERT INTO Markets (MarketID, BaseCurrency, QuoteCurrency, IndexPrice, FundingRate, LastFundingTime)
      VALUES ("%s", "%s", "%s", %f, 0.0, %d);
    ]], marketId, msg.BaseCurrency, msg.QuoteCurrency, msg.IndexPrice, msg.Timestamp))
    Send({
      Target = msg.From,
      Action = "Dex.MarketCreated",
      Data = "Market successfully created."
    })
    print("Created market " .. marketId)
  end
)

Handlers.add("Dex.UpdateMarket",
  function (msg)
    return msg.Action == "UpdateMarket"
  end,
  function (msg)
    dbAdmin:exec(string.format([[
      UPDATE Markets
      SET IndexPrice = %f, FundingRate = %f, LastFundingTime = %d
      WHERE MarketID = "%s";
    ]], msg.IndexPrice, msg.FundingRate, msg.Timestamp, msg.MarketID))
    Send({
      Target = msg.From,
      Action = "Dex.MarketUpdated",
      Data = "Market successfully updated."
    })
    print("Updated market " .. msg.MarketID)
  end
)

function generateUniqueId()
  return string.format("%x", math.random(0, 2^32-1))
end
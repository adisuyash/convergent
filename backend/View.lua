Handlers.add("Dex.GetIndexPrice",
  function (msg)
    return msg.Action == "GetIndexPrice"
  end,
  function (msg)
    price = dbAdmin:exec([[SELECT IndexPrice FROM Markets WHERE MarketID = "2298405b";]])
    print(price)
    Send({Target = msg.From, Action = "Dex.GetIndexPrice", Data = require('json').encode(price)})
  end 
)

Handlers.add("Dex.GetPositions",
  function (msg)
    return msg.Action == "GetPositions"
  end,
  function (msg)
    positions = dbAdmin:exec([[
        SELECT * FROM Positions p LEFT OUTER JOIN Markets m ON p.MarketID = m.MarketID WHERE UID = "njmnUpLzADMY7mfra0BODaAwTEVo0OwVS7z2nTJTD14";
        ]])
    Send({Target = msg.From, Action = "Dex.GetPositions", Data = require('json').encode(positions)})
  end 
)

Handlers.add("Dex.GetOrderbook",
  function (msg)
    return msg.Action == "GetOrderbook"
  end,
  function (msg)
    orderbook = dbAdmin:exec([[SELECT * FROM Orders WHERE Status = "Open";]])
    Send({Target = msg.From, Action = "Dex.GetOrderbook", Data = require('json').encode(orderbook)})
  end 
)

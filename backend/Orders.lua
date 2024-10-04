function matchOrders(marketId)
  local buyOrders = dbAdmin:exec(string.format([[
    SELECT * FROM Orders 
    WHERE MarketID = "%s" AND Side = "Long" AND Status = "Open"
    ORDER BY Price DESC, Timestamp ASC;
  ]], marketId))
  
  local sellOrders = dbAdmin:exec(string.format([[
    SELECT * FROM Orders 
    WHERE MarketID = "%s" AND Side = "Short" AND Status = "Open"
    ORDER BY Price ASC, Timestamp ASC;
  ]], marketId))
  
  for _, buyOrder in ipairs(buyOrders) do
    for _, sellOrder in ipairs(sellOrders) do
      if buyOrder.Price >= sellOrder.Price then
        local matchedAmount = math.min(buyOrder.Amount, sellOrder.Amount)
        local matchPrice = sellOrder.Price
        
        -- Update positions
        updatePosition(buyOrder.UID, marketId, "Long", matchedAmount, matchPrice)
        updatePosition(sellOrder.UID, marketId, "Short", matchedAmount, matchPrice)
        
        -- Update orders
        updateOrder(buyOrder.OrderID, matchedAmount)
        updateOrder(sellOrder.OrderID, matchedAmount)
        
        buyOrder.Amount = buyOrder.Amount - matchedAmount
        sellOrder.Amount = sellOrder.Amount - matchedAmount
        
        if buyOrder.Amount == 0 then
          break
        end
      else
        break
      end
    end
  end
end

function updateOrder(orderId, matchedAmount)
  local order = dbAdmin:exec(string.format([[
    SELECT * FROM Orders WHERE OrderID = "%s";
  ]], orderId))[1]
  
  local newAmount = order.Amount - matchedAmount
  local newStatus = newAmount == 0 and "Filled" or "PartiallyFilled"
  
  dbAdmin:exec(string.format([[
    UPDATE Orders 
    SET Amount = %f, Status = "%s"
    WHERE OrderID = "%s";
  ]], newAmount, newStatus, orderId))
end

Handlers.add("Dex.PlaceOrder",
  function (msg)
    return msg.Action == "PlaceOrder"
  end,
  function (msg)
    local user = dbAdmin:exec(string.format([[
      SELECT UID, Balance from Users where UID = "%s";
    ]], msg.From))[1]

    print(user)
    
    if user then
      if canPlaceOrder(user.UID, msg.MarketID, msg.Amount, msg.Leverage) then
        local orderId = generateUniqueId()
        dbAdmin:exec(string.format([[
          INSERT INTO Orders (OrderID, UID, MarketID, Type, Side, Amount, Price, Timestamp, Status)
          VALUES ("%s", "%s", "%s", "%s", "%s", %f, %f, %d, "Open");
        ]], orderId, user.UID, msg.MarketID, msg.OrderType, msg.Side, msg.Amount, msg.Price, msg.Timestamp))
        
        Send({Target = msg.From, Action = "Dex.OrderPlaced", Data = "Order placed successfully."})
        print("New Order: " .. orderId)
        
        -- Trigger order matching
        matchOrders(msg.MarketID)
        
        -- Check for liquidations after order matching
        checkLiquidations(msg.MarketID)
        
        return "ok"
      else
        Send({Target = msg.From, Action = "Dex.OrderFailed", Data = "Insufficient margin to place order."})
        print("User has insufficient margin to place order")
      end
    else
      Send({Target = msg.From, Action = "Dex.OrderFailed", Data = "Not Registered"})
      print("User not registered, can't place order")
    end
  end
)

function generateUniqueId()
  return string.format("%x", math.random(0, 2^32-1))
end
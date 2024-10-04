function updateUserBalance(userId, amount)
  dbAdmin:exec(string.format([[
    UPDATE Users
    SET Balance = Balance + %f
    WHERE UID = "%s";
  ]], amount, userId))
end

function getAvailableMargin(userId)
  local user = dbAdmin:exec(string.format([[
    SELECT Balance FROM Users WHERE UID = "%s";
  ]], userId))[1]
  
  local positions = dbAdmin:exec(string.format([[
    SELECT * FROM Positions WHERE UID = "%s";
  ]], userId))
  
  local usedMargin = 0
  for _, position in ipairs(positions) do
    local market = dbAdmin:exec(string.format([[
      SELECT IndexPrice FROM Markets WHERE MarketID = "%s";
    ]], position.MarketID))[1]
    
    usedMargin = usedMargin + (position.Amount * market.IndexPrice) / position.Leverage
  end
  
  return user.Balance - usedMargin
end

function canPlaceOrder(userId, marketId, amount, leverage)
  local availableMargin = getAvailableMargin(userId)
  local market = dbAdmin:exec(string.format([[
    SELECT IndexPrice FROM Markets WHERE MarketID = "%s";
  ]], marketId))[1]
  
  local requiredMargin = (amount * market.IndexPrice) / leverage
  return availableMargin >= requiredMargin
end

Handlers.add("Dex.Deposit",
  function (msg)
    return msg.Action == "Deposit"
  end,
  function (msg)
    updateUserBalance(msg.From, msg.Amount)
    Send({
      Target = msg.From,
      Action = "Dex.Deposited",
      Data = string.format("Deposited %f successfully.", msg.Amount)
    })
    print(string.format("User %s deposited %f", msg.From, msg.Amount))
  end
)

Handlers.add("Dex.Withdraw",
  function (msg)
    return msg.Action == "Withdraw"
  end,
  function (msg)
    local availableMargin = getAvailableMargin(msg.From)
    if availableMargin >= msg.Amount then
      updateUserBalance(msg.From, -msg.Amount)
      Send({
        Target = msg.From,
        Action = "Dex.Withdrawn",
        Data = string.format("Withdrawn %f successfully.", msg.Amount)
      })
      print(string.format("User %s withdrew %f", msg.From, msg.Amount))
    else
      Send({
        Target = msg.From,
        Action = "Dex.WithdrawFailed",
        Data = "Insufficient available margin for withdrawal."
      })
    end
  end
)
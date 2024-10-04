local json = require("json")

_0RBIT = "BaMK1dfayo75s3q1ow6AO64UDpD9SEFbeE8xYrY2fyQ"
_0RBT_TOKEN = "BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc"

BASE_URL = "https://api.coinbase.com/v2/prices/AR-USD/spot"
FEE_AMOUNT = "1000000000000" -- 1 $0RBT

ReceivedData1 = ReceivedData1 or {}

Handlers.add(
	"Get-Request",
	Handlers.utils.hasMatchingTag("Action", "First-Get-Request"),
	function(msg)
		Send({
			Target = _0RBT_TOKEN,
			Action = "Transfer",
			Recipient = _0RBIT,
			Quantity = FEE_AMOUNT,
			["X-Url"] = BASE_URL,
			["X-Action"] = "Get-Real-Data"
		})
		print(Colors.green .. "You have sent a GET Request to the 0rbit process.")
	end
)

Handlers.add(
	"ReceiveData",
	Handlers.utils.hasMatchingTag("Action", "Receive-Response"),
	function(msg)
		local res = json.decode(msg.Data)
		ReceivedData1 = res
		print(Colors.green .. "You have received the data from the 0rbit process.")
	end
)

-- Send({Target="BUhZLMwQ6yZHguLtJYA5lLUa9LQzLXMXRfaq9FVcPJc", Action="Balance"})

function fetchMarketPrice(marketId)
	Send({ Target= ao.id, Action="First-Get-Request" })
	return ReceivedData1["data"]["amount"]
end

function updateMarketPrices()
  -- Update market prices (this function would need to be implemented to fetch current market prices)
  local markets = dbAdmin:exec("SELECT MarketID FROM Markets;")
  for _, market in ipairs(markets) do
    local newPrice = fetchMarketPrice(market.MarketID)  -- Implement this function to fetch the current market price
    dbAdmin:exec(string.format([[
      UPDATE Markets SET IndexPrice = %f WHERE MarketID = "%s";
    ]], newPrice, market.MarketID))
    
    -- Check for liquidations after price update
    -- checkLiquidations(market.MarketID)
  end
end

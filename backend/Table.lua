local sqlite3 = require('lsqlite3')
db = db or sqlite3.open_memory()
dbAdmin = require('@rakis/DbAdmin').new(db)

-- Create tables
USERS = [[
  CREATE TABLE IF NOT EXISTS Users (
    UID TEXT PRIMARY KEY,
    Balance FLOAT DEFAULT 0
  );
]]

MARKETS = [[
  CREATE TABLE IF NOT EXISTS Markets (
    MarketID TEXT PRIMARY KEY,
    BaseCurrency TEXT,
    QuoteCurrency TEXT,
    IndexPrice FLOAT,
    FundingRate FLOAT,
    LastFundingTime INTEGER
  );
]]

ORDERS = [[
  CREATE TABLE IF NOT EXISTS Orders (
    OrderID TEXT PRIMARY KEY,
    UID TEXT,
    MarketID TEXT,
    Type TEXT,
    Side TEXT,
    Amount FLOAT,
    Price FLOAT,
    Timestamp INTEGER,
    Status TEXT,
    FOREIGN KEY (UID) REFERENCES Users(UID),
    FOREIGN KEY (MarketID) REFERENCES Markets(MarketID)
  );
]]

POSITIONS = [[
  CREATE TABLE IF NOT EXISTS Positions (
    PositionID TEXT PRIMARY KEY,
    UID TEXT,
    MarketID TEXT,
    Side TEXT,
    EntryPrice FLOAT,
    Amount FLOAT,
    Leverage INTEGER,
    LiquidationPrice FLOAT,
    FOREIGN KEY (UID) REFERENCES Users(UID),
    FOREIGN KEY (MarketID) REFERENCES Markets(MarketID)
  );
]]

function InitDb()
  db:exec(USERS)
  db:exec(MARKETS)
  db:exec(ORDERS)
  db:exec(POSITIONS)
  return dbAdmin:tables()
end

InitDb()
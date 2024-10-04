Handlers.add("Dex.Register",
  function (msg)
    return msg.Action == "Register"
  end,
  function (msg)
    -- Check if user is already registered
    local userCount = #dbAdmin:exec(
      string.format([[SELECT * from Users where UID = "%s";]], msg.From)
    )
    if userCount > 0 then
      Send({Target = msg.From, Action = "Registered", Data = "Already Registered"})
      print("User already registered")
      return "Already Registered"
    end
    dbAdmin:exec(string.format([[
      INSERT INTO Users (UID, Balance) VALUES ("%s", 0);
    ]], msg.From))
    Send({
      Target = msg.From,
      Action = "Dex.Registered",
      Data = "Successfully Registered."
    })
    print("Registered " .. msg.From)
  end 
)
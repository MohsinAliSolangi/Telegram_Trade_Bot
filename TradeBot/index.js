const { getTokenData } = require("../utils/getTokenData");
const User = require("../models/user_model");

const mainBot = async (BOT) => {
  BOT.onText(/\/register/, async (msg) => {
    const chatId = msg.chat.id;
    try {
      const existingUser = await User.findOne({ chatId });

      if (existingUser) {
        BOT.sendMessage(chatId, "You are already registered.");
      } else {
        const newUser = new User({ chatId, alerts: [] });
        await newUser.save();
        BOT.sendMessage(chatId, "You are now registered!");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      BOT.sendMessage(chatId, "An error occurred. Please try again later.");
    }
  });

  BOT.onText(/\/get_token (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const tokenSymbol = match[1]?.toLowerCase();

    try {
      const user = await User.findOne({ chatId });

      if (!user) {
        BOT.sendMessage(chatId, "Please register first using /register");
        return;
      }

      const tokenData = await getTokenData(tokenSymbol);
      const message = `
            Token: ${tokenData.name}
            Current Price: $${tokenData.current_price}
            Market Cap: $${tokenData.market_cap}
            24h Volume: $${tokenData.total_volume}
            Price Change (24h): ${tokenData.price_change_percentage_24h}%
        `;
      BOT.sendMessage(chatId, message);
    } catch (error) {
      console.error("Error fetching token data:", error);
      BOT.sendMessage(chatId, "Token not found or an error occurred.");
    }
  });

  BOT.onText(/\/set_alert (.+) (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const tokenSymbol = match[1].toLowerCase();
    const priceThreshold = parseFloat(match[2]);

    try {
      const user = await User.findOne({ chatId });

      if (!user) {
        BOT.sendMessage(chatId, "Please register first using /register");
        return;
      }

      user.alerts.push({ tokenSymbol, priceThreshold });
      await user.save();
      BOT.sendMessage(
        chatId,
        `Alert set for ${tokenSymbol} at $${priceThreshold}`
      );
    } catch (error) {
      console.error("Error setting alert:", error);
      BOT.sendMessage(chatId, "An error occurred. Please try again.");
    }
  });

  BOT.onText(/\/list_alerts/, async (msg) => {
    const chatId = msg.chat.id;

    try {
      const user = await User.findOne({ chatId });

      if (!user) {
        BOT.sendMessage(chatId, "Please register first using /register");
        return;
      }

      if (user.alerts.length === 0) {
        BOT.sendMessage(chatId, "No active alerts.");
      } else {
        let message = "Active Alerts:\n";
        user.alerts.forEach((alert, index) => {
          message += `${index + 1}. Token: ${alert.tokenSymbol}, Price: $${
            alert.priceThreshold
          }\n`;
        });
        BOT.sendMessage(chatId, message);
      }
    } catch (error) {
      console.error("Error listing alerts:", error);
      BOT.sendMessage(chatId, "An error occurred. Please try again.");
    }
  });

  BOT.onText(/\/remove_alert (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const alertId = parseInt(match[1]) - 1;

    try {
      const user = await User.findOne({ chatId });

      if (!user || !user.alerts[alertId]) {
        BOT.sendMessage(chatId, "Invalid alert ID.");
        return;
      }

      user.alerts.splice(alertId, 1);
      await user.save();
      BOT.sendMessage(chatId, "Alert removed.");
    } catch (error) {
      console.error("Error removing alert:", error);
      BOT.sendMessage(chatId, "An error occurred. Please try again.");
    }
  });
};
module.exports = { mainBot };

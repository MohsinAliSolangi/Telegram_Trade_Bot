require("dotenv").config({ path: ".env" });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const MONGOURL = process.env.MONGOOSE_DB_URL;
const BOTTOKEN = process.env.TELEGRAM_BOT_TOKEN;
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

const TelegramBot = require("node-telegram-bot-api");
const { default: getTokenData } = require("./utils/getTokenData");

const User = require("./models/user_model");
const { mainBot } = require("./TradeBot");
const { default: axios } = require("axios");
const BOT = new TelegramBot(BOTTOKEN, { polling: true });

mainBot(BOT);

mongoose
  .connect(MONGOURL, {
    serverSelectionTimeoutMS: 60000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongose connected");
  })
  .catch((error) => {
    console.log(error);
  });


  BOT.onText(/\/start/, (msg) => {
    console.log(msg, "msg");

    const welcomeMessage = "Welcome to the Crypto Bot! Use /register to get started.";
    const logoUrl = "https://insidebitcoins.com/wp-content/uploads/2023/10/AI-Trading-For-Beginners-–-Best-AI-Trading-Bots.jpg";

    BOT.sendMessage(msg.chat.id, welcomeMessage)
        .then(() => {
            return BOT.sendPhoto(msg.chat.id, logoUrl);
        })
        .catch((error) => {
            console.error('Error sending message or photo:', error);
        });
});

const checkAlerts = async () => {
  try {
    const users = await User.find({ "alerts.0": { $exists: true } });

    for (const user of users) {
      for (const alert of user.alerts) {
        const tokenData = await getTokenData(alert.tokenSymbol);
        if (tokenData.current_price >= alert.priceThreshold) {
          BOT.sendMessage(
            user.chatId,
            `Alert: ${alert.tokenSymbol} has reached $${tokenData.current_price}`
          );
        }
      }
    }
  } catch (error) {
    console.error("Error checking alerts:", error);
  }
};

setInterval(checkAlerts, 60000); // 1 Mint

app.listen(PORT, () => `Server is Listening on port ${PORT}`);

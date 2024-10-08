# Crypto Telegram Bot

This is a Telegram bot for retrieving live cryptocurrency prices and setting alerts. It allows users to interact with the bot to get real-time data on various tokens.

## Features

- Get current prices for cryptocurrencies.
- Set price alerts for specific tokens.
- List active alerts.
- Remove alerts.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (Node Package Manager)

### Clone the Repository

To clone the repository, run the following command:

```bash
git clone https://github.com/yourusername/Telegram_Trade_Bot.git
cd Telegram_Trade_Bot

Set Up Environment Variables
Create a .env file in the root of your project.
Add the following lines to the .env file:
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
MONGOOSE_DB_URL=
Make sure to replace your_telegram_bot_token with your actual Telegram bot token.

Install Dependencies
Run the following command to install the necessary dependencies:
npm start

Using the Bot
Once the bot is running, you can use the following commands in your Telegram chat:

/register: Register to start using the bot.
/get_token <token_symbol>: Retrieve current data for a specified token (e.g., /get_token BTC).
/set_alert <token_symbol> <price_threshold>: Set a price alert for a specified token (e.g., /set_alert USDT 1.1).
/list_alerts: List all your active alerts.
/remove_alert <alert_id>: Remove a specific alert by its ID (e.g., /remove_alert 1).
 """

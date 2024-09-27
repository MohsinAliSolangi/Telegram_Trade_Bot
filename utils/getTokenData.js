const axios = require('axios');

const getTokenData = async (tokenSymbol) => {
  try {
      const response = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc");
      const tokenData = response.data.find(token => token.symbol === tokenSymbol.toLowerCase());
      return tokenData || null;
  } catch (error) {
      console.error('Error fetching token data:', error);
  }
};

module.exports = { getTokenData };
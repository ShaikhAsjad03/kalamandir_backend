const fs = require("fs");
const path = require("path");
const axios = require("axios");
const TOKEN_FILE = path.join(__dirname, "../access_token.json");
const APP_ID = process.env.INSTAGRAM_APP_ID;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

function getTokenData() {
  if (fs.existsSync(TOKEN_FILE)) {
    console.log(TOKEN_FILE);
    const raw = fs.readFileSync(TOKEN_FILE);
    return JSON.parse(raw);
  }
  return null;
}

function getToken() {
  const data = getTokenData();
  return data?.token || null;
}

function saveToken(token, expiresInSeconds) {
  const now = Date.now();
  const expiryTime = now + expiresInSeconds * 1000;
  const tokenData = {
    token,
    createdAt: now,
    expiresAt: expiryTime,
  };
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData), "utf-8");
}

function isTokenExpiringSoon(thresholdHours = 24) {
  const data = getTokenData();
  if (!data?.expiresAt) return true;
  const timeLeft = data.expiresAt - Date.now();
  return timeLeft <= thresholdHours * 60 * 60 * 1000;
}

async function refreshAccessToken(currentToken) {
  const url = `https://graph.facebook.com/v22.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${currentToken}`;
  const response = await axios.get(url);
  const newToken = response.data.access_token;
  const expiresIn = response.data.expires_in || 5184000;
  saveToken(newToken, expiresIn);
  return newToken;
}

module.exports = {
  getTokenData,
  saveToken,
  getToken,
  isTokenExpiringSoon,
  refreshAccessToken,
};

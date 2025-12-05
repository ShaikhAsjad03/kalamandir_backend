const cron = require("node-cron");
const { getToken, refreshAccessToken, isTokenExpiringSoon } = require("../helpers/InstaTokenhandler");
const instagramToken = new cron.schedule("0 2 * * *", async () => {
  try {
    console.log("[CRON] Checking token expiration...");
    const currentToken = await getToken();

    if (!currentToken) {
      console.warn("[CRON] No token found. Skipping.");
      return;
    }

    if (isTokenExpiringSoon(24)) {
      console.log("[CRON] Token is expiring soon. Refreshing...");
      await refreshAccessToken(currentToken);
      console.log("[CRON] Token refreshed.");
    } else {
      console.log("[CRON] Token is still valid.");
    }
  } catch (error) {
    console.error(
      "[CRON] Error refreshing token:",
      error.response?.data || error.message
    );
  }
});

instagramToken.start();

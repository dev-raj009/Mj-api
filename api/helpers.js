// ─────────────────────────────────────────────────────────────
//  helpers.js  —  Shared utility functions
// ─────────────────────────────────────────────────────────────

const { TOKEN, USER_ID, APP_ID, FIXED_HEADERS } = require("../config");

/**
 * Returns fully-formed headers for every upstream request.
 * Token, User_id, App_id sab hardcoded hain — kuch bhejna nahi padega.
 */
function getHeaders() {
  return {
    ...FIXED_HEADERS,
    Authorization: `Bearer ${TOKEN}`,
    User_id: USER_ID,
    App_id: APP_ID,
  };
}

/**
 * Uniform error response
 */
function sendError(res, err) {
  console.error("[API Error]", err.message);
  if (err.response) {
    return res.status(err.response.status).json({
      success: false,
      message: err.response.data?.message || "Upstream API error",
      upstream_status: err.response.status,
    });
  }
  const status = err.status || 500;
  return res.status(status).json({ success: false, message: err.message });
}

module.exports = { getHeaders, sendError };

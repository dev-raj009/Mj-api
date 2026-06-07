// ─────────────────────────────────────────────────────────────
//  config.js  —  Saari credentials aur constants yahan hain
// ─────────────────────────────────────────────────────────────

module.exports = {
  // ── Upstream API ──────────────────────────────────────────
  BASE_URL: "https://course.nexttoppers.com",

  // ── Auth credentials (hardcoded) ─────────────────────────
  TOKEN:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MzA0MTY1LCJhcHBfaWQiOiIxNzcyMTAwNjAwIiwiZGV2aWNlX2lkIjoiM2NkY2UwYWMtZjY5Ni00ODBhLThiZmYtZDBkZWFjYjg4ZWRkIiwicGxhdGZvcm0iOiIzIiwidXNlcl90eXBlIjoxLCJpYXQiOjE3ODA2NjczMDQsImV4cCI6MTc4MzI1OTMwNH0.juq00ZALWI5U5-xn1OuAYr5dsJKTihoe_iz9cUBF39A",
  USER_ID: "4245913",
  APP_ID: "1772100600",

  // ── Fixed headers jo har request mein jayenge ─────────────
  FIXED_HEADERS: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Platform: "3",
    Version: "1",
    Origin: "https://missionjeet.in",
    Referer: "https://missionjeet.in/",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
  },

  // ── Default pagination ────────────────────────────────────
  DEFAULT_LIMIT: "1000",
  DEFAULT_PAGE: "1",
};

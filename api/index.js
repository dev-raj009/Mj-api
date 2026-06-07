// ─────────────────────────────────────────────────────────────
//  api/index.js  —  All routes
//  Token / User_id / App_id sab config.js se auto-attach hote
//  hain. Client ko kuch bhejna nahi padta.
// ─────────────────────────────────────────────────────────────

const express = require("express");
const axios = require("axios");
const { BASE_URL, DEFAULT_LIMIT, DEFAULT_PAGE } = require("../config");
const { getHeaders, sendError } = require("./helpers");

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  next();
});

// ═════════════════════════════════════════════════════════════
//  1.  HEALTH CHECK
//  GET /api/health
// ═════════════════════════════════════════════════════════════
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "NextToppers API is live ✅",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
    note: "Token + User_id sab hardcoded hain — koi header bhejne ki zaroorat nahi",
    endpoints: [
      "GET  /api/health",
      "GET  /api/course/details?course_id=152",
      "GET  /api/course/details?course_id=152&parent_id=0",
      "GET  /api/course/content?course_id=152",
      "GET  /api/course/content?course_id=152&folder_id=6593",
      "GET  /api/course/content?course_id=184&folder_id=12181&parent_course_id=0",
      "GET  /api/course/file?content_id=17106&course_id=184",
      "GET  /api/course/search?course_id=152&keyword=physics",
      "GET  /api/course/search?course_id=152&keyword=physics&limit=20&page=1",
      "GET  /api/course/list",
      "GET  /api/course/packages?course_id=152",
      "GET  /api/course/free-content?course_id=152",
    ],
  });
});

// ═════════════════════════════════════════════════════════════
//  2.  COURSE DETAILS
//  GET /api/course/details?course_id=152
//  GET /api/course/details?course_id=152&parent_id=0
//
//  Returns: title, price, MRP, discount, description,
//           thumbnail, packages, educators, FAQs
// ═════════════════════════════════════════════════════════════
app.get("/api/course/details", async (req, res) => {
  try {
    const { course_id, parent_id = "0" } = req.query;
    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required. Example: ?course_id=152" });

    const { data } = await axios.post(
      `${BASE_URL}/course/course-details`,
      { course_id: String(course_id), parent_id: String(parent_id) },
      { headers: getHeaders() }
    );
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  3.  COURSE CONTENT  (folders + files)
//  GET /api/course/content?course_id=152
//  GET /api/course/content?course_id=152&folder_id=6593
//  GET /api/course/content?course_id=184&folder_id=12181&parent_course_id=0
//
//  folder_id=0  → root level folders (Physics, Chemistry…)
//  folder_id=N  → drill into that folder
// ═════════════════════════════════════════════════════════════
app.get("/api/course/content", async (req, res) => {
  try {
    const {
      course_id,
      folder_id = "0",
      parent_course_id = "0",
      limit = DEFAULT_LIMIT,
      page = DEFAULT_PAGE,
    } = req.query;

    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required. Example: ?course_id=152" });

    const { data } = await axios.post(
      `${BASE_URL}/course/all-content`,
      {
        course_id: String(course_id),
        folder_id: String(folder_id),
        is_free: "",
        keyword: "",
        limit: String(limit),
        page: String(page),
        parent_course_id: String(parent_course_id),
      },
      { headers: getHeaders() }
    );
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  4.  FILE / CONTENT DETAILS  (video URL, PDF URL, DRM info)
//  GET /api/course/file?content_id=17106&course_id=184
//
//  Returns: file_url, file_type, is_drm, is_download,
//           duration, thumbnail, video_time_bookmarks
// ═════════════════════════════════════════════════════════════
app.get("/api/course/file", async (req, res) => {
  try {
    const { content_id, course_id } = req.query;
    if (!content_id)
      return res.status(400).json({ success: false, message: "content_id query param required" });
    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required" });

    const { data } = await axios.get(
      `${BASE_URL}/course/content-details?content_id=${content_id}&course_id=${course_id}`,
      { headers: getHeaders() }
    );
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  5.  SEARCH CONTENT  (keyword search inside a course)
//  GET /api/course/search?course_id=152&keyword=physics
//  GET /api/course/search?course_id=152&keyword=cell&limit=20&page=1
// ═════════════════════════════════════════════════════════════
app.get("/api/course/search", async (req, res) => {
  try {
    const { course_id, keyword, limit = "50", page = DEFAULT_PAGE } = req.query;
    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required" });
    if (!keyword)
      return res.status(400).json({ success: false, message: "keyword query param required. Example: ?keyword=physics" });

    const { data } = await axios.post(
      `${BASE_URL}/course/all-content`,
      {
        course_id: String(course_id),
        folder_id: "0",
        is_free: "",
        keyword: String(keyword),
        limit: String(limit),
        page: String(page),
        parent_course_id: "0",
      },
      { headers: getHeaders() }
    );
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  6.  COURSE LIST  (all available courses)
//  GET /api/course/list
// ═════════════════════════════════════════════════════════════
app.get("/api/course/list", async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/course/course-list`, {
      headers: getHeaders(),
    });
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  7.  COURSE PACKAGES  (combo/bundle packages of a course)
//  GET /api/course/packages?course_id=152
//
//  Internally fetches course-details and extracts packages array
// ═════════════════════════════════════════════════════════════
app.get("/api/course/packages", async (req, res) => {
  try {
    const { course_id } = req.query;
    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required" });

    const { data } = await axios.post(
      `${BASE_URL}/course/course-details`,
      { course_id: String(course_id), parent_id: "0" },
      { headers: getHeaders() }
    );

    // Extract packages from overview section
    const overview = data?.data?.find((s) => s.type === "overview");
    const packagesLayout = overview?.data?.find((d) => d.layout_type === "packages");
    const packages = packagesLayout?.layout_data || [];

    return res.json({
      success: true,
      course_id,
      total: packages.length,
      packages,
    });
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  8.  FREE CONTENT  (demo / free lectures of a course)
//  GET /api/course/free-content?course_id=152
// ═════════════════════════════════════════════════════════════
app.get("/api/course/free-content", async (req, res) => {
  try {
    const { course_id, limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = req.query;
    if (!course_id)
      return res.status(400).json({ success: false, message: "course_id query param required" });

    const { data } = await axios.post(
      `${BASE_URL}/course/all-content`,
      {
        course_id: String(course_id),
        folder_id: "0",
        is_free: "1",
        keyword: "",
        limit: String(limit),
        page: String(page),
        parent_course_id: "0",
      },
      { headers: getHeaders() }
    );
    return res.json(data);
  } catch (err) {
    return sendError(res, err);
  }
});

// ═════════════════════════════════════════════════════════════
//  404 Fallback
// ═════════════════════════════════════════════════════════════
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.method} ${req.path}' nahi mila`,
    hint: "GET /api/health pe check karo saare endpoints",
  });
});

module.exports = app;

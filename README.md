# NextToppers Proxy API v2.0

> **Token, User_id, App_id sab hardcoded hain.**  
> Sirf `course_id`, `folder_id` etc. pass karo — data milega.  
> Vercel pe deploy karo, done.

---

## 🚀 Vercel Deploy (3 commands)

```bash
npm install -g vercel      # ek baar install karo
cd nexttoppers-api
vercel --prod              # deploy!
```

---

## 💻 Local Dev

```bash
npm install
npm run dev     # localhost:3000
```

---

## 📋 All Endpoints

> Base URL (local): `http://localhost:3000`  
> Base URL (Vercel): `https://your-project.vercel.app`

---

### 1. Health Check
```
GET /api/health
```
**Response:**
```json
{
  "success": true,
  "message": "NextToppers API is live ✅",
  "version": "2.0.0"
}
```

---

### 2. Course Details
```
GET /api/course/details?course_id=152
GET /api/course/details?course_id=152&parent_id=0
```
| Param | Type | Required | Default |
|-------|------|----------|---------|
| course_id | string | ✅ Yes | — |
| parent_id | string | ❌ No | `0` |

**Returns:** Title, price, MRP, discount %, description, thumbnail, packages list, educators, FAQs

---

### 3. Course Content (Folders + Files)
```
GET /api/course/content?course_id=152
GET /api/course/content?course_id=152&folder_id=6593
GET /api/course/content?course_id=184&folder_id=12181&parent_course_id=0
```
| Param | Type | Required | Default |
|-------|------|----------|---------|
| course_id | string | ✅ Yes | — |
| folder_id | string | ❌ No | `0` (root) |
| parent_course_id | string | ❌ No | `0` |
| limit | string | ❌ No | `1000` |
| page | string | ❌ No | `1` |

**Returns:** Array of folders and files with content counts (pdf/video/test)

> 💡 `folder_id=0` → root folders milte hain  
> 💡 `folder_id=6593` → us folder ke andar ka content

---

### 4. File / Content Details
```
GET /api/course/file?content_id=17106&course_id=184
```
| Param | Type | Required |
|-------|------|----------|
| content_id | string | ✅ Yes |
| course_id | string | ✅ Yes |

**Returns:** `file_url` (PDF/video link), `file_type`, `is_drm`, `is_download`, `duration`, `thumbnail`

---

### 5. Search Content
```
GET /api/course/search?course_id=152&keyword=physics
GET /api/course/search?course_id=152&keyword=cell&limit=20&page=1
```
| Param | Type | Required | Default |
|-------|------|----------|---------|
| course_id | string | ✅ Yes | — |
| keyword | string | ✅ Yes | — |
| limit | string | ❌ No | `50` |
| page | string | ❌ No | `1` |

---

### 6. Course List
```
GET /api/course/list
```
No params needed. Returns all available courses.

---

### 7. Course Packages
```
GET /api/course/packages?course_id=152
```
| Param | Type | Required |
|-------|------|----------|
| course_id | string | ✅ Yes |

**Returns:** Combo/bundle packages linked to a course (id, title, thumbnail, package_type)

---

### 8. Free / Demo Content
```
GET /api/course/free-content?course_id=152
```
| Param | Type | Required | Default |
|-------|------|----------|---------|
| course_id | string | ✅ Yes | — |
| limit | string | ❌ No | `1000` |
| page | string | ❌ No | `1` |

**Returns:** Only free/demo videos/lectures for that course

---

## ⚠️ Error Format

```json
{
  "success": false,
  "message": "Reason yahan hoga"
}
```

| Code | Matlab |
|------|--------|
| 400 | Required param missing |
| 401 | Token expire ho gaya (config.js update karo) |
| 404 | Route nahi mila |
| 500 | Upstream server error |

---

## 🗂 Project Files

```
nexttoppers-api/
├── config.js          ← Token, User_id, App_id yahan hain
├── api/
│   ├── index.js       ← Saare 8 routes
│   └── helpers.js     ← Header builder + error handler
├── index.js           ← Vercel entry point
├── package.json
├── vercel.json
└── README.md
```

---

## 🔄 Token Update Karna Ho Toh

`config.js` kholkar sirf `TOKEN` aur `USER_ID` change karo:

```js
TOKEN: "eyJhbGci...naya token...",
USER_ID: "naya_user_id",
```

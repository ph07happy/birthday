# Google Apps Script Backend — Spider-Verse Birthday Surprise

This directory contains the Google Apps Script backend code that links your Google Form response spreadsheet directly to the Spider-Verse website.

---

## 1. The Exact Three Google Form Fields

Your Google Form must have these exact three questions:

1. **`message to`** — The birthday person's name or intended recipient (Short answer).
2. **`message by`** — The sender's name and complete birthday message as submitted (Paragraph).
3. **`upload pictures`** — One or more uploaded pictures (File upload).

> **Note on Field Mapping:** The script automatically normalizes headers (ignoring case, spaces, and punctuation), matching `message to`, `message by`, and `upload pictures` even if the column headers in your spreadsheet have slight formatting differences.

---

## 2. Server-Side Birthday Reveal Enforcement

**Crucial Security Requirement:** Before the birthday countdown reaches zero:
- The API returns `{ locked: true, message: "...", data: [] }`.
- Real message text, sender names, and Google Drive picture links are **strictly kept secret** on the server.
- The frontend moving button playfully dodges clicks, and message routes are inaccessible.
- At the exact second the countdown reaches zero, the API automatically unlocks and serves the approved responses.

---

## 3. Step-by-Step Setup Instructions

### Step 1: Open the Form Responses Spreadsheet
1. Go to your **Google Form**.
2. Click the **Responses** tab.
3. Click the green **Link to Sheets** icon to create or open the linked spreadsheet.

### Step 2: Open Google Apps Script Editor
1. In the Google Spreadsheet menu, click **Extensions** > **Apps Script**.
2. Delete any default code in `Code.gs`.
3. Copy the entire contents of [`Code.gs`](file:///d:/downloads/spider_verse/backend/google-apps-script/Code.gs) and paste it into the editor.

### Step 3: Configure the Birthday Timestamp
In `Code.gs`, verify or edit the `BIRTHDAY_TIMESTAMP`:
```javascript
var CONFIG = {
  BIRTHDAY_TIMESTAMP: "2026-11-15T00:00:00+05:30",
  SHEET_NAME: "Form Responses 1",
  ID_PREFIX: "response"
};
```
Make sure this matches `birthdayDate` in `src/config/siteConfig.js`.

*(Optional)* You can also set `BIRTHDAY_TIMESTAMP` in **Project Settings** > **Script Properties** if you do not wish to edit code directly.

### Step 4: Deploy as a Web App
1. In the top-right corner of the Apps Script editor, click **Deploy** > **New deployment**.
2. Click the gear icon (Select type) > choose **Web app**.
3. Configure the deployment settings:
   - **Description**: `Spider-Verse Birthday API v1`
   - **Execute as**: `Me (your email address)`
   - **Who has access**: `Anyone` *(Must be "Anyone" so visitors can fetch birthday responses without logging into your personal Google account)*
4. Click **Deploy**.
5. Grant permissions when prompted by Google.
6. Copy the generated **Web App URL** (e.g., `https://script.google.com/macros/s/AKfycb.../exec`).

### Step 5: Connect Frontend to Backend
Open [`src/config/apiConfig.js`](file:///d:/downloads/spider_verse/src/config/apiConfig.js) and paste the URL:
```javascript
export const apiConfig = {
  appsScriptUrl: "https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec",
  apiMode: "auto",
  requestTimeoutMs: 12000,
  useJsonpFallback: true,
};
```

---

## 4. Google Drive Image Sharing Permissions

When visitors upload images to your Google Form, the files are stored in a designated Google Drive folder created by Google Forms.

### To allow the photos to be displayed in the website's comic gallery:
1. Open Google Drive and locate the folder: `[Your Form Name] (File Responses)`.
2. Right-click the folder and select **Share** > **Share**.
3. Under **General access**, change it from *Restricted* to:
   - **Anyone with the link**
   - Role: **Viewer**
4. Click **Done**.

> **Privacy Notice:** Anyone with the direct image link will be able to view the uploaded photos. Do not upload sensitive or private personal documents.

---

## 5. API Endpoints Contract

| Endpoint Query | Purpose | Locked Response | Unlocked Response |
| :--- | :--- | :--- | :--- |
| `?action=getMessages` | Retrieve all responses | `{ locked: true, data: [] }` | `{ locked: false, data: [...] }` |
| `?action=getMessageById&id=response-001` | Retrieve single response | `{ locked: true, data: null }` | `{ locked: false, data: {...} }` |
| `?action=getStatus` | Check countdown state | `{ locked: true, unlockTime: "..." }` | `{ locked: false, unlockTime: "..." }` |
| `&callback=myCallback` | JSONP support | `myCallback({...})` | `myCallback({...})` |

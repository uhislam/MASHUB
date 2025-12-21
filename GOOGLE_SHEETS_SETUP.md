# Google Sheets Setup Guide

## Overview
This guide will help you configure the attendance dashboard to use Google Sheets as the backend database.

---

## Part 1: Create Your Google Sheet

### 1. Create a New Spreadsheet
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"MAS Houston Tarbiya Attendance"**

### 2. Create the Required Sheets (Tabs)
Create 5 separate sheets within your spreadsheet with these exact names:

#### Sheet 1: **Settings**
| key | value |
|-----|-------|
| windowMonths | 2 |

#### Sheet 2: **Usrah**
| usrah_id | usrah_name | submission_code |
|----------|------------|-----------------|
| u1 | North River | NR-8432 |
| u2 | East Grove | EG-1923 |
| u3 | Westfield | WF-5520 |

#### Sheet 3: **People**
| person_id | name | usrah_id | active | is_member | development_plan |
|-----------|------|----------|--------|-----------|------------------|
| p1 | Aisha Rahman | u1 | TRUE | TRUE | TRUE |
| p2 | Fatimah Khan | u1 | TRUE | TRUE | FALSE |
| p3 | Yusuf Malik | u1 | TRUE | TRUE | TRUE |

*Note: Use TRUE/FALSE for boolean columns*

#### Sheet 4: **Weeks**
| week_id | start_date | end_date |
|---------|------------|----------|
| 2025-W01 | 2025-01-06 | 2025-01-12 |
| 2025-W02 | 2025-01-13 | 2025-01-19 |
| 2025-W03 | 2025-01-20 | 2025-01-26 |

*Format dates as YYYY-MM-DD*

#### Sheet 5: **Attendance**
| person_id | week_id | status | reported_by | reported_at |
|-----------|---------|--------|-------------|-------------|
| p1 | 2025-W01 | present | u1 | 2025-01-07 |
| p2 | 2025-W01 | absent | u1 | 2025-01-07 |

*Status values: present, absent, excused*

---

## Part 2: Get Google Sheets API Key

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Create Project"**
3. Name it: **"Tarbiya Attendance Dashboard"**
4. Click **"Create"**

### 2. Enable Google Sheets API
1. In the Cloud Console, go to **"APIs & Services" > "Library"**
2. Search for **"Google Sheets API"**
3. Click on it and press **"Enable"**

### 3. Create API Key
1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "API Key"**
3. Copy the API key (you'll need this later)
4. Click **"Edit API Key"**
5. Under **"API restrictions"**, select **"Restrict key"**
6. Check **"Google Sheets API"**
7. Under **"Website restrictions"** (optional):
   - Add your domain if hosting online
   - For local testing, you can use **"None"**
8. Click **"Save"**

### 4. Make Your Spreadsheet Public (Read-Only)
1. Open your Google Sheet
2. Click **"Share"** (top right)
3. Click **"Change to anyone with the link"**
4. Set permission to **"Viewer"**
5. Click **"Done"**

### 5. Get Your Spreadsheet ID
1. Look at your Google Sheet URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```
2. Copy the long ID between `/d/` and `/edit`

---

## Part 3: Create Google Apps Script for Writing Data

Since the API key only allows reading, we need Apps Script for submissions.

### 1. Open Script Editor
1. In your Google Sheet, go to **Extensions > Apps Script**
2. Delete any sample code

### 2. Paste This Code
```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Attendance');
    const data = JSON.parse(e.postData.contents);
    const records = data.records;
    
    records.forEach(record => {
      // Check if record already exists
      const lastRow = sheet.getLastRow();
      let found = false;
      
      for (let i = 2; i <= lastRow; i++) {
        const personId = sheet.getRange(i, 1).getValue();
        const weekId = sheet.getRange(i, 2).getValue();
        
        if (personId === record.person_id && weekId === record.week_id) {
          // Update existing row
          sheet.getRange(i, 3).setValue(record.status);
          sheet.getRange(i, 4).setValue(record.reported_by);
          sheet.getRange(i, 5).setValue(record.reported_at);
          found = true;
          break;
        }
      }
      
      // Add new row if not found
      if (!found) {
        sheet.appendRow([
          record.person_id,
          record.week_id,
          record.status,
          record.reported_by,
          record.reported_at
        ]);
      }
    });
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Attendance submitted successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 3. Deploy the Script
1. Click **"Deploy" > "New deployment"**
2. Click the gear icon ⚙️ next to **"Select type"**
3. Choose **"Web app"**
4. Set **"Execute as"**: **"Me"**
5. Set **"Who has access"**: **"Anyone"**
6. Click **"Deploy"**
7. Authorize the app (click **"Authorize access"**)
8. Copy the **Web app URL** (looks like: `https://script.google.com/macros/s/.../exec`)

---

## Part 4: Configure Your Dashboard

### 1. Update index.html
Open `index.html` and find the `CONFIG` section at the top of the script tag:

```javascript
const CONFIG = {
  SPREADSHEET_ID: 'YOUR_SPREADSHEET_ID_HERE',  // Paste your Spreadsheet ID
  API_KEY: 'YOUR_API_KEY_HERE',                // Paste your API Key
  SHEET_NAMES: {
    settings: 'Settings',
    usrah: 'Usrah',
    people: 'People',
    weeks: 'Weeks',
    attendance: 'Attendance'
  },
  USE_GOOGLE_SHEETS: false  // Change to true when ready
};
```

### 2. Add Apps Script URL
Find this line and replace with your Apps Script URL:
```javascript
const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
```

### 3. Enable Google Sheets
Change this line:
```javascript
USE_GOOGLE_SHEETS: true  // Set to true
```

---

## Part 5: Test Your Setup

### 1. Test Reading Data
1. Open `index.html` in a browser
2. Open browser console (F12)
3. Look for: `"Data loaded from Google Sheets successfully"`
4. The dashboard should display your Google Sheets data

### 2. Test Writing Data
1. Scroll to **"Submit Attendance"** section
2. Enter a submission code (e.g., `NR-8432`)
3. Select a week
4. Mark attendance for all members
5. Click **"Submit Attendance"**
6. Check your Google Sheet - new rows should appear in the Attendance tab

---

## Troubleshooting

### Error: "Failed to fetch"
- Check that your Spreadsheet is set to "Anyone with the link can view"
- Verify your Spreadsheet ID is correct
- Ensure Google Sheets API is enabled in Cloud Console

### Error: "Invalid API Key"
- Verify you copied the entire API key
- Check that API restrictions allow Google Sheets API
- Make sure the key isn't expired

### Attendance Submission Fails
- Check that Apps Script is deployed as "Web app"
- Verify "Who has access" is set to "Anyone"
- Check the Apps Script URL is correct
- Look at the Apps Script execution logs for errors

### CORS Errors
- This is normal for local development
- Apps Script should handle CORS automatically
- If issues persist, consider hosting on a web server

---

## Security Notes

⚠️ **Important Security Considerations:**

1. **API Key Exposure**: The API key will be visible in your HTML source code. This is acceptable since:
   - The key is restricted to Google Sheets API only
   - Your sheet is read-only for public access
   - You can set website restrictions on the key

2. **Apps Script Access**: The script has "Anyone" access, but:
   - It only accepts properly formatted data
   - All submissions are logged in your sheet
   - You can add validation logic in the script

3. **For Production Use**:
   - Consider adding authentication for submission endpoints
   - Implement rate limiting in Apps Script
   - Monitor the Apps Script execution logs regularly
   - Rotate API keys periodically

---

## Next Steps

Once everything is working:
1. Add your real usrah groups, members, and weeks to the sheets
2. Share submission codes with usra leads
3. Monitor submissions in your Google Sheet
4. Consider setting up email notifications in Apps Script for new submissions

---

## Support

If you run into issues:
1. Check the browser console for error messages
2. Review Apps Script execution logs
3. Verify all sheet column headers match exactly
4. Ensure date formats are YYYY-MM-DD
5. Check that boolean values are TRUE/FALSE (not Yes/No)

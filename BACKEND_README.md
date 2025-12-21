# MASHUB Backend Setup

## Requirements
- Node.js 14+ 
- npm

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:3000`

For development with auto-restart:
```bash
npm run dev
```

## Data Storage

All data is stored in JSON files in the `/data` directory:
- `data/usrah.json` - Usrah groups
- `data/people.json` - Members
- `data/weeks.json` - Tracking weeks
- `data/attendance.json` - Attendance records

Data is automatically initialized on first run.

## API Endpoints

### Usrah
- `GET /api/usrah` - List all usrah
- `GET /api/usrah/:id` - Get usrah by ID

### People
- `GET /api/people` - List all people
- `GET /api/people/:id` - Get person by ID
- `PUT /api/people/:id` - Update person

### Weeks
- `GET /api/weeks` - List all weeks
- `POST /api/weeks` - Add new week

### Attendance
- `GET /api/attendance` - List all attendance records
- `GET /api/attendance/:personId` - Get records for a person
- `POST /api/attendance` - Submit attendance (accepts array or single object)
- `PUT /api/attendance/:id` - Update attendance record

### Settings
- `GET /api/settings` - Get app settings

### Health
- `GET /api/health` - Check server status

## Attendance Record Schema

```json
{
  "person_id": "p1",
  "week_id": "2025-W09",
  "status": "present",  // "present", "absent", "excused"
  "reported_by": "u1",  // usrah_id
  "reported_at": "2025-03-09",
  "brotherhood": 4,
  "pdpCompliance": 1,
  "quran": 3,
  "activism": 4,
  "leadership": 3,
  "chapter": 2,
  "membership": 1,
  "overall_brotherhood": 4,
  "overall_curriculum": 3
}
```

## Frontend Integration

The frontend can use the `api-client.js` helper:

```javascript
const api = new MASHUBApi('http://localhost:3000');

// Load data
const usrah = await api.loadUsrah();
const attendance = await api.loadAttendance();

// Submit attendance
await api.submitAttendance(attendanceRecords);
```

Or fetch directly:

```javascript
fetch('http://localhost:3000/api/usrah')
  .then(r => r.json())
  .then(data => console.log(data));
```

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.static('.'));

// Initialize data on startup
db.initializeData();

// ============ USRAH ENDPOINTS ============
app.get('/api/usrah', (req, res) => {
  const usrah = db.readData('usrah');
  res.json(usrah);
});

app.get('/api/usrah/:id', (req, res) => {
  const usrah = db.readData('usrah');
  const found = usrah.find(u => u.usrah_id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Usrah not found' });
  res.json(found);
});

// ============ PEOPLE ENDPOINTS ============
app.get('/api/people', (req, res) => {
  const people = db.readData('people');
  res.json(people);
});

app.get('/api/people/:id', (req, res) => {
  const people = db.readData('people');
  const found = people.find(p => p.person_id === req.params.id);
  if (!found) return res.status(404).json({ error: 'Person not found' });
  res.json(found);
});

app.put('/api/people/:id', (req, res) => {
  const people = db.readData('people');
  const idx = people.findIndex(p => p.person_id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Person not found' });
  
  people[idx] = { ...people[idx], ...req.body, person_id: req.params.id };
  if (db.writeData('people', people)) {
    res.json(people[idx]);
  } else {
    res.status(500).json({ error: 'Failed to update person' });
  }
});

// ============ WEEKS ENDPOINTS ============
app.get('/api/weeks', (req, res) => {
  const weeks = db.readData('weeks');
  res.json(weeks);
});

app.post('/api/weeks', (req, res) => {
  const weeks = db.readData('weeks');
  const newWeek = {
    week_id: req.body.week_id,
    start_date: req.body.start_date,
    end_date: req.body.end_date
  };
  weeks.push(newWeek);
  if (db.writeData('weeks', weeks)) {
    res.status(201).json(newWeek);
  } else {
    res.status(500).json({ error: 'Failed to create week' });
  }
});

// ============ ATTENDANCE ENDPOINTS ============
app.get('/api/attendance', (req, res) => {
  const attendance = db.readData('attendance');
  res.json(attendance);
});

app.get('/api/attendance/:personId', (req, res) => {
  const attendance = db.readData('attendance');
  const records = attendance.filter(a => a.person_id === req.params.personId);
  res.json(records);
});

app.post('/api/attendance', (req, res) => {
  const attendance = db.readData('attendance');
  const records = Array.isArray(req.body) ? req.body : [req.body];
  
  records.forEach(record => {
    const newRecord = {
      person_id: record.person_id,
      week_id: record.week_id,
      status: record.status, // 'present', 'absent', 'excused'
      reported_by: record.reported_by, // usrah_id
      reported_at: record.reported_at || new Date().toISOString().split('T')[0],
      brotherhood: record.brotherhood || 0,
      pdpCompliance: record.pdpCompliance || 0,
      quran: record.quran || 0,
      activism: record.activism || 0,
      leadership: record.leadership || 0,
      chapter: record.chapter || 0,
      membership: record.membership || 0,
      overall_brotherhood: record.overall_brotherhood || 0,
      overall_curriculum: record.overall_curriculum || 0
    };
    
    // Remove duplicate if exists (same person, week, reported_by)
    const dupIdx = attendance.findIndex(
      a => a.person_id === record.person_id && 
           a.week_id === record.week_id && 
           a.reported_by === record.reported_by
    );
    if (dupIdx !== -1) {
      attendance[dupIdx] = newRecord;
    } else {
      attendance.push(newRecord);
    }
  });
  
  if (db.writeData('attendance', attendance)) {
    res.status(201).json(records);
  } else {
    res.status(500).json({ error: 'Failed to submit attendance' });
  }
});

app.put('/api/attendance/:id', (req, res) => {
  const attendance = db.readData('attendance');
  const idx = attendance.findIndex((_, i) => i === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Attendance record not found' });
  
  attendance[idx] = { ...attendance[idx], ...req.body };
  if (db.writeData('attendance', attendance)) {
    res.json(attendance[idx]);
  } else {
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// ============ SETTINGS ENDPOINTS ============
app.get('/api/settings', (req, res) => {
  res.json({
    windowMonths: 2
  });
});

// ============ HEALTHCHECK ============
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════╗
║        MASHUB Backend Server         ║
╚══════════════════════════════════════╝
  
  Environment: ${NODE_ENV}
  URL: http://localhost:${PORT}
  API: http://localhost:${PORT}/api
  
  Frontend:
  - Dashboard: http://localhost:${PORT}
  - Attendance: http://localhost:${PORT}/attendance.html
  - Health Check: http://localhost:${PORT}/api/health
  
  Data stored in: ${process.env.DATA_DIR || './data'}
  `);

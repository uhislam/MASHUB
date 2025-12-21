const fs = require('fs');
const path = require('path');

const dataDir = process.env.DATA_DIR || path.join(__dirname, 'data');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dataFiles = {
  usrah: 'usrah.json',
  people: 'people.json',
  attendance: 'attendance.json',
  weeks: 'weeks.json'
};

// Initialize default data if files don't exist
function initializeData() {
  const defaultData = {
    usrah: [
      { usrah_id: "u1", usrah_name: "North River" },
      { usrah_id: "u2", usrah_name: "East Grove" },
      { usrah_id: "u3", usrah_name: "Westfield" }
    ],
    people: [
      { person_id: "p1", name: "Aisha Rahman", usrah_id: "u1", active: true, join_date: "2024-09-15" },
      { person_id: "p2", name: "Fatimah Khan", usrah_id: "u1", active: true, join_date: "2024-08-20" },
      { person_id: "p3", name: "Yusuf Malik", usrah_id: "u1", active: true, join_date: "2024-07-10" },
      { person_id: "p4", name: "Ismail Odeh", usrah_id: "u2", active: true, join_date: "2024-10-01" },
      { person_id: "p5", name: "Maryam Said", usrah_id: "u2", active: true, join_date: "2024-09-05" },
      { person_id: "p7", name: "Omar Saleh", usrah_id: "u3", active: true, join_date: "2024-08-15" },
      { person_id: "p8", name: "Sarah Idris", usrah_id: "u3", active: true, join_date: "2024-07-20" },
      { person_id: "p9", name: "Bilal Karim", usrah_id: "u3", active: true, join_date: "2024-06-30" }
    ],
    weeks: [
      { week_id: "2025-W09", start_date: "2025-03-03", end_date: "2025-03-09" },
      { week_id: "2025-W10", start_date: "2025-03-10", end_date: "2025-03-16" },
      { week_id: "2025-W11", start_date: "2025-03-17", end_date: "2025-03-23" },
      { week_id: "2025-W12", start_date: "2025-03-24", end_date: "2025-03-30" },
      { week_id: "2025-W13", start_date: "2025-03-31", end_date: "2025-04-06" },
      { week_id: "2025-W14", start_date: "2025-04-07", end_date: "2025-04-13" },
      { week_id: "2025-W15", start_date: "2025-04-14", end_date: "2025-04-20" },
      { week_id: "2025-W16", start_date: "2025-04-21", end_date: "2025-04-27" }
    ],
    attendance: []
  };

  for (const [key, filename] of Object.entries(dataFiles)) {
    const filepath = path.join(dataDir, filename);
    if (!fs.existsSync(filepath)) {
      fs.writeFileSync(filepath, JSON.stringify(defaultData[key], null, 2));
    }
  }
}

function readData(dataType) {
  const filepath = path.join(dataDir, dataFiles[dataType]);
  try {
    const data = fs.readFileSync(filepath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${dataType}:`, err);
    return [];
  }
}

function writeData(dataType, data) {
  const filepath = path.join(dataDir, dataFiles[dataType]);
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing ${dataType}:`, err);
    return false;
  }
}

module.exports = {
  initializeData,
  readData,
  writeData
};

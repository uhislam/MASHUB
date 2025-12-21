// API client for MASHUB frontend
// Usage: const api = new MASHUBApi('http://localhost:3000');

class MASHUBApi {
  constructor(baseURL = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  }

  // Data loading methods
  async loadUsrah() {
    return this.get('/api/usrah');
  }

  async loadPeople() {
    return this.get('/api/people');
  }

  async loadWeeks() {
    return this.get('/api/weeks');
  }

  async loadAttendance() {
    return this.get('/api/attendance');
  }

  async loadSettings() {
    return this.get('/api/settings');
  }

  // Data submission methods
  async submitAttendance(records) {
    return this.post('/api/attendance', records);
  }

  async updatePerson(personId, data) {
    return this.put(`/api/people/${personId}`, data);
  }

  // Health check
  async healthCheck() {
    return this.get('/api/health');
  }
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.MASHUBApi = MASHUBApi;
}

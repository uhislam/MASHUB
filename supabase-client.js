// Supabase Client Initialization
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Initialize Supabase client
        const SUPABASE_URL = 'https://ocjtsdxrhmikrzypfkbq.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9janRzZHhyaG1pa3J6eXBma2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYzMzkyNTIsImV4cCI6MjA4MTkxNTI1Mn0.pfJlB37YNRI_3iu76zX_FFiq_ciwVk0qOqpdSbMYVCA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Supabase Data Access Functions
export const supabaseAPI = {
  // Create a person (application stored on people)
  async createPerson(person) {
    const { data, error } = await supabase.from('people').insert([person]).select()
    if (error) throw error
    return data[0]
  },
  // Usrah operations
  async loadUsrah() {
    const { data, error } = await supabase.from('usrah').select('*')
    if (error) throw error
    return data
  },

  async getUsrahById(id) {
    const { data, error } = await supabase.from('usrah').select('*').eq('usrah_id', id).single()
    if (error) throw error
    return data
  },

  // People operations
  async loadPeople() {
    const { data, error } = await supabase.from('people').select('*')
    if (error) throw error
    return data
  },

  async getPerson(id) {
    const { data, error } = await supabase.from('people').select('*').eq('person_id', id).single()
    if (error) throw error
    return data
  },

  async updatePerson(id, updates) {
    const { data, error } = await supabase.from('people').update(updates).eq('person_id', id).select()
    if (error) throw error
    return data[0]
  },

  // Attendance operations
  async loadAttendance() {
    const { data, error } = await supabase.from('attendance').select('*')
    if (error) throw error
    return data
  },

  async getAttendanceForPerson(personId) {
    const { data, error } = await supabase.from('attendance').select('*').eq('person_id', personId)
    if (error) throw error
    return data
  },

  async submitAttendance(records) {
    const { data, error } = await supabase.from('attendance').insert(records).select()
    if (error) throw error
    return data
  },

  async updateAttendance(id, updates) {
    const { data, error } = await supabase.from('attendance').update(updates).eq('id', id).select()
    if (error) throw error
    return data[0]
  },

  // Journal operations
  async loadJournals() {
    const { data, error } = await supabase.from('journals').select('*').order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getJournalsByPerson(personId) {
    const { data, error } = await supabase.from('journals').select('*').eq('person_id', personId).order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async getJournalsByType(journalType) {
    const { data, error } = await supabase.from('journals').select('*').eq('journal_type', journalType).order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async createJournal(journal) {
    const { data, error } = await supabase.from('journals').insert([journal]).select()
    if (error) throw error
    return data[0]
  },

  async updateJournal(id, updates) {
    const { data, error } = await supabase.from('journals').update(updates).eq('id', id).select()
    if (error) throw error
    return data[0]
  },

  async deleteJournal(id) {
    const { data, error } = await supabase.from('journals').delete().eq('id', id)
    if (error) throw error
    return data
  }
}

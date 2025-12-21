// Supabase Client Initialization
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.38.0/+esm'

// Initialize Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Supabase Data Access Functions
export const supabaseAPI = {
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

  // Weeks operations
  async loadWeeks() {
    const { data, error } = await supabase.from('weeks').select('*').order('week_id', { ascending: true })
    if (error) throw error
    return data
  },

  async createWeek(week) {
    const { data, error } = await supabase.from('weeks').insert([week]).select()
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
  }
}

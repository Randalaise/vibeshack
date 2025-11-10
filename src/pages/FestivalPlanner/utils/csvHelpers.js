/**
 * CSV Export und Import Funktionen für Festival-Sessions
 */

// Location Name zu ID Mapping
const LOCATION_ID_MAP = {
  'Meetup Area': '22e95e92-0079-4228-b8da-3882be979d37',
  'Networking Area': '401573fd-ef83-4eb8-886b-d01ffaf78aa6',
  'Club Stage': '5b5dc99e-0771-474c-aea1-648499e3572e',
  'Orange Room': '5fa91d56-90e4-4c12-b469-2877af9e52ac',
  'Festival Kiosk': '638b35d8-ef30-4e96-b89e-655269c2f6f0',
  'Workshop Space': '7dec5079-b16d-4127-b0f3-86c936481f03',
  'AHA Bühne': '99f9264e-1696-4e7a-ae64-3d2cc7a53aa3',
  'Experience Area': 'a020b648-99d2-4b83-b5ca-12fc954b2e0c',
  'Yard Stage': 'b30506bf-f43c-4e68-95e9-33943ccb80fb',
  'Dome Stage': 'b38fad60-fdde-44b0-969d-31de75d8b983',
  'Forum der Zukunft': 'c82ad0ae-c18e-4fd4-8f0c-a2a3788f120e',
  'Workshop Area': 'c885c88c-dbb6-4dbd-88c6-1b30c8827f53',
  'Future Box': 'd686f8ca-be3d-4feb-a60e-03544181a262',
  'Theater Stage': 'de698305-b2f2-447e-a6f0-0090c683c684',
  'Hauptbühne': 'de698305-b2f2-447e-a6f0-0090c683c684' // Fallback
}

// Tag Nummer zu formatiertem Event Day
const DAY_MAP = {
  1: 'Do. 2. Juli',
  2: 'Fr. 3. Juli',
  3: 'Sa. 4. Juli',
  4: 'So. 5. Juli'
}

// Tag Nummer zu Datum (für ISO Format)
const DATE_MAP = {
  1: '2026-07-02',
  2: '2026-07-03',
  3: '2026-07-04',
  4: '2026-07-05'
}

/**
 * Konvertiert Zeit und Tag zu ISO 8601 Format
 * @param {string} time - Zeit im Format "HH:mm"
 * @param {number} day - Tag Nummer (1-4)
 * @returns {string} - ISO 8601 Timestamp
 */
function timeToISO(time, day) {
  const date = DATE_MAP[day] || DATE_MAP[1]
  return `${date}T${time}:00Z`
}

/**
 * Formatiert einen Wert als Array-String für CSV
 * @param {any} value - Wert zum Formatieren
 * @returns {string} - Formatierter Array-String
 */
function formatArrayValue(value) {
  if (!value) return ''
  if (Array.isArray(value)) {
    return `["${value.join('","')}"]`
  }
  return `["${value}"]`
}

/**
 * Escaped CSV-Werte (Anführungszeichen verdoppeln)
 * @param {any} value - Wert zum Escapen
 * @returns {string} - Escapeter Wert
 */
function escapeCsvValue(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

/**
 * Exportiert Sessions als CSV-Datei im korrekten Format
 * @param {Array} sessions - Array von Session-Objekten
 * @param {Array} locations - Array von Location-Objekten
 */
export function exportToCSV(sessions, locations) {
  // CSV Headers entsprechend dem Zielformat
  const headers = [
    'Name',
    'Tracks',
    'Public',
    'Jahr',
    'Needs Update',
    'Speaker Area',
    'Format',
    'Event Days',
    'Speakers',
    'Start Time',
    'End Time',
    'Description',
    'Location',
    'link-programm-2024-name',
    'link-programm-2024-1-all',
    'ID',
    'Created Date',
    'Updated Date',
    'Owner',
    'link-copy-of-programm-2024-all',
    'link-mein-programm-2024-all',
    'Partner',
    'Link',
    'Link-Text',
    'link-copy-of-programm-2024-familientage-all',
    'Programm - Dashboard',
    'Event',
    'Programm - Übersicht',
    'Programm - Session',
    'Language',
    'Dispo',
    'Kopie von Programm - Übersicht',
    'Impressions'
  ]

  const rows = sessions.map(session => {
    const location = locations.find(l => l.id === session.locationId)
    const locationId = LOCATION_ID_MAP[location?.name] || ''
    const eventDay = DAY_MAP[session.day] || 'Do. 2. Juli'
    
    return [
      session.title || '',                                    // Name
      formatArrayValue(session.tracks),                       // Tracks
      'FALSE',                                                 // Public
      '2026',                                                  // Jahr
      '',                                                      // Needs Update
      '',                                                      // Speaker Area
      formatArrayValue(session.format),                       // Format
      formatArrayValue(eventDay),                             // Event Days
      formatArrayValue(session.speakers),                     // Speakers
      timeToISO(session.startTime, session.day),             // Start Time
      timeToISO(session.endTime, session.day),               // End Time
      session.description || '',                              // Description
      locationId,                                             // Location (UUID)
      '',                                                      // link-programm-2024-name
      '',                                                      // link-programm-2024-1-all
      '',                                                      // ID (leer, wird beim Import generiert)
      '',                                                      // Created Date
      '',                                                      // Updated Date
      '',                                                      // Owner
      '',                                                      // link-copy-of-programm-2024-all
      '',                                                      // link-mein-programm-2024-all
      '',                                                      // Partner
      '',                                                      // Link
      '',                                                      // Link-Text
      '',                                                      // link-copy-of-programm-2024-familientage-all
      '/festival-der-zukunft/programm-dashboard',            // Programm - Dashboard
      '["Festival der Zukunft 2026"]',                       // Event
      '/festival-der-zukunft/programm/2026',                 // Programm - Übersicht
      '',                                                      // Programm - Session
      formatArrayValue(session.language || 'DE'),            // Language
      '',                                                      // Dispo
      '/copy-of-festival-der-zukunft/programm/2026',         // Kopie von Programm - Übersicht
      ''                                                       // Impressions
    ]
  })

  // CSV-Inhalt erstellen
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => escapeCsvValue(cell)).join(','))
  ].join('\n')

  // Download
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `festival-programm-2026-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
}

/**
 * Importiert Sessions aus CSV-Text
 * @param {string} csvText - CSV-Inhalt als String
 * @param {Array} locations - Array von verfügbaren Locations
 * @returns {Array} - Array von importierten Session-Objekten
 */
export function importFromCSV(csvText, locations) {
  const lines = csvText.split('\n')
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  const sessions = []

  // Reverse Location ID Map für Import
  const ID_TO_LOCATION = {}
  Object.entries(LOCATION_ID_MAP).forEach(([name, id]) => {
    ID_TO_LOCATION[id] = name
  })

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue

    // CSV Parser mit Quote-Handling
    const values = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || []
    const row = values.map(v => v.replace(/^"|"$/g, '').replace(/""/g, '"').trim())

    if (row.length < 3) continue

    const nameIdx = headers.findIndex(h => h.toLowerCase().includes('name'))
    const startIdx = headers.findIndex(h => h.toLowerCase().includes('start'))
    const endIdx = headers.findIndex(h => h.toLowerCase().includes('end'))
    const locationIdx = headers.findIndex(h => h.toLowerCase().includes('location'))
    const eventDayIdx = headers.findIndex(h => h.toLowerCase().includes('event day'))
    const descIdx = headers.findIndex(h => h.toLowerCase().includes('description'))
    const formatIdx = headers.findIndex(h => h.toLowerCase().includes('format'))

    // Location ID zu Location Object
    const locationId = row[locationIdx] || ''
    const locationName = ID_TO_LOCATION[locationId] || ''
    const location = locations.find(l => l.name === locationName) || locations[0]

    // Event Day zu Tag Nummer konvertieren
    const eventDay = row[eventDayIdx] || ''
    let day = 1
    if (eventDay.includes('Fr.') || eventDay.includes('3.')) day = 2
    else if (eventDay.includes('Sa.') || eventDay.includes('4.')) day = 3
    else if (eventDay.includes('So.') || eventDay.includes('5.')) day = 4

    // Zeit aus ISO Format extrahieren
    const startTime = row[startIdx]?.includes('T') 
      ? row[startIdx].substring(11, 16) 
      : row[startIdx] || '10:00'
    const endTime = row[endIdx]?.includes('T') 
      ? row[endIdx].substring(11, 16) 
      : row[endIdx] || '11:00'

    // Array-Werte parsen
    const parseArrayValue = (val) => {
      if (!val) return ''
      const match = val.match(/\["(.+)"\]/)
      return match ? match[1] : val
    }

    sessions.push({
      id: `session-${Date.now()}-${i}`,
      title: row[nameIdx] || `Session ${i}`,
      startTime,
      endTime,
      locationId: location?.id,
      day,
      description: row[descIdx] || '',
      format: parseArrayValue(row[formatIdx]),
      speakers: '',
      language: 'DE',
      tracks: ''
    })
  }

  return sessions
}

/**
 * Zeit-Hilfsfunktionen für Zeit-Berechnungen
 * Wiederverwendbar in FestivalPlanner, MeditationTimer, etc.
 */

/**
 * Konvertiert Zeit-String (HH:MM) zu Minuten seit Mitternacht
 * @param {string} time - Zeit im Format "HH:MM" (z.B. "10:30")
 * @returns {number} - Minuten seit Mitternacht (z.B. 630)
 *
 * @example
 * timeToMinutes("10:30") // returns 630
 * timeToMinutes("00:00") // returns 0
 */
export function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

/**
 * Konvertiert Minuten seit Mitternacht zu Zeit-String
 * @param {number} minutes - Minuten seit Mitternacht
 * @returns {string} - Zeit im Format "HH:MM"
 *
 * @example
 * minutesToTime(630) // returns "10:30"
 * minutesToTime(0) // returns "00:00"
 */
export function minutesToTime(minutes) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Berechnet die Dauer in Minuten zwischen zwei Zeitpunkten
 * @param {string} startTime - Startzeit im Format "HH:MM"
 * @param {string} endTime - Endzeit im Format "HH:MM"
 * @returns {number} - Dauer in Minuten
 *
 * @example
 * calculateDurationInMinutes("10:00", "11:30") // returns 90
 */
export function calculateDurationInMinutes(startTime, endTime) {
  if (!startTime || !endTime) return 60 // Fallback: 60 Minuten
  return timeToMinutes(endTime) - timeToMinutes(startTime)
}

/**
 * Addiert Minuten zu einer Zeitangabe
 * @param {string} time - Zeit im Format "HH:MM"
 * @param {number} minutes - Anzahl der zu addierenden Minuten
 * @returns {string} - Neue Zeit im Format "HH:MM"
 *
 * @example
 * addMinutes("10:30", 45) // returns "11:15"
 * addMinutes("23:30", 60) // returns "00:30" (nächster Tag)
 */
export function addMinutes(time, minutes) {
  const totalMinutes = timeToMinutes(time) + minutes
  const hours = Math.floor(totalMinutes / 60) % 24
  const mins = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

/**
 * Formatiert Sekunden als MM:SS String für Timer-Displays
 * @param {number} seconds - Anzahl Sekunden
 * @returns {string} - Formatierte Zeit als "MM:SS"
 *
 * @example
 * formatTime(90) // returns "01:30"
 * formatTime(3665) // returns "61:05"
 */
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

/**
 * Generiert ein Array von Zeitslots mit gegebenem Intervall
 * @param {number} intervalMinutes - Intervall in Minuten (z.B. 30, 60)
 * @param {string} startTime - Startzeit im Format "HH:MM" (Standard: "09:00")
 * @param {string} endTime - Endzeit im Format "HH:MM" (Standard: "23:00")
 * @returns {string[]} - Array von Zeit-Strings im Format "HH:MM"
 *
 * @example
 * generateTimeSlots(30) // returns ["09:00", "09:30", "10:00", ..., "23:00"]
 * generateTimeSlots(60, "08:00", "20:00") // returns ["08:00", "09:00", ..., "20:00"]
 */
export function generateTimeSlots(intervalMinutes = 30, startTime = '09:00', endTime = '23:00') {
  const slots = []
  const startMinutes = timeToMinutes(startTime)
  const endMinutes = timeToMinutes(endTime)
  
  for (let minutes = startMinutes; minutes <= endMinutes; minutes += intervalMinutes) {
    slots.push(minutesToTime(minutes))
  }
  
  return slots
}

/**
 * Berechnet Endzeit aus Startzeit und Dauer
 * @param {string} startTime - Startzeit im Format "HH:MM"
 * @param {number} durationMinutes - Dauer in Minuten
 * @returns {string} - Endzeit im Format "HH:MM"
 *
 * @example
 * calculateEndTime("10:00", 90) // returns "11:30"
 */
export function calculateEndTime(startTime, durationMinutes) {
  return addMinutes(startTime, durationMinutes)
}

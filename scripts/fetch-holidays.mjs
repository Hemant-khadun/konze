import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import HolidaysModule from 'date-holidays'

const Holidays = HolidaysModule.default || HolidaysModule

const __filename = fileURLToPath(import.meta.url)
const repoRoot = resolve(dirname(__filename), '..')

const COUNTRIES = [
  { slug: 'mu', code: 'MU', label: 'Mauritius' },
  { slug: 'fr', code: 'FR', label: 'France' },
  { slug: 'sa', code: 'ZA', label: 'South Africa' },
]

const YEARS_AHEAD = 3
const YEARS_BEHIND = 1

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

function formatDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildYearEntries(client, year) {
  const rawHolidays = client.getHolidays(year) || []
  const seen = new Set()
  const entries = []

  rawHolidays.forEach(holiday => {
    if (!holiday || holiday.type !== 'public') return

    const startDate = new Date(holiday.start)
    if (Number.isNaN(startDate.getTime())) return

    const dateKey = formatDateKey(startDate)
    const dedupKey = `${dateKey}::${holiday.name}`
    if (seen.has(dedupKey)) return

    seen.add(dedupKey)
    entries.push({
      name: holiday.name,
      date: dateKey,
      day: WEEKDAY_NAMES[startDate.getDay()],
    })
  })

  entries.sort((left, right) => (left.date < right.date ? -1 : left.date > right.date ? 1 : 0))

  return entries
}

async function buildCountry(country, years) {
  const client = new Holidays(country.code)
  const yearsPayload = {}

  years.forEach(year => {
    yearsPayload[String(year)] = buildYearEntries(client, year)
  })

  const output = {
    country: country.label,
    years: yearsPayload,
  }

  const targetPath = resolve(repoRoot, 'api', country.slug, 'public-holidays.json')
  await mkdir(dirname(targetPath), { recursive: true })
  await writeFile(targetPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
}

async function main() {
  const baseYear = new Date().getFullYear()
  const years = []

  for (let offset = -YEARS_BEHIND; offset <= YEARS_AHEAD; offset++) {
    years.push(baseYear + offset)
  }

  for (const country of COUNTRIES) {
    await buildCountry(country, years)
  }
}

main().catch(error => {
  console.error('Failed to generate holiday data:', error)
  process.exit(1)
})
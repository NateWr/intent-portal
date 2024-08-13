import fs from 'fs'
import { google } from 'googleapis'
import { spreadsheetId, getCredentials } from './helpers/google.js'

const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
const auth = getCredentials(scopes)
const sheets = google.sheets({
  version: 'v4',
  auth: auth
})

const sheet = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: `A1:AH9999`
})

const getCol = (col) => {
  const i = columns.findIndex((c) => c === col)
  if (i < 0) {
    throw new Error(`Unable to find ${col}`)
  }
  return i
}

const rows = sheet?.data?.values ?? []
const columns = rows.slice(0, 1).flat()
const statements = rows.slice(1)
  .filter(row => row[getCol('Details') || row[getCol('Author')]])
  .map((statement, i) => {
    return {
      id: i,
      date: statement[getCol('Date')] ?? '',
      person: statement[getCol('Author')] ?? '',
      position: statement[getCol('Position')] ?? '',
      sector: statement[getCol('Sector')] ?? '',
      details: statement[getCol('Details')] ?? '',
      themes: statement[getCol('Themes')]?.split(',')?.map((theme) => theme.trim()) ?? [],
      permalink: statement[getCol('Permalink')] ?? '',
      sources: [
        statement[getCol('Source')] ?? '',
        statement[getCol('Link 2')] ?? '',
        statement[getCol('Link 3')] ?? '',
        statement[getCol('Link 4')] ?? ''
      ].filter((s) => s)
    }
  }
)

try {
  fs.writeFileSync('./public/statements.json', JSON.stringify(statements, null, 2))
} catch (err) {
  throw new Error(err)
}

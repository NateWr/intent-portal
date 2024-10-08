import fs from 'fs'
import slugify from '@sindresorhus/slugify'
import { parse } from 'csv-parse/sync'
import 'dotenv/config'

const spreadsheetId = process.env.SPREADSHEET_ID
const sheetName = 'Data'
const url = 'https://docs.google.com/spreadsheets/d/{{ID}}/gviz/tq?tqx=out:csv&sheet={{sheet_name}}'
  .replace('{{ID}}', spreadsheetId)
  .replace('{{sheet_name}}', sheetName)

const rows = await fetch(url)
  .then(r => r.text())
  .then(csv => parse(csv, {columns: true, skip_empty_lines: true}))
  .catch(err => {
    throw new Error(`Unable to fetch spreadsheet data: ${err}`)
  })

const REGEX_DOMAIN = /^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)/gi

const statements = rows.slice(1)
  .filter(row => row['Details' || row['Author']])
  .map((statement, i) => {
    return {
      id: i,
      date: statement['Date'] ?? '',
      person: statement['Author'] ?? '',
      position: statement['Position'] ?? '',
      sector: slugify(statement['Sector'] ?? ''),
      details: statement['Details'] ?? '',
      notes: statement["Context (Writer's notes)"] ?? '',
      themes: statement['Themes']?.split(',')?.map((theme) => slugify(theme)) ?? [],
      permalink: statement['Permalink'] ?? '',
      sources: [
          statement['Source'] ?? '',
          statement['Link 2'] ?? '',
          statement['Link 3'] ?? '',
          statement['Link 4'] ?? ''
        ]
        .filter((s) => s)
        .map(url => {
          const matches = [...url.matchAll(REGEX_DOMAIN)]
          return {
            url,
            domain: matches[0]?.length
              ? matches[0][1] ?? matches[0][0] ?? ''
              : ''
          }
        })
    }
  }
)

try {
  fs.writeFileSync('./public/statements.json', JSON.stringify(statements))
} catch (err) {
  throw new Error(err)
}

import fs from 'fs'
import { google } from'googleapis'
import { toHast } from'@googleworkspace/google-docs-hast'
import { unified } from'unified'
import rehypeStringify from'rehype-stringify'
import { aboutDocId, getCredentials } from './helpers/google.js'

const scopes = ['https://www.googleapis.com/auth/documents.readonly']
const auth = getCredentials(scopes)
const docs = google.docs({
  version: 'v1',
  auth
});

/**
 * Remove unwanted properties from elements
 *
 * Works on a Google doc element structured in HAST
 */
const cleanEl = (el) => {
  if (el.children) {
    el.children = el.children.map(cleanEl)
  }
  if (el.properties) {
    if (el.properties.id) {
      delete el.properties.id
    }
    if (el.properties.style) {
      delete el.properties.style
    }
  }
  return el
}

const doc = await docs.documents
  .get({documentId: aboutDocId})
  .then(doc => {
    const tree = toHast(doc.data)
    tree.children = tree.children.map(cleanEl)
    const html = unified()
      .use(rehypeStringify, {collapseEmptyAttributes: true})
      .stringify(tree)
      // Remove empty paragraphs
      .replace(/<p\sclass="normal-text"><\/p>/g, '')

    return html
  })

try {
  fs.writeFileSync('./src/html/about.html', doc)
} catch (err) {
  throw new Error(err)
}

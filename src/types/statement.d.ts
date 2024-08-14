export type Statement = {
  id: number,
  date: string,
  dateFormatted: string,
  dateNumber: number,
  person: string,
  position: string,
  sector: string,
  details: string,
  themes: string[],
  permalink: string,
  sources: Object<{url: string, domain: string}>[],
}
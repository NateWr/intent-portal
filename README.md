# Intent

A research portal for Law for Palestine's database of Israeli incitement to genocide.

## Usage

This is a static site built with [Astro](https://astro.build/), [Vue](https://vuejs.org/), and [Node](https://nodejs.org). Run the following steps after you have cloned the repository.

Copy the `.env.example` file to `.env` and enter the details.

```
GOOGLE_SERVICE_ACCOUNT="eyJ0e...29tIn0="
SPREADSHEET_ID="1uI_xGjJoCHi...YxcRwE_Q"
ABOUT_DOC_ID="2oA_jOchIXg...YxcRwE_Q"
```

Get the data.

```
npm run get-data
```

Run the site locally.

```
npm run dev
```

Build the site for production.

```
npm run build
```

## Localization

All UI strings are stored in `./src/i18n/en.md` to be translated in the future.

# GDM CMS Add – WeWeb Component

Form component to add new CMS items. Emits `onSubmit` with form data for a WeWeb workflow → Supabase insert.

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Serve (local dev)

```bash
npm run serve -- --port=8080
```

In WeWeb: Developer popup → Add custom element → `http://localhost:8080`

## Bindings

- `clientsData` – list of clients for dropdown
- `projectsData` – list of projects for dropdown
- Form fields: type, subtype, title, slug, shortDescription, content, imagelink, supportDue, supportStatus, supportTicket, projectIdRef

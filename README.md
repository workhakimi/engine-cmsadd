# GDM CMS Add – WeWeb Component

Form component to add new CMS items. Emits `onSubmit` with form data for a WeWeb workflow → Supabase insert.

## Install

```bash
npm install
```

## Local development (component must load in editor)

**Important:** Local components only work in the **Dev Editor**, not the regular editor.

1. Start the dev server:
   ```bash
   npm run serve
   ```
   (Uses port 8080 by default. For another port: `npm run serve -- port=4040`)

2. Authorize the SSL certificate: open **https://localhost:8080** in your browser and accept the certificate.

3. In WeWeb Dashboard → your project → **Dev** tab → **Open Dev Editor**.

4. In the Dev tab → select **Element** → **Add local Element** → enter port **8080**.

5. Drag the component from the Add panel onto the canvas.

See **[LOADING-GUIDE.md](./LOADING-GUIDE.md)** for full troubleshooting.

## Build

```bash
npm run build
```

## Bindings

- `clientsData` – list of clients for dropdown
- `projectsData` – list of projects for dropdown
- Form fields: type, subtype, title, slug, shortDescription, content, imagelink, supportDue, supportStatus, supportTicket, projectIdRef

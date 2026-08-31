This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load the site's fonts.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Build

To generate the production build:

```bash
npm run build
npm run start
```

## Deploy on Vercel

Before deploying the CMS:

1. Create a **public** Vercel Blob store connected to the project. The store is used for the editable JSON and public site images.
2. Add the Blob token to the Vercel project's Production environment. The CMS accepts both `BLOB_READ_WRITE_TOKEN` and the integration names `BLOB_READ_WRITE_TOKEN_READ_WRITE_TOKEN` / `BLOB_READ_WRITE_TOKEN_STORE_ID`.
3. Add `CMS_SESSION_SECRET` with a random value of at least 32 characters.
4. Redeploy after changing environment variables.

The CMS uses the local JSON and `public/uploads` only during development. In production, content and new images are stored in Vercel Blob because a Vercel Function cannot persist writes to the deployed filesystem.

Atualização de deploy: 31/08/2026.

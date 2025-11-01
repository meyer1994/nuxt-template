# focas

## Development

```bash
pnpm install
cp -v .env.example .env
pnpm run db:reset  # resets and seeds the database defaults to ./data/db.sqlite
pnpm run dev
```

## Production

```bash
pnpm build
```

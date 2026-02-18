# wopr-plugin-router

Message routing middleware for WOPR — routes messages between bots, channels, and providers.

## Commands

```bash
npm run build     # tsc
npm run check     # biome check + tsc --noEmit (run before committing)
npm run format    # biome format --write src/
npm test          # vitest run
```

## Architecture

```
src/
  index.ts  # Plugin entry — routing rule engine
  ui.ts     # WebUI panel for routing rules (if wopr-plugin-webui is installed)
```

## Key Details

- Intercepts messages before they reach the LLM — applies routing rules
- Routing rules: match on channel, sender, content pattern → route to different bot/provider/handler
- `ui.ts` registers a UI panel — only active if `wopr-plugin-webui` is also installed
- Use cases: multi-bot setups, A/B testing providers, keyword routing to specialized bots
- Plugin contract: imports only from `@wopr-network/plugin-types`

## Issue Tracking

All issues in **Linear** (team: WOPR). Issue descriptions start with `**Repo:** wopr-network/wopr-plugin-router`.

# wopr-plugin-router

Message routing middleware for WOPR — routes messages between bots, channels, and providers.

## Commands

```bash
npm run build     # tsc + esbuild bundle for ui.ts
npm run build:ui  # esbuild bundle for src/ui.ts only
npm run dev       # tsc --watch
npm run clean     # rm -rf dist
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

## Session Memory

At the start of every WOPR session, **read `~/.wopr-memory.md` if it exists.** It contains recent session context: which repos were active, what branches are in flight, and how many uncommitted changes exist. Use it to orient quickly without re-investigating.

The `Stop` hook writes to this file automatically at session end. Only non-main branches are recorded — if everything is on `main`, nothing is written for that repo.
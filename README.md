# WOPR Router Plugin (Example)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WOPR](https://img.shields.io/badge/WOPR-Plugin-blue)](https://github.com/TSavo/wopr)

Example plugin for [WOPR](https://github.com/TSavo/wopr) showing how to build middleware that routes messages between channels and sessions.

> Part of the [WOPR](https://github.com/TSavo/wopr) ecosystem - Self-sovereign AI session management over P2P.

## Config

Configure routes in the plugin config (stored at `plugins.data.router`):

```json
{
  "routes": [
    {
      "sourceSession": "support",
      "targetSessions": ["billing", "engineering"],
      "channelType": "discord"
    }
  ],
  "outgoingRoutes": [
    {
      "sourceSession": "support",
      "channelType": "discord"
    }
  ]
}
```

### CLI

```bash
wopr config set plugins.data.router '{"routes":[{"sourceSession":"support","targetSessions":["billing","engineering"],"channelType":"discord"}],"outgoingRoutes":[{"sourceSession":"support","channelType":"discord"}]}'
```

### API

```bash
curl -X PUT http://localhost:7437/config/plugins.data.router \
  -H "Content-Type: application/json" \
  -d '{"routes":[{"sourceSession":"support","targetSessions":["billing","engineering"],"channelType":"discord"}],"outgoingRoutes":[{"sourceSession":"support","channelType":"discord"}]}'
```

## Behavior

- Incoming routes fan out messages to additional sessions.
- Outgoing routes forward responses to matching channels.

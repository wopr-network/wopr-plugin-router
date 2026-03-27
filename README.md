# ⚠️ This package has moved

This package is now maintained in the [wopr-plugins monorepo](https://github.com/wopr-network/wopr-plugins/tree/main/packages/plugin-router).

This repository is archived and no longer accepts contributions.

---

# WOPR Router Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![WOPR](https://img.shields.io/badge/WOPR-Plugin-blue)](https://github.com/TSavo/wopr)

A middleware plugin for [WOPR](https://github.com/TSavo/wopr) that routes messages between channels and sessions. Fan out incoming messages to multiple sessions or forward outgoing responses to specific channels.

> Part of the [WOPR](https://github.com/TSavo/wopr) ecosystem - Self-sovereign AI session management over P2P.

## Features

- **Incoming Routes**: Fan out messages from one session to multiple target sessions
- **Outgoing Routes**: Forward responses to specific channel types or IDs
- **Web UI**: Built-in configuration panel integrated into WOPR settings
- **Hot Reload**: Configuration changes apply immediately without restart

## Installation

Place the plugin in your WOPR plugins directory or install via npm:

```bash
npm install wopr-plugin-router
```

The plugin exports an ES module with the following interface:

```javascript
export default {
  name: "router",
  version: "0.1.0",
  description: "Example routing middleware between channels and sessions",
  init(pluginContext),
  shutdown()
}
```

## Configuration

### Plugin Configuration

Configure routes in the plugin config (stored at `plugins.data.router`):

```json
{
  "uiPort": 7333,
  "routes": [
    {
      "sourceSession": "support",
      "targetSessions": ["billing", "engineering"],
      "channelType": "discord",
      "channelId": "123456789"
    }
  ],
  "outgoingRoutes": [
    {
      "sourceSession": "support",
      "channelType": "discord",
      "channelId": "123456789"
    }
  ]
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `uiPort` | number | `7333` | Port for the plugin's web UI server |
| `routes` | array | `[]` | Incoming message routing rules |
| `outgoingRoutes` | array | `[]` | Outgoing response routing rules |

### Route Fields

**Incoming Routes (`routes`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceSession` | string | No | Match messages from this session |
| `targetSessions` | array | Yes | Forward messages to these sessions |
| `channelType` | string | No | Match only this channel type (e.g., "discord", "slack") |
| `channelId` | string | No | Match only this specific channel ID |

**Outgoing Routes (`outgoingRoutes`):**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sourceSession` | string | No | Match responses from this session |
| `channelType` | string | No | Forward only to channels of this type |
| `channelId` | string | No | Forward only to this specific channel ID |

### CLI Configuration

```bash
wopr config set plugins.data.router '{
  "uiPort": 7333,
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
}'
```

### API Configuration

```bash
curl -X PUT http://localhost:7437/config/plugins.data.router \
  -H "Content-Type: application/json" \
  -d '{
    "uiPort": 7333,
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
  }'
```

## Web UI

The plugin includes a web-based configuration panel that integrates into WOPR's settings interface.

- **URL**: `http://127.0.0.1:7333` (or configured `uiPort`)
- **Location**: Appears in WOPR settings under "Message Router"
- **Features**: Add/delete routing rules, view current configuration

The UI component is built with SolidJS signals for reactive updates.

## Behavior

### Incoming Message Flow

1. Message arrives at a session via a channel
2. Plugin checks all `routes` for matches
3. For each matching route, message is injected into `targetSessions`
4. Original message continues to the source session normally

**Match Logic**: A route matches if ALL specified fields match:
- `sourceSession` matches the message's session (if specified)
- `channelType` matches the channel's type (if specified)
- `channelId` matches the channel's ID (if specified)

### Outgoing Response Flow

1. Session generates a response
2. Plugin checks all `outgoingRoutes` for matches
3. For each matching route, response is sent to channels connected to that session
4. Channel filtering applies: only channels matching `channelType` and/or `channelId` receive the response

## Plugin Context API

The plugin uses the following WOPR plugin context methods:

| Method | Description |
|--------|-------------|
| `ctx.getPluginDir()` | Get the plugin's directory path |
| `ctx.getConfig()` | Get the plugin's current configuration |
| `ctx.log.info(msg)` | Log informational messages |
| `ctx.registerMiddleware(config)` | Register incoming/outgoing middleware |
| `ctx.registerUiComponent(config)` | Register a UI component in WOPR |
| `ctx.inject(session, message)` | Inject a message into a session |
| `ctx.getChannelsForSession(session)` | Get all channel adapters for a session |

## Examples

### Support Ticket Routing

Route customer support messages to both billing and engineering teams:

```json
{
  "routes": [
    {
      "sourceSession": "support",
      "targetSessions": ["billing", "engineering"],
      "channelType": "discord"
    }
  ]
}
```

### Channel-Specific Routing

Route messages from a specific Discord channel to multiple sessions:

```json
{
  "routes": [
    {
      "channelId": "1234567890",
      "targetSessions": ["alerts", "logs", "monitoring"]
    }
  ]
}
```

### Broadcast Responses

Send all responses from a session to all connected Discord channels:

```json
{
  "outgoingRoutes": [
    {
      "sourceSession": "announcements",
      "channelType": "discord"
    }
  ]
}
```

## Requirements

- WOPR >= 1.0.0
- Node.js (ES modules support)

## License

MIT
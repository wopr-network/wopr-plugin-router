/**
 * WOPR Router Plugin
 *
 * Middleware-driven routing between channels and sessions.
 */
import http from "http";
import { createReadStream } from "fs";
import { extname, join } from "path";
const CONTENT_TYPES = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".html": "text/html",
};
let ctx = null;
let uiServer = null;
function startUIServer(port = 7333) {
    const server = http.createServer((req, res) => {
        const url = req.url === "/" ? "/ui.js" : req.url || "/ui.js";
        const filePath = join(ctx.getPluginDir(), url);
        const ext = extname(filePath).toLowerCase();
        res.setHeader("Content-Type", CONTENT_TYPES[ext] || "application/octet-stream");
        res.setHeader("Access-Control-Allow-Origin", "*");
        try {
            const stream = createReadStream(filePath);
            stream.pipe(res);
            stream.on("error", () => {
                res.statusCode = 404;
                res.end("Not found");
            });
        }
        catch {
            res.statusCode = 500;
            res.end("Error");
        }
    });
    server.listen(port, "127.0.0.1", () => {
        ctx?.log.info(`Router UI available at http://127.0.0.1:${port}`);
    });
    return server;
}
function matchesRoute(route, input) {
    if (route.sourceSession && route.sourceSession !== input.session)
        return false;
    if (route.channelType && route.channelType !== input.channel?.type)
        return false;
    if (route.channelId && route.channelId !== input.channel?.id)
        return false;
    return true;
}
async function fanOutToSessions(route, input) {
    const targets = route.targetSessions || [];
    for (const target of targets) {
        if (!target || target === input.session)
            continue;
        await ctx.inject(target, input.message);
    }
}
async function fanOutToChannels(route, output) {
    const channels = ctx.getChannelsForSession(output.session);
    for (const adapter of channels) {
        if (route.channelType && adapter.channel.type !== route.channelType)
            continue;
        if (route.channelId && adapter.channel.id !== route.channelId)
            continue;
        await adapter.send(output.response);
    }
}
export default {
    name: "router",
    version: "0.2.0",
    description: "Message routing middleware between channels and sessions",
    async init(pluginContext) {
        ctx = pluginContext;
        const config = ctx.getConfig();
        const uiPort = config.uiPort || 7333;
        uiServer = startUIServer(uiPort);
        if (ctx.registerUiComponent) {
            ctx.registerUiComponent({
                id: "router-panel",
                title: "Message Router",
                moduleUrl: `http://127.0.0.1:${uiPort}/ui.js`,
                slot: "settings",
                description: "Configure message routing between sessions",
            });
            ctx.log.info("Registered Router UI component in WOPR settings");
        }
        ctx.registerMiddleware({
            name: "router",
            async onIncoming(input) {
                const config = ctx.getConfig();
                const routes = config.routes || [];
                for (const route of routes) {
                    if (!matchesRoute(route, input))
                        continue;
                    await fanOutToSessions(route, input);
                }
                return input.message;
            },
            async onOutgoing(output) {
                const config = ctx.getConfig();
                const routes = config.outgoingRoutes || [];
                for (const route of routes) {
                    if (route.sourceSession && route.sourceSession !== output.session)
                        continue;
                    await fanOutToChannels(route, output);
                }
                return output.response;
            },
        });
    },
    async shutdown() {
        if (uiServer) {
            ctx?.log.info("Router UI server shutting down...");
            await new Promise((resolve) => uiServer.close(() => resolve()));
            uiServer = null;
        }
    },
};

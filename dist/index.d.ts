/**
 * WOPR Router Plugin
 *
 * Middleware-driven routing between channels and sessions.
 */
interface Route {
    sourceSession?: string;
    targetSessions?: string[];
    channelType?: string;
    channelId?: string;
}
interface OutgoingRoute {
    sourceSession?: string;
    channelType?: string;
    channelId?: string;
}
interface RouterConfig {
    uiPort?: number;
    routes?: Route[];
    outgoingRoutes?: OutgoingRoute[];
}
interface Channel {
    type: string;
    id: string;
}
interface ChannelAdapter {
    channel: Channel;
    send(message: string): Promise<void>;
}
interface IncomingInput {
    session: string;
    channel?: Channel;
    message: string;
}
interface OutgoingOutput {
    session: string;
    response: string;
}
interface Logger {
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}
interface UiComponentConfig {
    id: string;
    title: string;
    moduleUrl: string;
    slot: string;
    description: string;
}
interface PluginContext {
    log: Logger;
    getConfig(): RouterConfig;
    getPluginDir(): string;
    inject(session: string, message: string): Promise<void>;
    getChannelsForSession(session: string): ChannelAdapter[];
    registerMiddleware(middleware: {
        name: string;
        onIncoming?(input: IncomingInput): Promise<string>;
        onOutgoing?(output: OutgoingOutput): Promise<string>;
    }): void;
    registerUiComponent?(config: UiComponentConfig): void;
}
declare const _default: {
    name: string;
    version: string;
    description: string;
    init(pluginContext: PluginContext): Promise<void>;
    shutdown(): Promise<void>;
};
export default _default;

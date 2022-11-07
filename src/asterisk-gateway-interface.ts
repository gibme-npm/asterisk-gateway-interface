// Copyright (c) 2016-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import TCPServer, { createServer } from '@gibme/tcp-server';
import { Socket } from 'net';
import { EventEmitter } from 'events';
import Channel from './channel';
export { Channel };
export { ChannelState, DialStatus, PlaybackStatus } from './types';

/**
 * Represents an AGI server instance
 */
export default class AsteriskGatewayInterface extends EventEmitter {
    private readonly server: TCPServer = createServer();

    /**
     * Constructs a new instance of the object
     * @param port
     * @param ip
     * @param maximumListeners
     */
    constructor (
        public readonly port: number = 3000,
        public readonly ip: string = '0.0.0.0',
        maximumListeners = 20
    ) {
        super();

        this.setMaxListeners(maximumListeners);

        this.server.on('connection', (socket: Socket) => {
            const channel = new Channel(socket);

            channel.on('ready', () => this.emit('channel', channel));
        });

        this.server.on('error', error => this.emit('error', error));

        this.server.on('close', () => this.emit('close'));
    }

    /**
     * Event that is emitted when a new AGI channel has been established and is ready for interation
     * @param event
     * @param listener
     */
    public on(event: 'channel', listener: (channel: Channel) => void): this;

    /**
     * Event that is emitted when the server encounters and error
     * @param event
     * @param listener
     */
    public on(event: 'error', listener: (error: any) => void): this;

    /**
     * Event that emitted when the server is closed and stopped
     * @param event
     * @param listener
     */
    public on(event: 'close', listener: () => void): this;

    public on (event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Starts the AGI server
     */
    public async start (): Promise<void> {
        return this.server.start(this.port, this.ip);
    }

    /**
     * Stops the AGI server
     */
    public async stop (): Promise<void> {
        return this.server.stop();
    }
}

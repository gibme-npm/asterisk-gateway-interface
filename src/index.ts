// Copyright (c) 2016-2025, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import TCPServer, { createServer, Socket } from '@gibme/tcp-server';
import { EventEmitter } from 'events';
import Channel, { Driver, ContextState, ResponseArguments } from './channel';
export { Channel, Driver, ContextState, ResponseArguments };

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
     * Event that is emitted when a new AGI channel has been established and is ready for interaction
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

export { AsteriskGatewayInterface };

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

import { EventEmitter } from 'events';
import type { Socket } from '@gibme/tcp-server';
import { ResponseArguments } from './response_arguments';
export { ResponseArguments };

/**
 * The current context state
 */
export enum ContextState {
    INIT = 0,
    WAITING = 2
}

/**
 * Represents the channel driver type
 */
export enum Driver {
    DHAHDI = 'DHAHDI',
    SIP = 'SIP',
    PJSIP = 'PJSIP',
    IAX2 = 'IAX2',
    LOCAL = 'Local',
    SCCP = 'SCCP',
    OSS = 'OSS',
    MOTIF = 'Motif',
    UNKNOWN = ''
}

/**
 * Represents an AGI Channel
 */
export class Channel extends EventEmitter {
    private readonly _connection: Socket;
    private _state: ContextState;
    private _message = '';
    private _closeOnHangup = true;

    /**
     * Creates a new instance of a channel object
     * @param connection the AGI socket connection
     */
    constructor (connection: Socket) {
        super();

        this.setMaxListeners(10);

        this._connection = connection;
        this._state = ContextState.INIT;

        this._connection.on('data', (data) => this.read(data));
        this._connection.on('close', () => this.emit('close'));
        this._connection.on('error', (error) => this.emit('error', error));
        this._connection.on('timeout', () => this.emit('timeout'));
        this.on('hangup', () => {
            if (this._closeOnHangup) {
                // we need to pause a moment in case we had dialed out somewhere
                // by waiting a quick moment, we can ensure that we receive the DIALSTATUS
                // back in those cases
                setTimeout(() => this.close(), 250);
            }
        });
    }

    private _outgoingHeaders: Record<string, string> = {};

    /**
     * Headers that have been set for **outgoing** requests
     */
    public get outgoingHeaders (): Record<string, string> {
        return this._outgoingHeaders;
    }

    private _network = '';

    /**
     * Whether this AGI request is over the network
     */
    public get network (): boolean {
        return (this._network.toLowerCase() === 'yes');
    }

    private _network_script = '';

    /**
     * The network path included in the AGI request
     * e.g. agi://127.0.0.1:3000/test
     * This value would return 'test'
     */
    public get network_script (): string {
        return this._network_script;
    }

    private _request = '';

    /**
     * The filename of your script
     * ie. agi
     */
    public get request (): string {
        return this._request;
    }

    private _channel = '';

    /**
     * The originating channel (your phone)
     */
    public get channel (): string {
        return this._channel;
    }

    private _language = '';

    /**
     * The language code (e.g. “en”)
     */
    public get language (): string {
        return this._language;
    }

    private _type: Driver = Driver.UNKNOWN;

    /**
     * The originating channel type (e.g. “SIP” or “ZAP”)
     */
    public get type (): Driver {
        return this._type;
    }

    private _uniqueid = '';

    /**
     * A unique ID for the call
     */
    public get uniqueid (): string {
        return this._uniqueid;
    }

    private _version = '';

    /**
     * The version of Asterisk
     */
    public get version (): string {
        return this._version;
    }

    private _callerid = '';

    /**
     * The caller ID number (or “unknown”)
     */
    public get callerid (): string {
        return this._callerid;
    }

    private _calleridname = '';

    /**
     * The caller ID name (or “unknown”)
     */
    public get calleridname (): string {
        return this._calleridname;
    }

    private _callingpres = '';

    /**
     * The presentation for the callerid in a ZAP channel
     */
    public get callingpres (): string {
        return this._callingpres;
    }

    private _callingani2 = '';

    /**
     * The number which is defined in ANI2 see Asterisk Detailed Variable List (only for PRI Channels)
     */
    public get callingani2 (): string {
        return this._callingani2;
    }

    private _callington = '';

    /**
     *  The type of number used in PRI Channels see Asterisk Detailed Variable List
     */
    public get callington (): string {
        return this._callington;
    }

    private _callingtns = '';

    /**
     * An optional 4-digit number (Transit Network Selector) used in PRI Channels see Asterisk Detailed Variable List
     */
    public get callingtns (): string {
        return this._callingtns;
    }

    private _dnid = '';

    /**
     * The dialed number id (or “unknown”)
     */
    public get dnid (): string {
        return this._dnid;
    }

    private _rdnis = '';

    /**
     * The referring DNIS number (or “unknown”)
     */
    public get rdnis (): string {
        return this._rdnis;
    }

    private _context = '';

    /**
     * Origin context in extensions.conf
     */
    public get context (): string {
        return this._context;
    }

    private _extension = '';

    /**
     * The called number
     */
    public get extension (): string {
        return this._extension;
    }

    private _priority = '';

    /**
     * The priority it was executed as in the dial plan
     */
    public get priority (): string {
        return this._priority;
    }

    private _enhanced = '';

    /**
     * The flag value is 1.0 if started as an EAGI script, 0.0 otherwise
     */
    public get enhanced (): string {
        return this._enhanced;
    }

    private _accountcode = '';

    /**
     * Account code of the origin channel
     */
    public get accountcode (): string {
        return this._accountcode;
    }

    private _threadid = '';

    /**
     * Thread ID of the AGI script
     */
    public get threadid (): string {
        return this._threadid;
    }

    /**
     * Gets the value of the close on hangup setting
     */
    public get autoCloseOnHangup (): boolean {
        return this._closeOnHangup;
    }

    /**
     * Gets the value of the close on hangup setting
     *
     * @param value
     */
    public set autoCloseOnHangup (value: boolean) {
        this._closeOnHangup = value;
    }

    /**
     * Gets the IP address of the Asterisk Server that initiated the channel
     */
    public get remoteIP (): string {
        return this._connection.remoteAddress ?? '127.0.0.1';
    }

    /**
     * Event that is emitted when the underlying socket encounters an error
     * @param event
     * @param listener
     */
    public on(event: 'error', listener: (error: any) => void): this;

    /**
     * Event that is emitted when the underlying socket is closed
     * @param event
     * @param listener
     */
    public on(event: 'close', listener: () => void): this;

    /**
     * Event that emitted when the underlying socket times out
     * @param event
     * @param listener
     */
    public on(event: 'timeout', listener: () => void): this;

    /**
     * Event that is emitted when the channel is ready
     * @param event
     * @param listener
     */
    public on(event: 'ready', listener: () => void): this;

    /**
     * Event that is emitted when a response is received from the Asterisk server
     * @param event
     * @param listener
     */
    public on(event: 'recv', listener: (response: string) => void): this;

    /**
     * Event that emitted when the channel is hung up
     * @param event
     * @param listener
     */
    public on(event: 'hangup', listener: () => void): this;

    /**
     * Event that emitted when the response from the Asterisk server is processed into a structured response
     * @param event
     * @param listener
     */
    public on(event: 'response', listener: (response: Channel.Response) => void): this;

    /**
     * Event that is emitted when data is sent to the Asterisk server
     * @param event
     * @param listener
     */
    public on(event: 'send', listener: (data: string) => void): this;

    public on (event: any, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    /**
     * Answers channel if not already in answer state.
     */
    public async answer (): Promise<void> {
        const response = await this.sendCommand('ANSWER');

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not answer call');
        }
    }

    /**
     * Interrupts expected flow of Async AGI commands and returns control to
     * previous source (typically, the PBX dialplan).
     */
    public async break (): Promise<void> {
        const response = await this.sendCommand('ASYNCAGI BREAK');

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not interrupt processing');
        }

        return this.close();
    }

    /**
     * Returns status of the connected channel.
     * @param channel
     */
    public async channelStatus (
        channel?: string
    ): Promise<Channel.State> {
        const response = await this.sendCommand(`CHANNEL STATUS ${channel ?? ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not get channel status');
        }

        return response.result;
    }

    /**
     * Sends audio file on channel and allows the listener to control the stream.
     * @param filename
     * @param escapeDigits
     * @param skipms
     * @param fastForwardCharacter
     * @param rewindCharacter
     * @param pauseCharacter
     */
    public async controlStreamFile (
        filename: string,
        escapeDigits = '',
        skipms?: number,
        fastForwardCharacter?: string,
        rewindCharacter?: string,
        pauseCharacter?: string
    ): Promise<{ digit: string, playbackStatus: Channel.Playback.Status, playbackOffset: number }> {
        const response = await this.sendCommand(
            `CONTROL STREAM FILE ${filename} ` +
            `"${escapeDigits}" ${skipms ?? ''} ${fastForwardCharacter ?? ''} ` +
            `${rewindCharacter ?? ''} ${pauseCharacter ?? ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not control stream file');
        }

        const playbackStatus = await this.getVariable('CPLAYBACKSTATUS ');

        const playbackOffset = await this.getVariable('CPLAYBACKOFFSET ');

        let status: Channel.Playback.Status = Channel.Playback.Status.ERROR;

        switch (playbackStatus.toUpperCase()) {
            case 'SUCCESS':
                status = Channel.Playback.Status.SUCCESS;
                break;
            case 'USERSTOPPED':
                status = Channel.Playback.Status.USER_STOPPED;
                break;
            case 'REMOTESTOPPED':
                status = Channel.Playback.Status.REMOTE_STOPPED;
                break;
        }

        return {
            digit: response.arguments.char('result'),
            playbackStatus: status,
            playbackOffset: parseInt(playbackOffset, 10)
        };
    }

    /**
     * Attempts to establish a new outgoing connection on a channel, and then link it to the calling input channel.
     * @param target
     * @param options
     * @returns
     */
    public async dial (
        target: string,
        options: Partial<{
            timeout: number;
            params: string;
            hangupOnComplete: boolean;
        }> = {}
    ): Promise<{
        status: Channel.Dial.Status;
        dialed_time: number;
        answered_time: number;
        peer_name: string;
        peer_number: string;
        ring_time: number;
        progress_time: number;
    }> {
        options.timeout ??= 30;
        options.params ??= '';
        options.hangupOnComplete ??= true;

        // This is HARD blocking as the program flow will not continue until either
        // (a) the call fails; or (b) the call is hung up
        await this.exec('Dial', `${target},${options.timeout},${options.params}`);

        const dialstatus = await this.getVariable('DIALSTATUS');

        const dialed_time = parseInt(await this.getVariable('DIALEDTIME') || '0') || 0;

        const answered_time = parseInt(await this.getVariable('ANSWEREDTIME') || '0') || 0;

        const peer_name = await this.getVariable('DIALEDPEERNAME');

        const peer_number = await this.getVariable('DIALEDPEERNUMBER');

        const ring_time = parseInt(await this.getVariable('RINGTIME') || '0') || 0;

        const progress_time = parseInt(await this.getVariable('PROGRESSTIME') || '0') || 0;

        if (options.hangupOnComplete) {
            try {
                await this.hangup();
            } catch {
            }
        }

        let status: Channel.Dial.Status = Channel.Dial.Status.UNKNOWN;

        switch (dialstatus.toUpperCase()) {
            case 'ANSWER':
                status = Channel.Dial.Status.ANSWER;
                break;
            case 'BUSY':
                status = Channel.Dial.Status.BUSY;
                break;
            case 'NOANSWER':
                status = Channel.Dial.Status.NOANSWER;
                break;
            case 'CANCEL':
                status = Channel.Dial.Status.CANCEL;
                break;
            case 'CONGESTION':
                status = Channel.Dial.Status.CONGESTION;
                break;
            case 'CHANUNAVAIL':
                status = Channel.Dial.Status.CHANUNAVAIL;
                break;
            case 'DONTCALL':
                status = Channel.Dial.Status.DONTCALL;
                break;
            case 'TORTURE':
                status = Channel.Dial.Status.TORTURE;
                break;
            case 'INVALIDARGS':
                status = Channel.Dial.Status.INVALIDARGS;
                break;
        }

        return {
            status,
            dialed_time,
            answered_time,
            peer_name,
            peer_number,
            ring_time,
            progress_time
        };
    }

    /**
     * Deletes an entry in the Asterisk database for a given family and key.
     * @param family
     * @param key
     */
    public async databaseDel (
        family: string,
        key: string
    ): Promise<void> {
        const response = await this.sendCommand(`DATABASE DEL ${family} ${key}`);

        if (response.code !== 200 || response.result === 0) {
            throw new Error('Could not delete from the database');
        }
    }

    /**
     * Deletes a family or specific keytree within a family in the Asterisk database.
     * @param family
     * @param keyTree
     */
    public async databaseDelTree (
        family: string,
        keyTree?: string
    ): Promise<boolean> {
        const response = await this.sendCommand(`DATABASE DELTREE ${family} ${keyTree ?? ''}`);

        if (response.code !== 200) {
            throw new Error('Could not delete tree from database');
        }

        return (response.result === 0);
    }

    /**
     * Retrieves an entry in the Asterisk database for a given family and key.
     * @param family
     * @param key
     */
    public async databaseGet (
        family: string,
        key: string
    ): Promise<string> {
        const response = await this.sendCommand(`DATABASE GET ${family} ${key}`);

        if (response.code !== 200 || response.result === 0) {
            throw new Error('Database key not set');
        }

        return response.arguments.nokey();
    }

    /**
     * Adds or updates an entry in the Asterisk database for a given family, key, and value.
     * @param family
     * @param key
     * @param value
     */
    public async databasePut (
        family: string,
        key: string,
        value: string
    ): Promise<string> {
        const response = await this.sendCommand(`DATABASE PUT ${family} ${key} ${value}`);

        if (response.code !== 200 || response.result === 0) {
            throw new Error('Database key not set');
        }

        return response.arguments.string('value');
    }

    /**
     * Executes application with given options
     * @param application
     * @param args
     */
    public async exec (
        application: string,
        ...args: string[]
    ): Promise<number> {
        args = args.map(arg => {
            if (arg.includes(' ')) {
                arg = `"${arg}"`;
            }

            return arg;
        });

        const response = await this.sendCommand(`EXEC ${application} ${args.join(' ')}`);

        if (response.code !== 200 || response.result === -2) {
            throw new Error('Could not execute application');
        }

        return response.result;
    }

    /**
     * Stream the given file, and receive DTMF data.
     * @param soundFile
     * @param timeout
     * @param maxDigits
     */
    public async getData (
        soundFile: string,
        timeout = 5,
        maxDigits?: number
    ): Promise<{ digits: string, timeout: boolean }> {
        const response = await this.sendCommand(`GET DATA ${soundFile} ${timeout * 1000} ${maxDigits ?? ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not get data from channel');
        }

        return {
            digits: response.arguments.string('result'),
            timeout: (response.arguments.string('value') === '(timeout)')
        };
    }

    /**
     * Evaluates a channel expression
     * Understands complex variable names and builtin variables, unlike GET VARIABLE.
     * @param key
     * @param channel
     * @param keyToUpper
     */
    public async getFullVariable (
        key: string,
        channel?: string,
        keyToUpper = true
    ): Promise<string> {
        return this.getFullVariableRaw(keyToUpper ? key.toUpperCase() : key, channel);
    }

    /**
     * Stream file, prompt for DTMF, with timeout.
     * Behaves similar to STREAM FILE but used with a timeout option.
     * @param soundFile
     * @param escapeDigits
     * @param timeout
     */
    public async getOption (
        soundFile: string,
        escapeDigits = '#',
        timeout = 5
    ): Promise<{ digit: string, endpos: number }> {
        const response = await this.sendCommand(`GET OPTION ${soundFile} "${escapeDigits}" ${timeout * 1000}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not get option');
        }

        if (response.arguments.number('endpos') === 0) {
            throw new Error('Could Not play file');
        }

        return {
            digit: response.arguments.char('result'),
            endpos: response.arguments.number('endpos')
        };
    }

    /**
     * Gets a channel variable.
     * @param key
     * @param keyToUpper whether to force the key to uppercase
     */
    public async getVariable (
        key: string,
        keyToUpper = true
    ): Promise<string> {
        return this.getVariableRaw(keyToUpper ? key.toUpperCase() : key);
    }

    /**
     * Cause the channel to execute the specified dialplan subroutine.
     * @param context
     * @param extension
     * @param priority
     * @param argument
     */
    public async goSub (
        context: string,
        extension: string,
        priority: number,
        argument?: string
    ): Promise<void> {
        const response = await this.sendCommand(
            `GOSUB ${context} ${extension} ${priority} ${argument ?? ''}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not execute gosub');
        }
    }

    /**
     * Indicates busy to the calling channel
     *
     * @param timeout if specified, the calling channel will be hung up after the specified number of seconds.
     * Otherwise, this application will wait until the calling channel hangs up
     */
    public async busy (timeout?: number): Promise<number> {
        if (timeout) {
            return this.exec('Busy', timeout.toString());
        } else {
            return this.exec('Busy');
        }
    }

    /**
     * Indicates congestion to the calling channel
     *
     * @param timeout if specified, the calling channel will be hung up after the specified number of seconds.
     * Otherwise, this application will wait until the calling channel hangs up
     */
    public async congestion (timeout?: number): Promise<number> {
        if (timeout) {
            return this.exec('Congestion', timeout.toString());
        } else {
            return this.exec('Congestion');
        }
    }

    /**
     * Hangs up the specified channel. If no channel name is given, hangs up the current channel
     * @param channel
     */
    public async hangup (
        channel?: string
    ): Promise<void> {
        const response = await this.sendCommand(`HANGUP ${channel ?? ''}`);

        if (response.code !== 200 || response.result !== 1) {
            throw new Error('Could not hang up call');
        }
    }

    /**
     * Requests that in-band progress information be provided to the calling channel
     */
    public async progress (): Promise<number> {
        return this.exec('Progress');
    }

    /**
     * Requests that the channel indicate a ringing tone to the user
     */
    public async ringing (): Promise<number> {
        return this.exec('Ringing');
    }

    /**
     * Does nothing
     */
    public async noop (): Promise<void> {
        const response = await this.sendCommand('NOOP');

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not NOOP');
        }
    }

    /**
     * Receives one character from channels supporting it.
     * @param timeout
     */
    public async receiveChar (
        timeout = 5
    ): Promise<{ char: string, timeout: boolean }> {
        const response = await this.sendCommand(`RECEIVE CHAR ${timeout * 1000}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not get data from channel');
        }

        return {
            char: response.arguments.char('result'),
            timeout: response.arguments.boolean('timeout')
        };
    }

    /**
     * Receives text from channels supporting it.
     * @param timeout
     */
    public async receiveText (
        timeout = 5
    ): Promise<string> {
        const response = await this.sendCommand(`RECEIVE TEXT ${timeout * 1000}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not get data from channel');
        }

        return response.arguments.string('result');
    }

    /**
     * Records to a given file.
     * @param filename
     * @param fileFormat
     * @param escapeDigits
     * @param timeout
     * @param beep
     * @param silence
     * @param offsetSamples
     */
    public async recordFile (
        filename: string,
        fileFormat = 'gsm',
        escapeDigits = '#',
        timeout = 10,
        beep?: boolean,
        silence?: number,
        offsetSamples?: number
    ): Promise<{ digit: string, endpos: number, timeout: boolean }> {
        const response = await this.sendCommand(
            `RECORD FILE ${filename} ${fileFormat} "${escapeDigits}"` +
            `${timeout * 1000} ${offsetSamples ?? ''} ${beep ? 'BEEP' : ''}` +
            `${silence ? `s=${silence}` : ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not record file');
        }

        return {
            digit: response.arguments.char('result'),
            endpos: response.arguments.number('endpos'),
            timeout: response.arguments.boolean('timeout')
        };
    }

    /**
     * Says a given character string.
     * @param value
     * @param escapeDigits
     */
    public async sayAlpha (
        value: string,
        escapeDigits = '#'
    ): Promise<string> {
        const response = await this.sendCommand(`SAY ALPHA ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say alpha');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given date.
     * @param value
     * @param escapeDigits
     */
    public async sayDate (
        value: Date | number,
        escapeDigits = '#'
    ): Promise<string> {
        if (typeof value !== 'number') {
            value = Math.floor(value.getTime() / 1000);
        }

        const response = await this.sendCommand(
            `SAY DATE ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say date');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given time as specified by the format given.
     * @param value
     * @param escapeDigits
     * @param dateFormat
     * @param timezone
     */
    public async sayDateTime (
        value: Date | number,
        escapeDigits = '#',
        dateFormat?: string,
        timezone?: string
    ): Promise<string> {
        if (typeof value !== 'number') {
            value = Math.floor(value.getTime() / 1000);
        }

        const response = await this.sendCommand(
            `SAY DATETIME ${value} "${escapeDigits}" ${dateFormat ?? ''} ${timezone ?? ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say date time');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given digit string.
     * @param value
     * @param escapeDigits
     */
    public async sayDigits (
        value: string,
        escapeDigits = '#'
    ): Promise<string> {
        const response = await this.sendCommand(
            `SAY DIGITS ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say digits');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given number.
     * @param value
     * @param escapeDigits
     */
    public async sayNumber (
        value: number,
        escapeDigits = '#'
    ): Promise<string> {
        const response = await this.sendCommand(
            `SAY NUMBER ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say number');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given character string with phonetics.
     * @param value
     * @param escapeDigits
     */
    public async sayPhonetic (
        value: string,
        escapeDigits = '#'
    ): Promise<string> {
        const response = await this.sendCommand(
            `SAY PHONETIC ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say phonetic');
        }

        return response.arguments.char('result');
    }

    /**
     * Says a given time.
     * @param value
     * @param escapeDigits
     */
    public async sayTime (
        value: Date | number,
        escapeDigits = '#'
    ): Promise<string> {
        if (typeof value !== 'number') {
            value = Math.floor(value.getTime() / 1000);
        }

        const response = await this.sendCommand(
            `SAY TIME ${value} "${escapeDigits}"`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not say time');
        }

        return response.arguments.char('result');
    }

    /**
     * Sends images to channels supporting it.
     * @param image
     */
    public async sendImage (
        image: string
    ): Promise<void> {
        const response = await this.sendCommand(`SEND IMAGE ${image}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not send image');
        }
    }

    /**
     * Sends text to channels supporting it.
     * @param text
     */
    public async sendText (
        text: string
    ): Promise<void> {
        const response = await this.sendCommand(`SEND TEXT "${text}"`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not send text');
        }
    }

    /**
     * Autohangup channel in some time.
     * @param timeout
     */
    public async setAutoHangup (
        timeout = 60
    ): Promise<void> {
        const response = await this.sendCommand(`SET AUTOHANGUP ${timeout}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not set auto hangup');
        }
    }

    /**
     * Sets callerid for the current channel.
     * @param callerNumber
     * @param callerName
     */
    public async setCallerID (
        callerNumber: number,
        callerName?: string
    ): Promise<void> {
        const callerid = (callerName)
            ? `"${callerName}"<${callerNumber}>`
            : callerNumber;

        const response = await this.sendCommand(`SET CALLERID ${callerid}`);

        if (response.code !== 200 || response.result !== 1) {
            throw new Error('Could not set caller id');
        }
    }

    /**
     * Sets channel context.
     * @param context
     */
    public async setContext (
        context: string
    ): Promise<void> {
        const response = await this.sendCommand(`SET CONTEXT ${context}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not set context');
        }
    }

    /**
     * Changes channel extension.
     * @param extension
     */
    public async setExtension (
        extension: string
    ): Promise<void> {
        const response = await this.sendCommand(`SET EXTENSION ${extension}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not set extension');
        }
    }

    /**
     * Enable/Disable Music on hold generator
     * @param status
     * @param musicClass
     */
    public async setMusic (
        status = true,
        musicClass?: string
    ): Promise<void> {
        const response = await this.sendCommand(`SET MUSIC ${status ? 'ON' : 'OFF'} ${musicClass ?? ''}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not set priority');
        }
    }

    /**
     * Set channel dialplan priority.
     * @param priority
     */
    public async setPriority (
        priority: number
    ): Promise<void> {
        const response = await this.sendCommand(`SET PRIORITY ${priority}`);

        if (response.code !== 200 || response.result !== 0) {
            throw new Error('Could not set priority');
        }
    }

    /**
     * Set channel dialplan priority.
     * @param key
     * @param value
     */
    public async setVariable (
        key: string,
        value: string
    ): Promise<void> {
        const response = await this.sendCommand(
            `SET VARIABLE ${key.toUpperCase()} "${value}"`);

        if (response.code !== 200 || response.result !== 1) {
            throw new Error('Could not set variable');
        }
    }

    public async speechActivateGrammar (
        grammar: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH ACTIVATE GRAMMAR ${grammar}`);
    }

    public async speechCreate (
        engine: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH CREATE ENGINE ${engine}`);
    }

    public async speechDeactivateGrammar (
        grammar: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH DEACTIVATE GRAMMER ${grammar}`);
    }

    public async speechDestroy (): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand('SPEECH DESTROY');
    }

    public async speechLoadGrammar (
        grammar: string,
        path: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH LOAD GRAMMER ${grammar} ${path}`);
    }

    public async speechRecognize (
        soundFile: string,
        timeout = 5,
        offset: number
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH RECOGNIZE ${soundFile} ${timeout * 1000} ${offset}`);
    }

    public async speechSet (
        key: string,
        value: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH SET ${key} ${value}`);
    }

    public async speedUnloadGrammar (
        grammar: string
    ): Promise<Channel.Response> {
        // TODO: Handle the response
        return this.sendCommand(`SPEECH UNLOAD GRAMMAR ${grammar}`);
    }

    /**
     * Sends audio file on channel.
     * @param filename
     * @param escapeDigits
     * @param offset
     */
    public async streamFile (
        filename: string,
        escapeDigits = '#',
        offset?: number
    ): Promise<{ digit: string, endpos: number }> {
        const response = await this.sendCommand(
            `STREAM FILE ${filename} "${escapeDigits}" ${offset ?? ''}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not stream file');
        }

        const status = await this.getVariable('PLAYBACKSTATUS ');

        if (status.toUpperCase() !== 'SUCCESS') {
            throw new Error('Could not stream file');
        }

        return {
            digit: response.arguments.char('result'),
            endpos: response.arguments.number('endpos')
        };
    }

    /**
     * Toggles TDD mode (for the deaf).
     * @param status
     */
    public async tddMode (
        status: boolean
    ): Promise<void> {
        const response = await this.sendCommand(
            `TDD MODE ${status ? 'ON' : 'OFF'}`);

        if (response.code !== 200 || response.result !== 1) {
            throw new Error('Could not set TDD mode');
        }
    }

    /**
     * Logs a message to the asterisk verbose log.
     * @param message
     * @param level
     */
    public async verbose (
        message: string,
        level?: number
    ): Promise<void> {
        const response = await this.sendCommand(`VERBOSE "${message}" ${level ?? ''}`);

        if (response.code !== 200 || response.result !== 1) {
            throw new Error('Could not send logging message');
        }
    }

    /**
     * Waits for a digit to be pressed.
     * @param timeout
     */
    public async waitForDigit (
        timeout = 5
    ): Promise<string> {
        const response = await this.sendCommand(`WAIT FOR DIGIT ${timeout * 1000}`);

        if (response.code !== 200 || response.result === -1) {
            throw new Error('Could not wait for digit');
        }

        return response.arguments.char('result');
    }

    /**
     * Attempts to retrieve the inbound header specified from the channel
     *
     * Note: This method can only read headers on the **incoming** request. It can not
     * read headers set on an **outbound** SIP request.
     *
     * @param key
     */
    public async getHeader (key: string): Promise<string | undefined> {
        try {
            if (this.type === Driver.SIP) {
                return await this.getVariable(`SIP_HEADER(${key})`, false);
            } else if (this.type === Driver.PJSIP) {
                return await this.getVariable(`PJSIP_HEADER(read,${key})`, false);
            } else if (this.type === Driver.IAX2) {
                // TODO: Properly handle this result as it may contain more than one header
                return undefined;
            }
        } catch {
            return undefined;
        }
    }

    /**
     * Adds a header to the **outgoing** request
     *
     * @param key
     * @param value
     */
    public async addHeader (key: string, value: string): Promise<void> {
        await this.removeHeader(key);

        if (this.type === Driver.SIP) {
            await this.SIPAddHeader(key, value);
        } else if (this.type === Driver.PJSIP) {
            await this.PJSIPAddHeader(key, value);
        } else if (this.type === Driver.IAX2) {
            await this.IAX2AddHeader(key, value);
        }

        this._outgoingHeaders[key] = value;
    }

    /**
     * Allows you to remove a header from the **outgoing** request as long as you
     * have added it via the `addHeader()` method.
     *
     * @param key
     */
    public async removeHeader (key: string): Promise<void> {
        if (!this.outgoingHeaders[key]) {
            return;
        }

        if (this.type === Driver.SIP) {
            await this.SIPRemoveHeader(key);
        } else if (this.type === Driver.PJSIP) {
            await this.PJSIPRemoveHeader(key);
        } else if (this.type === Driver.IAX2) {
            if (key) {
                await this.IAX2RemoveHeader(key);
            }
        }

        delete this._outgoingHeaders[key];
    }

    /**
     * Evaluates a channel expression
     * Understands complex variable names and builtin variables, unlike GET VARIABLE.
     * @param key
     * @param channel
     */
    public async getFullVariableRaw (
        key: string,
        channel?: string
    ): Promise<string> {
        const response = await this.sendCommand(`GET FULL VARIABLE ${key} ${channel ?? ''}`);

        if (response.code !== 200 || response.result === 0) {
            throw new Error(`Variable not set: ${key} ${channel ? `on ${channel}` : ''}`);
        }

        return response.arguments.nokey();
    }

    /**
     * Gets a channel variable
     *
     * @param key
     * @private
     */
    public async getVariableRaw (
        key: string
    ): Promise<string> {
        const response = await this.sendCommand(`GET VARIABLE ${key}`);

        if (response.code !== 200 || response.result === 0) {
            throw new Error(`Variable not set: ${key}`);
        }

        return response.arguments.nokey();
    }

    /* Internal Methods */

    /**
     * Adds an IAX2 'header' to the outbound call
     *
     * @param key
     * @param value
     * @private
     */
    private async IAX2AddHeader (key: string, value: string): Promise<void> {
        await this.exec('Set', `CHANNEL(iax2)=${key}=${value}`);
    }

    /**
     * Removes an IAX2 'header' from the outbound call
     *
     * @param key
     * @private
     */
    private async IAX2RemoveHeader (key: string): Promise<void> {
        return this.IAX2AddHeader(key, '');
    }

    /**
     * Adds a SIP header to the outbound call
     *
     * @param key
     * @param value
     * @private
     */
    private async PJSIPAddHeader (key: string, value: string): Promise<void> {
        await this.exec('Set', `PJSIP_HEADER(add,${key})=${value}`);
    }

    /**
     * Allows you to remove headers which were previously added with PJSIPAddHeader().
     *
     * @param key
     * @private
     */
    private async PJSIPRemoveHeader (key: string): Promise<void> {
        await this.exec('Set', `PJSIP_HEADER(remove,${key})=`);
    }

    /**
     * Add a SIP header to the outbound call
     *
     * @param key
     * @param value
     */
    private async SIPAddHeader (key: string, value: string): Promise<void> {
        await this.exec('SIPAddHeader', `${key}: ${value}`);
    }

    /**
     * SIPRemoveHeader() allows you to remove headers which were previously added with SIPAddHeader().
     *
     * @param key
     */
    private async SIPRemoveHeader (key: string): Promise<void> {
        await this.exec('SIPRemoveHeader', `${key}:`);
    }

    /**
     * Closes the connection
     *
     * @private
     */
    private close () {
        this._connection.destroy();
    }

    /**
     * Reads data from the socket
     *
     * @param data
     * @private
     */
    private read (data: Buffer): void {
        if (data.length === 0) {
            return;
        }

        this._message += data.toString();

        if (this._state === ContextState.INIT) {
            if (this._message.indexOf('\n\n') === -1) {
                return;
            }

            this.readVariables(this._message);
        } else if (this._state === ContextState.WAITING) {
            if (this._message.indexOf('\n') === -1) {
                return;
            }

            this.readResponse(this._message);
        }

        this._message = '';
    }

    /**
     * Parses variables
     *
     * @param id
     * @param value
     * @private
     */
    private handleVariable (id: string, value: string) {
        switch (id) {
            case 'network':
                this._network = value;
                break;
            case 'network_script':
                this._network_script = value;
                break;
            case 'request':
                this._request = value;
                break;
            case 'channel':
                this._channel = value;
                break;
            case 'language':
                this._language = value;
                break;
            case 'type':
                this._type = value as Driver;
                break;
            case 'uniqueid':
                this._uniqueid = value;
                break;
            case 'version':
                this._version = value;
                break;
            case 'callerid':
                this._callerid = value;
                break;
            case 'calleridname':
                this._calleridname = value;
                break;
            case 'callingpres':
                this._callingpres = value;
                break;
            case 'callingani2':
                this._callingani2 = value;
                break;
            case 'callington':
                this._callington = value;
                break;
            case 'callingtns':
                this._callingtns = value;
                break;
            case 'dnid':
                this._dnid = value;
                break;
            case 'rdnis':
                this._rdnis = value;
                break;
            case 'context':
                this._context = value;
                break;
            case 'extension':
                this._extension = value;
                break;
            case 'priority':
                this._priority = value;
                break;
            case 'enhanced':
                this._enhanced = value;
                break;
            case 'accountcode':
                this._accountcode = value;
                break;
            case 'threadid':
                this._threadid = value;
                break;
            default:
        }
    }

    /**
     * Reads variables
     *
     * @param message
     * @private
     */
    private readVariables (message: string) {
        message.split('\n')
            .forEach(line => {
                const split = line.split(':');
                const name: string = (split[0] || '').trim();
                const value: string = (split[1] || '').trim();

                const id = name.substring(4);

                this.handleVariable(id, value);
            });

        this._state = ContextState.WAITING;

        this.emit('ready');
    }

    /**
     * Reads a response
     *
     * @param message
     * @private
     */
    private readResponse (message: string) {
        const lines = message.split('\n');

        lines.map((line) => this.readResponseLine(line));
    }

    /**
     * Reads a response line
     *
     * @param line
     * @private
     */
    private readResponseLine (line: string) {
        if (!line) {
            return;
        }

        this.emit('recv', line);

        const parsed = line.split(' ');

        if (!parsed || parsed[0] === 'HANGUP') {
            return this.emit('hangup');
        }

        const code = parseInt(parsed[0], 10);
        parsed.shift();

        const args: ResponseArguments = new ResponseArguments();

        for (const value of parsed) {
            if (value.indexOf('=') !== -1) {
                const parts = value.split('=', 2);
                const key = parts[0].trim();
                const val = parts[1].trim();
                args.addArgument(key, val);
            } else if (value.indexOf('(') !== -1) {
                const name = value.substring(1, value.length - 1);
                args.addArgument(name, true);
            } else {
                args.addArgument('value', value);
            }
        }

        const response: Channel.Response = {
            code,
            result: args.number('result'),
            arguments: args
        };

        this.emit('response', response);
    }

    /**
     * Writes data to the socket
     *
     * @param message
     * @private
     */
    private async send (message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.emit('send', message);

            this._connection.write(message, (error) => {
                if (error) {
                    return reject(error);
                }

                return resolve();
            });
        });
    }

    /**
     * Sends a command to the socket and awaits the response
     *
     * @param command
     * @private
     */
    private async sendCommand (command: string): Promise<Channel.Response> {
        return new Promise((resolve, reject) => {
            const handleResponse = (response: Channel.Response) => {
                this.removeListener('response', handleResponse);

                return resolve(response);
            };

            this.once('response', handleResponse);

            this.send(`${command.trim()}\n`)
                .catch(error => {
                    this.removeListener('response', handleResponse);

                    return reject(error);
                });
        });
    }
}

export namespace Channel {
    /**
     * The Current Channel State
     */
    export enum State {
        DOWN_AVAILABLE = 0,
        DOWN_RESERVED = 1,
        OFF_HOOK = 2,
        DIGITS_DIALED = 3,
        RINGING = 4,
        REMOTE_RINGING = 5,
        UP = 6,
        BUSY = 7,
    }

    export namespace Dial {
        /**
         * Represents the result of a Dial() attempt
         */
        export enum Status {
            ANSWER = 0,
            BUSY = 1,
            NOANSWER = 2,
            CANCEL = 3,
            CONGESTION = 4,
            CHANUNAVAIL = 5,
            DONTCALL = 6,
            TORTURE = 7,
            INVALIDARGS = 8,
            UNKNOWN = 9999
        }
    }

    export namespace Playback {
        /**
         * Represents the playback status
         */
        export enum Status {
            SUCCESS = 0,
            USER_STOPPED = 1,
            REMOTE_STOPPED = 2,
            ERROR = 3,
        }
    }

    /**
     * Responses a response to a channel command
     */
    export type Response = {
        code: number;
        result: number;
        arguments: ResponseArguments;
    }
}

export default Channel;

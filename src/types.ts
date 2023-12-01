// Copyright (c) 2016-2022, Brandon Lehmann <brandonlehmann@gmail.com>
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

import ResponseArguments from './response_arguments';

export { ResponseArguments };
export { IResponseArguments } from './response_arguments';

/**
 * The Current Context State
 */
export enum ContextState {
    INIT = 0,
    WAITING = 2
}

/**
 * The Current Channel State
 */
export enum ChannelState {
    DOWN_AVAILABLE = 0,
    DOWN_RESERVED,
    OFF_HOOK,
    DIGITS_DIALED,
    RINGING,
    REMOTE_RINGING,
    UP,
    BUSY,
}

/**
 * Represents the result of a Dial() attempt
 */
export enum DialStatus {
    ANSWER,
    BUSY,
    NOANSWER,
    CANCEL,
    CONGESTION,
    CHANUNAVAIL,
    DONTCALL,
    TORTURE,
    INVALIDARGS,
}

/**
 * Represents the playback status
 */
export enum PlaybackStatus {
    SUCCESS,
    USER_STOPPED,
    REMOTE_STOPPED,
    ERROR,
}

/**
 * Represents a response
 */
export interface IResponse {
    code: number;
    result: number;
    arguments: ResponseArguments;
}

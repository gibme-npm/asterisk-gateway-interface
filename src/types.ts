// Copyright (c) 2016-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

import ResponseArguments from './response_arguments';

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

/** @ignore */
export interface IResponse {
    code: number;
    result: number;
    arguments: ResponseArguments;
}

export { ResponseArguments };

// Copyright (c) 2016-2022 Brandon Lehmann
//
// Please see the included LICENSE file for more information.

export interface IResponseArguments {
    key: string;
    value: string | number | boolean;
}

/**
 * Represents a set of AGI response arguments
 * @ignore
 */
export default class ResponseArguments {
    private m_args: IResponseArguments[] = [];

    /**
     * Adds a new argument to the set
     * @param key
     * @param value
     */
    public addArgument (key: string, value: string | number | boolean) {
        this.m_args.push({ key, value });
    }

    /**
     * Retrieves the requested key as a string
     * @param key
     */
    public string (key: string): string {
        for (const arg of this.m_args) {
            if (arg.key === key) {
                return (arg.value as string);
            }
        }

        return '';
    }

    /**
     * Retrieves the requested key as a number
     * @param key
     */
    public number (key: string): number {
        for (const arg of this.m_args) {
            if (arg.key === key) {
                return parseInt((arg.value as string), 10);
            }
        }

        return 0;
    }

    /**
     * Retrieves the request key as a boolean
     * @param key
     */
    public boolean (key: string): boolean {
        for (const arg of this.m_args) {
            if (arg.key === key) {
                return (arg.value as boolean);
            }
        }

        return false;
    }

    /**
     * Retrieves the requested key from a character code
     * @param key
     */
    public char (key: string): string {
        const num = this.number(key);

        return (num !== 0) ? String.fromCharCode(num) : '';
    }

    /**
     * Retrieves the value from the arguments that has no key, if it exists
     */
    public nokey (): string {
        for (const arg of this.m_args) {
            if (arg.key !== 'result' && arg.value) {
                return arg.key;
            }
        }

        return '';
    }
}

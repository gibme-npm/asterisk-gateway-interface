// Copyright (c) 2016-2024, Brandon Lehmann <brandonlehmann@gmail.com>
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

export interface IResponseArguments {
    key: string;
    value: string | number | boolean;
}

/**
 * Represents a set of AGI response arguments
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

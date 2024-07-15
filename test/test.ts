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

// TODO: testing requires an active Asterisk server to make calls w/o shipping a "fake" server

import AsteriskGatewayInterface from '../src/asterisk-gateway-interface';

(async () => {
    const server = new AsteriskGatewayInterface();

    server.on('channel', async (channel) => {
        console.log(channel.channel, channel.type);

        await channel.addHeader('X-Touched-Call', 'Test Header');
        await channel.addHeader('X-Touched-Call', 'Test Header2');
        await channel.addHeader('X-Touched-Call-2', 'Test Header 2+');

        await channel.dial('Local/15678675309@from-internal');
    });

    await server.start();
})();

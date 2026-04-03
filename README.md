# Asterisk Gateway Interface Server

A TypeScript implementation of an [Asterisk Gateway Interface (AGI)](https://wiki.asterisk.org/wiki/pages/viewpage.action?pageId=32375589) server for building voice applications with [Asterisk](https://www.asterisk.org/).

## Requirements

- Node.js >= 22

## Installation

```bash
npm install @gibme/asterisk-gateway-interface
```

```bash
yarn add @gibme/asterisk-gateway-interface
```

## Documentation

Full API documentation is available at [https://gibme-npm.github.io/asterisk-gateway-interface/](https://gibme-npm.github.io/asterisk-gateway-interface/)

## Quick Start

```typescript
import AGI, { Channel } from '@gibme/asterisk-gateway-interface';

const agi = new AGI(3000, '0.0.0.0');

agi.on('channel', async (channel: Channel) => {
    await channel.answer();
    await channel.sayNumber(12345);
    await channel.hangup();
});

await agi.start();
```

Then configure your Asterisk dialplan to route calls to the AGI server:

```
exten => 100,1,AGI(agi://127.0.0.1:3000)
```

## Usage

### Creating a Server

```typescript
import AGI from '@gibme/asterisk-gateway-interface';

// new AGI(port, ip, maximumListeners)
const agi = new AGI(3000, '0.0.0.0', 20);

agi.on('channel', async (channel) => {
    // Handle incoming AGI channels
});

agi.on('error', (error) => {
    console.error('Server error:', error);
});

agi.on('close', () => {
    console.log('Server closed');
});

await agi.start();

// Later, to stop the server:
await agi.stop();
```

### Working with Channels

Each incoming AGI connection emits a `channel` event with a `Channel` instance that provides the full AGI command set:

#### Call Control

```typescript
agi.on('channel', async (channel) => {
    // Answer the channel
    await channel.answer();

    // Hang up when done
    await channel.hangup();
});
```

#### Playing Audio

```typescript
// Play a sound file (allow caller to interrupt with '#')
await channel.streamFile('welcome', '#');

// Play with finer control over playback position
await channel.controlStreamFile('instructions', '#', 3000, '*', '#', '#');

// Say things
await channel.sayNumber(42);
await channel.sayDigits(12345, '#');
await channel.sayAlpha('hello', '#');
await channel.sayPhonetic('world', '#');
await channel.sayDate(Math.floor(Date.now() / 1000));
await channel.sayTime(Math.floor(Date.now() / 1000));
```

#### Collecting Input

```typescript
// Get digits from the caller
const response = await channel.getData('enter-account-number', 5000, 10);

// Wait for a single digit
const digit = await channel.waitForDigit(5000);

// Get a single key during audio playback
const option = await channel.getOption('press-one-for-sales', '#', 5000);

// Receive text (for text-capable channels)
const text = await channel.receiveText(5000);
```

#### Dialing

```typescript
import { Channel, Driver } from '@gibme/asterisk-gateway-interface';

const result = await channel.dial(
    Driver.PJSIP,   // Channel driver
    '1001',          // Destination
    30,              // Timeout in seconds
    'tT'             // Dial options
);

if (result.status === Channel.Dial.Status.ANSWER) {
    console.log('Call was answered');
}
```

#### Database Operations

```typescript
// Asterisk DB operations
await channel.databasePut('family', 'key', 'value');
const value = await channel.databaseGet('family', 'key');
await channel.databaseDel('family', 'key');
await channel.databaseDelTree('family');
```

#### Channel Variables

```typescript
// Set and get channel variables
await channel.setVariable('MY_VAR', 'some_value');
const value = await channel.getVariable('MY_VAR');
const fullValue = await channel.getFullVariable('${CALLERID(num)}');
```

#### Recording

```typescript
// Record audio to a file
await channel.recordFile(
    '/tmp/recording',  // Filename (without extension)
    'wav',             // Format
    '#',               // Escape digits
    30000,             // Max duration (ms)
    undefined,         // Offset
    true,              // Beep before recording
    undefined          // Silence threshold
);
```

#### SIP/PJSIP Headers

```typescript
// Add, get, and remove SIP headers (works with SIP, PJSIP, and IAX2 channels)
await channel.addHeader('X-Custom-Header', 'my-value');
const header = await channel.getHeader('X-Custom-Header');
await channel.removeHeader('X-Custom-Header');
```

### Channel Properties

The `Channel` object exposes Asterisk AGI environment variables as properties:

```typescript
agi.on('channel', async (channel) => {
    console.log(channel.callerid);       // Caller ID number
    console.log(channel.calleridname);   // Caller ID name
    console.log(channel.callingpres);    // Calling presentation
    console.log(channel.channel);        // Channel name (e.g., "PJSIP/1000-00000001")
    console.log(channel.context);        // Dialplan context
    console.log(channel.extension);      // Dialplan extension
    console.log(channel.priority);       // Dialplan priority
    console.log(channel.uniqueid);       // Unique channel ID
    console.log(channel.accountcode);    // Account code
    console.log(channel.language);       // Channel language
    console.log(channel.channelType);    // Channel driver type (Driver enum)
    console.log(channel.network);        // Whether this is a network AGI request
    console.log(channel.network_script); // Network script path
});
```

### Exports

```typescript
import AGI, {
    AsteriskGatewayInterface, // AGI server class (same as default export)
    Channel,                  // Channel class with full AGI command set
    Driver,                   // Channel driver enum (PJSIP, SIP, IAX2, etc.)
    ContextState,             // Channel context state enum
    ResponseArguments         // Parsed AGI response arguments
} from '@gibme/asterisk-gateway-interface';
```

## License

MIT

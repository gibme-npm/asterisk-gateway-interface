# [Asterisk Gateway Interface](https://wiki.asterisk.org/wiki/pages/viewpage.action?pageId=32375589) Server

## Documentation

[https://gibme-npm.github.io/asterisk-gateway-interface/](https://gibme-npm.github.io/asterisk-gateway-interface/)

## Sample Code

```typescript
import AGI, { Channel } from '@gibme/asterisk-gateway-interface';

(async () => {
    const agi = new AGI({
        port: 3000
    });
    
    agi.on('channel', async (channel: Channel) => {
        await channel.answer();
        await channel.sayNumber(12345);
        await channel.hangup();
    });
    
    await agi.start();
})()
```

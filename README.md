# Simple [Asterisk Gateway Interface](https://wiki.asterisk.org/wiki/pages/viewpage.action?pageId=32375589) Helper

```typescript
import AGI, { Channel } from '@gibme/asterisk-gateway-interface';

(async () => {
    const agi = new AMI({
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

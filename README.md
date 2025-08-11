# NGL Bot

A simple JavaScript bot that automatically sends multiple messages via NGL.link.

## Configuration

Edit `config.json` to customize the bot behavior:

- `nglUrl`: The NGL.link URL to send messages to
- `delayBetweenMessages`: Delay in milliseconds between each message (default: 2000)
- `delayAfterSend`: Delay in milliseconds after sending a message (default: 1000)
- `headless`: Run browser in headless mode (true/false, default: false)
- `randomizeOrder`: Send messages in random order (true/false, default: false)
- `maxCycles`: Maximum number of cycles to run (0 = infinite, default: 0)

## Messages

Edit `messages.json` to customize the messages that will be sent. The bot will cycle through all messages continuously.

## Usage

```bash
node ./ngl-bot/index.js
```

## Requirements

- Node.js
- npm dependencies (run `npm install`)

## License

MIT
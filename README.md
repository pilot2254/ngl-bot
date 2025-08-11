# NGL Bot

A simple JavaScript bot that automatically sends multiple messages via NGL.link.

> [!IMPORTANT]
> I only made this for educational purposes. It was not built to cyberbully someone or spam NGL's servers with requests.

## Configuration

Edit `config.json` to customize the bot behavior:

- `nglUrl`: The NGL.link URL to send messages to
- `delayBetweenMessages`: Delay in milliseconds between each message (default: 2000)
- `delayAfterSend`: Delay in milliseconds after sending a message (default: 1000)

## Messages

Edit `messages.json` to customize the messages that will be sent. The bot will cycle through all messages continuously.

## Usage

```bash
node ./ngl-bot/index.js

# Or you can use
npm run dev
```

## Requirements

- Node.js
- npm dependencies (run `npm install`)

## License

MIT
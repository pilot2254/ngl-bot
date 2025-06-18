# NGL Bot

A simple and fast automated message sender for NGL.link profiles.

## Features

- **Multiple modes**: Single message, loop through messages, infinite loop, or random messages
- **Fast execution**: Uses headless browser automation
- **Easy configuration**: Simple JSON configuration file
- **Lightweight**: Minimal dependencies and clean code

## Installation

1. Clone the repository:
```bash
git clone https://github.com/pilot2254/ngl-bot.git
cd ngl-bot
```

2. Install dependencies:

```shellscript
npm install
```

## Configuration

Edit `config.json` to customize your bot:

```json
{
  "url": "https://ngl.link/your-target-username",
  "messages": [
    "Hello there!",
    "How are you doing?",
    "Hope you have a great day!"
  ],
  "mode": "single",
  "delay": 2000
}
```

### Configuration Options

- **url**: Target NGL.link profile URL
- **messages**: Array of messages to send
- **mode**: Operation mode

- `single` - Send one message and exit
- `loop` - Send all messages once in order
- `infinite` - Loop through messages infinitely
- `random` - Send random messages infinitely

- **delay**: Delay between messages in milliseconds (default: 2000)

## Usage

Run the bot:

```shellscript
npm start
```

Stop the bot anytime with `Ctrl+C`.

## Examples

### Send a single message

```json
{
  "url": "https://ngl.link/username",
  "messages": ["Hello!"],
  "mode": "single"
}
```

### Loop through messages once

```json
{
  "url": "https://ngl.link/username",
  "messages": ["Message 1", "Message 2", "Message 3"],
  "mode": "loop",
  "delay": 3000
}
```

### Send random messages continuously

```json
{
  "url": "https://ngl.link/username",
  "messages": ["Hey!", "What's up?", "How are you?"],
  "mode": "random",
  "delay": 5000
}
```

## Requirements

- Node.js 16+
- Chrome/Chromium browser (automatically installed with Puppeteer)

## Inspiration

This project was inspired by [StromVMX/ngl-bot](https://github.com/StromVMX/ngl-bot).

## Disclaimer

This tool is for educational purposes only. Please use responsibly and respect others' privacy. The authors are not responsible for any misuse of this software.

## License

MIT License - see [LICENSE](LICENSE) file for details.
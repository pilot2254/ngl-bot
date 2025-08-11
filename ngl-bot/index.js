const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

async function loadConfig() {
  try {
    const configPath = path.join(__dirname, '..', 'config.json');
    const data = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading config.json:', error.message);
    process.exit(1);
  }
}

async function loadMessages() {
  try {
    const messagesPath = path.join(__dirname, '..', 'messages.json');
    const data = await fs.readFile(messagesPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading messages.json:', error.message);
    process.exit(1);
  }
}

async function sendMessage(message, config) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(config.nglUrl);
    await page.waitForSelector('textarea', { timeout: 10000 });

    await page.type('textarea', message);
    await page.click('button[type="submit"]');

    console.log(`Message Sent: ${message}`);
    
    await new Promise(resolve => setTimeout(resolve, config.delayAfterSend));
  } catch (error) {
    console.error(`Error sending message "${message}":`, error.message);
  } finally {
    await browser.close();
  }
}

(async () => {
  console.log('Starting NGL Bot...');
  
  const config = await loadConfig();
  const messages = await loadMessages();

  if (messages.length === 0) {
    console.error('No messages found in messages.json');
    process.exit(1);
  }

  console.log(`Loaded ${messages.length} messages`);
  console.log(`Target URL: ${config.nglUrl}`);
  console.log(`Delay between messages: ${config.delayBetweenMessages}ms`);

  let messageIndex = 0;

  while (true) {
    await sendMessage(messages[messageIndex], config);

    messageIndex++;
    if (messageIndex >= messages.length) {
      messageIndex = 0;
      console.log('Completed cycle, restarting...');
    }

    await new Promise(resolve => setTimeout(resolve, config.delayBetweenMessages));
  }
})();
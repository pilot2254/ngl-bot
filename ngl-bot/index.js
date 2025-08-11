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

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

async function sendMessage(message, config) {
  const browser = await puppeteer.launch({ headless: config.headless });
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
  let messages = await loadMessages();

  if (messages.length === 0) {
    console.error('No messages found in messages.json');
    process.exit(1);
  }

  console.log(`Loaded ${messages.length} messages`);
  console.log(`Target URL: ${config.nglUrl}`);
  console.log(`Delay between messages: ${config.delayBetweenMessages}ms`);
  console.log(`Max cycles: ${config.maxCycles === 0 ? 'Infinite' : config.maxCycles}`);

  if (config.randomizeOrder) {
    messages = shuffleArray(messages);
    console.log('Messages will be sent in random order');
  }

  let cycleCount = 0;
  let messageIndex = 0;

  while (config.maxCycles === 0 || cycleCount < config.maxCycles) {
    await sendMessage(messages[messageIndex], config);

    messageIndex++;
    if (messageIndex >= messages.length) {
      messageIndex = 0;
      cycleCount++;
      
      if (config.randomizeOrder) {
        messages = shuffleArray(messages);
      }
      
      console.log(`Completed cycle ${cycleCount}`);
    }

    if (config.maxCycles === 0 || cycleCount < config.maxCycles) {
      await new Promise(resolve => setTimeout(resolve, config.delayBetweenMessages));
    }
  }

  console.log('Bot finished running');
})();
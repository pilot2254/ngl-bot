const puppeteer = require('puppeteer');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendMessage(page, message) {
  try {
    await page.waitForSelector('textarea[name="question"]', { timeout: 10000 });
    await page.evaluate(() => document.querySelector('textarea[name="question"]').value = '');
    await page.type('textarea[name="question"]', message);
    await page.click('button[type="submit"]');
    await delay(1000);
    console.log(`Sent: ${message}`);
    return true;
  } catch (error) {
    console.log(`Failed: ${error.message}`);
    return false;
  }
}

async function run() {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  
  const page = await browser.newPage();
  await page.goto(config.url);
  
  if (config.mode === 'single') {
    await sendMessage(page, config.messages[0]);
  }
  
  else if (config.mode === 'loop') {
    for (const message of config.messages) {
      await sendMessage(page, message);
      await delay(config.delay);
    }
  }
  
  else if (config.mode === 'infinite') {
    let i = 0;
    while (true) {
      await sendMessage(page, config.messages[i]);
      i = (i + 1) % config.messages.length;
      await delay(config.delay);
    }
  }
  
  else if (config.mode === 'random') {
    while (true) {
      const msg = config.messages[Math.floor(Math.random() * config.messages.length)];
      await sendMessage(page, msg);
      await delay(config.delay);
    }
  }
  
  await browser.close();
}

process.on('SIGINT', () => process.exit(0));
run().catch(console.error);
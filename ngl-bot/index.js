const puppeteer = require('puppeteer');
const fs = require('fs').promises;

async function sendMessage(message) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto('https://ngl.link/pilot2254.private');
  await page.waitForSelector('textarea');

  await page.type('textarea', message);

  await page.click('button[type="submit"]');

  console.log(`Odoslaná správa: ${message}`);

  await new Promise(resolve => setTimeout(resolve, 1000));

  await browser.close();
}

(async () => {
  const data = await fs.readFile('messages.json', 'utf-8');
  const messages = JSON.parse(data);

  let i = 0;
  while (true) {
    await sendMessage(messages[i]);

    i++;
    if (i >= messages.length) i = 0;

    await new Promise(resolve => setTimeout(resolve, 2000));
  }
})();

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class NGLBot {
  constructor(config) {
    this.config = {
      url: '',
      messages: [],
      mode: 'single', // 'single', 'loop', 'infinite', 'random'
      delay: 2000,
      headless: true,
      timeout: 30000,
      retries: 3,
      ...config
    };
    this.browser = null;
    this.page = null;
  }

  async init() {
    console.log('Initializing browser...');
    this.browser = await puppeteer.launch({ 
      headless: this.config.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setDefaultTimeout(this.config.timeout);
  }

  async navigateToPage() {
    console.log(`Navigating to: ${this.config.url}`);
    await this.page.goto(this.config.url, { waitUntil: 'networkidle2' });
    
    // Wait for the textarea to be available
    await this.page.waitForSelector('textarea[name="question"]', { timeout: this.config.timeout });
    console.log('Page loaded successfully');
  }

  async sendMessage(message) {
    let attempts = 0;
    
    while (attempts < this.config.retries) {
      try {
        console.log(`Sending message (attempt ${attempts + 1}): ${message.substring(0, 50)}...`);
        
        // Clear existing text and type new message
        await this.page.click('textarea[name="question"]');
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('KeyA');
        await this.page.keyboard.up('Control');
        await this.page.type('textarea[name="question"]', message);
        
        // Click submit button
        await this.page.click('button.submit[type="submit"]');
        
        // Wait for submission to complete
        await this.page.waitForTimeout(1000);
        
        console.log('Message sent successfully');
        return true;
        
      } catch (error) {
        attempts++;
        console.error(`Failed to send message (attempt ${attempts}):`, error.message);
        
        if (attempts < this.config.retries) {
          console.log('Retrying...');
          await this.page.waitForTimeout(2000);
        }
      }
    }
    
    console.error('Failed to send message after all retries');
    return false;
  }

  getRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.config.messages.length);
    return this.config.messages[randomIndex];
  }

  async runSingleMode() {
    console.log('Running in single message mode');
    const message = this.config.messages[0] || 'Hello!';
    await this.sendMessage(message);
  }

  async runLoopMode() {
    console.log(`Running in loop mode with ${this.config.messages.length} messages`);
    
    for (let i = 0; i < this.config.messages.length; i++) {
      await this.sendMessage(this.config.messages[i]);
      
      if (i < this.config.messages.length - 1) {
        console.log(`Waiting ${this.config.delay}ms before next message...`);
        await this.page.waitForTimeout(this.config.delay);
      }
    }
  }

  async runInfiniteMode() {
    console.log('Running in infinite loop mode');
    let messageIndex = 0;
    
    while (true) {
      const message = this.config.messages[messageIndex];
      await this.sendMessage(message);
      
      messageIndex = (messageIndex + 1) % this.config.messages.length;
      
      console.log(`Waiting ${this.config.delay}ms before next message...`);
      await this.page.waitForTimeout(this.config.delay);
    }
  }

  async runRandomMode() {
    console.log('Running in random message mode');
    
    while (true) {
      const message = this.getRandomMessage();
      await this.sendMessage(message);
      
      console.log(`Waiting ${this.config.delay}ms before next message...`);
      await this.page.waitForTimeout(this.config.delay);
    }
  }

  async run() {
    try {
      await this.init();
      await this.navigateToPage();
      
      switch (this.config.mode) {
        case 'single':
          await this.runSingleMode();
          break;
        case 'loop':
          await this.runLoopMode();
          break;
        case 'infinite':
          await this.runInfiniteMode();
          break;
        case 'random':
          await this.runRandomMode();
          break;
        default:
          throw new Error(`Unknown mode: ${this.config.mode}`);
      }
      
    } catch (error) {
      console.error('Bot execution failed:', error.message);
    } finally {
      await this.cleanup();
    }
  }

  async cleanup() {
    if (this.browser) {
      console.log('Closing browser...');
      await this.browser.close();
    }
  }
}

// Configuration loader
async function loadConfig(configPath = './config.json') {
  try {
    const configData = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(configData);
  } catch (error) {
    console.error('Failed to load config file:', error.message);
    console.log('Using default configuration');
    return {};
  }
}

// Main execution
async function main() {
  const config = await loadConfig();
  
  // Validate required configuration
  if (!config.url) {
    console.error('Error: URL is required in configuration');
    process.exit(1);
  }
  
  if (!config.messages || config.messages.length === 0) {
    console.error('Error: At least one message is required in configuration');
    process.exit(1);
  }
  
  const bot = new NGLBot(config);
  
  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    await bot.cleanup();
    process.exit(0);
  });
  
  await bot.run();
}

// Run the bot
main().catch(console.error);
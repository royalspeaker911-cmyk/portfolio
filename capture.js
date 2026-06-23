const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const paths = ['ecommerce', 'agency', 'automation', 'ads', 'design'];
  
  for (const path of paths) {
    try {
      const url = `file:///C:/Users/Tharun%20sagar%20m/.gemini/antigravity-ide/scratch/portfolio/${path}/index.html`;
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.screenshot({ path: `${path}.png` });
      console.log(`Captured ${path}.png`);
    } catch (e) {
      console.error(`Failed to capture ${path}`, e);
    }
  }

  await browser.close();
})();

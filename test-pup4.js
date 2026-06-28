const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000/login');
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Login as Admin'));
    if (btn) btn.click();
  });
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  
  const outerHTMLs = await page.evaluate(() => {
    const triggers = document.querySelectorAll('[data-slot="dropdown-menu-trigger"]');
    return Array.from(triggers).map(t => t.outerHTML);
  });
  
  console.log("Triggers:", outerHTMLs);
  
  await browser.close();
})();

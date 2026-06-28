const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/login');
  
  // Find "Login as Admin" button and click it
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Login as Admin'));
    if (btn) btn.click();
  });
  
  await page.waitForNavigation();
  console.log("On admin dashboard");
  
  // Click first trigger
  await page.evaluate(() => {
    const trigger = document.querySelector('[data-slot="dropdown-menu-trigger"]');
    if (trigger) trigger.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();

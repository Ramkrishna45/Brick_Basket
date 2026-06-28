const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/login');
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Login as Admin'));
    if (btn) btn.click();
  });
  
  await page.waitForNavigation();
  console.log("On admin dashboard");
  
  // Find trigger by checking for lucide-bell or avatar
  const triggers = await page.$$('button[aria-haspopup="menu"], button');
  console.log(`Found ${triggers.length} buttons`);
  
  // Find the exact ones we want
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const bellBtn = btns.find(b => b.querySelector('.lucide-bell'));
    if (bellBtn) {
       console.log("Clicking bell button...");
       bellBtn.click();
    }
  });
  
  await new Promise(r => setTimeout(r, 1000));
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const avatarBtn = btns.find(b => b.textContent.includes('Ananya') || b.querySelector('.lucide-chevron-up'));
    if (avatarBtn) {
       console.log("Clicking avatar button...");
       avatarBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  
  await browser.close();
})();

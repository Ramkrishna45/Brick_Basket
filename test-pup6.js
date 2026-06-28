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
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log("On admin dashboard");
  
  await page.exposeFunction('logError', msg => console.log('REACT ERROR:', msg));

  await page.evaluate(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      window.logError(message + ' ' + (error ? error.stack : ''));
    };
  });
  
  // Find the Avatar trigger and double click it!
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const avatarBtn = btns.find(b => b.textContent.includes('Ananya') || b.querySelector('.lucide-chevron-up'));
    if (avatarBtn) {
       console.log("Clicking avatar button FIRST time...");
       avatarBtn.click();
       
       setTimeout(() => {
           console.log("Clicking avatar button SECOND time...");
           avatarBtn.click();
       }, 500);
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  
  // Click outside to close
  await page.mouse.click(0, 0);
  
  await new Promise(r => setTimeout(r, 1000));

  await browser.close();
})();

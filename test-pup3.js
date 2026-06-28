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
  
  // Expose function to log React errors
  await page.exposeFunction('logError', msg => console.log('REACT ERROR:', msg));

  // Catch unhandled rejections or window.onerror
  await page.evaluate(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      window.logError(message + ' ' + (error ? error.stack : ''));
    };
    window.addEventListener('unhandledrejection', function(event) {
      window.logError('Unhandled rejection: ' + event.reason);
    });
  });

  // Click every button on the page sequentially
  const buttonCount = await page.evaluate(() => document.querySelectorAll('button').length);
  
  for (let i = 0; i < buttonCount; i++) {
    await page.evaluate((index) => {
       const btn = document.querySelectorAll('button')[index];
       if (btn && btn.offsetParent !== null) {
          console.log("Clicking button: " + btn.className);
          btn.click();
       }
    }, i);
    await new Promise(r => setTimeout(r, 500));
  }
  
  await browser.close();
})();

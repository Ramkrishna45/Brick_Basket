const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  // Simulate mobile device
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812, isMobile: true });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000/login');
  
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent.includes('Login as Admin'));
    if (btn) btn.click();
  });
  
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log("On admin dashboard (Mobile view)");
  
  // Expose function to log React errors
  await page.exposeFunction('logError', msg => console.log('REACT ERROR:', msg));

  await page.evaluate(() => {
    window.onerror = function(message, source, lineno, colno, error) {
      window.logError(message + ' ' + (error ? error.stack : ''));
    };
  });

  // 1. Click hamburger menu to open sidebar sheet
  await page.evaluate(() => {
    // Find the SidebarTrigger
    // usually has lucide-panel-left or similar, or aria-label
    const trigger = document.querySelector('[data-sidebar="trigger"]');
    if (trigger) {
      console.log("Clicking SidebarTrigger...");
      trigger.click();
    }
  });

  await new Promise(r => setTimeout(r, 1000));
  
  // 2. Click Avatar inside sidebar
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const avatarBtn = btns.find(b => b.textContent.includes('Ananya') || b.querySelector('.lucide-chevron-up'));
    if (avatarBtn) {
       console.log("Clicking avatar button...");
       avatarBtn.click();
    }
  });

  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();

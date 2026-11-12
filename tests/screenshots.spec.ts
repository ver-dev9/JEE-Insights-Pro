import {test,expect} from '@playwright/test';
import fs from 'node:fs';
test('capture desktop and mobile product screenshots',async({browser})=>{
 fs.mkdirSync('docs/screenshots',{recursive:true});
 const desktop=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 await desktop.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 await expect(desktop.getByRole('heading',{name:/Make every question count/i})).toBeVisible();
 await desktop.screenshot({path:'docs/screenshots/desktop.png',fullPage:true});
 const mobile=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 await mobile.goto('http://127.0.0.1:4173',{waitUntil:'networkidle'});
 await expect(mobile.getByRole('heading',{name:/Make every question count/i})).toBeVisible();
 await mobile.screenshot({path:'docs/screenshots/mobile.png',fullPage:true});
});

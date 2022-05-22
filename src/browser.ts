

import puppeteer from "puppeteer-extra"
import stealth from "puppeteer-extra-plugin-stealth"
import { Browser, Page } from 'puppeteer';
import { IS_HEADLESS } from './globals';

let browser: Browser;
// let isSpecialBrowser = false;

async function launchBrowser(args?: object) {
  let options = {
    headless: IS_HEADLESS,
    ignoreHTTPSErrors: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-sync",
      "--ignore-certificate-errors",
      "--lang=en-US,en;q=0.9",
    ],
    defaultViewport: { width: 1366, height: 768 },
  }

  if (args) {
    options = {
      ...options,
      ...args
    };
  }

  puppeteer.use(stealth())
  browser = await puppeteer.launch(options)
}

export async function getBrowser(): Promise<Browser> {
  if (!browser) {
    await launchBrowser();
  }

  return browser;
}

// export async function getSpecialBrowser(): Promise<Browser> {
//   const specialArgs = {
//     defaultViewport: null,
//     args: ['--window-size=1920,0']
//   };

//   if (isSpecialBrowser) {
//     return browser;
//   }

//   // If a browser is open but not special then close it
//   if (browser) {
//     await browser.close();
//     browser = undefined;
//   }

//   if (!browser) {
//     await launchBrowser(specialArgs);
//   }

//   isSpecialBrowser = true;
//   return browser;
// }

export async function getPage(): Promise<Page> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  let [page] = await browser.pages();
  if (!page) {
    page = await browser.newPage();
  }

  return page;
}

export async function closeBrowser(): Promise<void> {
  if (!browser) {
    throw new Error('No browser initialted yet');
  }

  await browser.close();
}

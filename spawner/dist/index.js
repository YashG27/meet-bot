"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { Builder, Browser, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Chrome options with anti-detection settings
        const options = new chrome.Options();
        // Disable features that reveal automation
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.addArguments("--use-fake-ui-for-media-stream");
        options.addArguments("--start-maximized");
        options.addArguments("--window-size=1080,720");
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--enable-usermedia-screen-capturing');
        options.addArguments('--auto-select-tab-capture-source-by-title="Meet"');
        options.addArguments('--allow-running-insecure-content');
        // Set a realistic user agent
        options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');
        // Set excludeSwitches and useAutomationExtension using the correct method
        options.addArguments('--disable-extensions');
        // Set experimental options properly for JavaScript
        options.addArguments('--disable-automation');
        // Set excludeSwitches and useAutomationExtension
        options.excludeSwitches(['enable-automation']);
        let driver = yield new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
        try {
            yield driver.get('https://meet.google.com/uus-zswd-zbk');
            //await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
            yield driver.wait(until.titleIs('webdriver - Google Search'), 100000);
        }
        finally {
            yield driver.quit();
        }
    });
}
main();

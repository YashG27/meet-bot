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
        options.addArguments("--window-size=1080,720");
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
        options.addArguments('--enable-usermedia-screen-capturing');
        options.addArguments('--auto-select-tab-capture-source-by-title="Meet"');
        options.addArguments('--allow-running-insecure-content');
        // Use a recent version
        // Create a directory to store the user profile (e.g., 'chrome-profile')
        // You might need to create this directory manually or via Node.js fs module
        function randomDelay(min, max) {
            return Math.random() * (max - min) + min;
        }
        function typeSlowly(element, text, driver) {
            return __awaiter(this, void 0, void 0, function* () {
                for (const char of text) {
                    yield element.sendKeys(char);
                    yield driver.sleep(randomDelay(50, 150)); // Small delay between characters
                }
            });
        }
        // Set a realistic user agent   
        let driver = yield new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build();
        try {
            yield driver.get('https://meet.google.com/sen-rxcy-hnj');
            //await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
            // await driver.wait(until.titleIs('webdriver - Google Search'), 100000)
            const popupButton = yield driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
            yield popupButton.click();
            yield driver.sleep(randomDelay(1000, 3000));
            const nameInput = yield driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
            yield nameInput.click();
            yield driver.sleep(randomDelay(500, 1500));
            yield typeSlowly(nameInput, "Meeting Attendee", driver);
            yield nameInput.sendKeys('value', "Meeting");
            yield driver.sleep(randomDelay(1000, 4000));
            const buttonInput = yield driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
            buttonInput.click();
            yield driver.wait(until.titleIs('webdriver - Google Search'), 100000);
        }
        finally {
            yield driver.quit();
        }
    });
}
main();

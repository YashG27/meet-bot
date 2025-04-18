const { Builder, Browser, By, Key, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome');
async function main() {

    // Create Chrome options with anti-detection settings
    const options = new chrome.Options();

    // Disable features that reveal automation
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    options.addArguments("--window-size=1080,720")
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--enable-usermedia-screen-capturing');
    options.addArguments('--auto-select-tab-capture-source-by-title="Meet"')
    options.addArguments('--allow-running-insecure-content');

     // Use a recent version

    // Create a directory to store the user profile (e.g., 'chrome-profile')
    // You might need to create this directory manually or via Node.js fs module

    function randomDelay(min : number, max : number) { // min and max in milliseconds
        return Math.random() * (max - min) + min;
    }
    
    async function typeSlowly(element : any, text : string, driver : any) {
        for (const char of text) {
            await element.sendKeys(char);
            await driver.sleep(randomDelay(50, 150)); // Small delay between characters
        }
    }

    // Set a realistic user agent   

    let driver = await new Builder().forBrowser(Browser.CHROME).setChromeOptions(options).build()
    try {
        await driver.get('https://meet.google.com/sen-rxcy-hnj')
        //await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
        // await driver.wait(until.titleIs('webdriver - Google Search'), 100000)
        const popupButton = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Got it")]')), 10000);
        await popupButton.click()
        await driver.sleep(randomDelay(1000, 3000));
        const nameInput = await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Your name"]')), 10000);
        await nameInput.click();
        await driver.sleep(randomDelay(500, 1500));
        await typeSlowly(nameInput, "Meeting Attendee", driver);
        await nameInput.sendKeys('value', "Meeting");
        await driver.sleep(randomDelay(1000, 4000));
        const buttonInput = await driver.wait(until.elementLocated(By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
        buttonInput.click();
        await driver.wait(until.titleIs('webdriver - Google Search'), 100000)
    } finally {
        await driver.quit()
    }
    }

main();
const options = new chrome.Options();

    // Disable features that reveal automation
    options.addArguments("--disable-blink-features=AutomationControlled");
    options.addArguments("--use-fake-ui-for-media-stream");
    options.addArguments("--start-maximized")
    options.addArguments("--window-size=1080,720")
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--auto-select-desktop-capture-source=[RECORD]');
    options.addArguments('--enable-usermedia-screen-capturing');
    options.addArguments('--auto-select-tab-capture-source-by-title="Meet"')
    options.addArguments('--allow-running-insecure-content');
  
    // Set a realistic user agent
    options.addArguments('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36');

    // Set excludeSwitches and useAutomationExtension using the correct method
    options.addArguments('--disable-extensions');

    // Set experimental options properly for JavaScript
    options.addArguments('--disable-automation');

  // Set excludeSwitches and useAutomationExtension
    options.excludeSwitches(['enable-automation']);
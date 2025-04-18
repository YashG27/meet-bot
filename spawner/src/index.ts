import { WebDriver, Builder, Browser, By, Key, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome"
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

    async function startScreenshare(driver: WebDriver) {
        console.log("startScreensharecalled")
            const response = await driver.executeScript(`
        
                function wait(delayInMS) {
                    return new Promise((resolve) => setTimeout(resolve, delayInMS));
                }
        
                function startRecording(stream, lengthInMS) {
                    let recorder = new MediaRecorder(stream);
                    let data = [];
                    
                    recorder.ondataavailable = (event) => data.push(event.data);
                    recorder.start();
                    
                    let stopped = new Promise((resolve, reject) => {
                        recorder.onstop = resolve;
                        recorder.onerror = (event) => reject(event.name);
                    });
                    
                    let recorded = wait(lengthInMS).then(() => {
                        if (recorder.state === "recording") {
                        recorder.stop();
                        }
                    });
                    
                    return Promise.all([stopped, recorded]).then(() => data);
                }
            
                console.log("before mediadevices")
                window.navigator.mediaDevices.getDisplayMedia({
                    video: {
                    displaySurface: "browser"
                    },
                    audio: true,
                    preferCurrentTab: true
                }).then(async screenStream => {                        
                    const audioContext = new AudioContext();
                    const screenAudioStream = audioContext.createMediaStreamSource(screenStream)
                    const audioEl1 = document.querySelectorAll("audio")[0];
                    const audioEl2 = document.querySelectorAll("audio")[1];
                    const audioEl3 = document.querySelectorAll("audio")[2];
                    const audioElStream1 = audioContext.createMediaStreamSource(audioEl1.srcObject)
                    const audioElStream2 = audioContext.createMediaStreamSource(audioEl3.srcObject)
                    const audioElStream3 = audioContext.createMediaStreamSource(audioEl2.srcObject)
        
                    const dest = audioContext.createMediaStreamDestination();
        
                    screenAudioStream.connect(dest)
                    audioElStream1.connect(dest)
                    audioElStream2.connect(dest)
                    audioElStream3.connect(dest)
        
                    // window.setInterval(() => {
                    //   document.querySelectorAll("audio").forEach(audioEl => {
                    //     if (!audioEl.getAttribute("added")) {
                    //       console.log("adding new audio");
                    //       const audioEl = document.querySelector("audio");
                    //       const audioElStream = audioContext.createMediaStreamSource(audioEl.srcObject)
                    //       audioEl.setAttribute("added", true);
                    //       audioElStream.connect(dest)
                    //     }
                    //   })
        
                    // }, 2500);
                
                // Combine screen and audio streams
                const combinedStream = new MediaStream([
                    ...screenStream.getVideoTracks(),
                    ...dest.stream.getAudioTracks()
                ]);
                
                console.log("before start recording")
                const recordedChunks = await startRecording(combinedStream, 60000);
                console.log("after start recording")
                
                let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
                
                // Create download for video with audio
                const recording = document.createElement("video");
                recording.src = URL.createObjectURL(recordedBlob);
                
                const downloadButton = document.createElement("a");
                downloadButton.href = recording.src;
                downloadButton.download = "RecordedScreenWithAudio.webm";    
                downloadButton.click();
                
                console.log("after download button click")
                
                // Clean up streams
                screenStream.getTracks().forEach(track => track.stop());
                // audioStream.getTracks().forEach(track => track.stop());
                })
                
            `)
    
        console.log(response)
        driver.sleep(1000000)
    }

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
        // wait until admin lets u join
        await startScreenshare(driver); 
    } finally {

    }
    }

main();
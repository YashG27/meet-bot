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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const selenium_webdriver_1 = require("selenium-webdriver");
const chrome_1 = __importDefault(require("selenium-webdriver/chrome"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create Chrome options with anti-detection settings
        const options = new chrome_1.default.Options();
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
        function startScreenshare(driver) {
            return __awaiter(this, void 0, void 0, function* () {
                console.log("startScreensharecalled");
                const response = yield driver.executeScript(`
        
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
                
            `);
                console.log(response);
                driver.sleep(1000000);
            });
        }
        let driver = yield new selenium_webdriver_1.Builder().forBrowser(selenium_webdriver_1.Browser.CHROME).setChromeOptions(options).build();
        try {
            yield driver.get('https://meet.google.com/sen-rxcy-hnj');
            //await driver.findElement(By.name('q')).sendKeys('webdriver', Key.RETURN)
            // await driver.wait(until.titleIs('webdriver - Google Search'), 100000)
            const popupButton = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(), "Got it")]')), 10000);
            yield popupButton.click();
            yield driver.sleep(randomDelay(1000, 3000));
            const nameInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//input[@placeholder="Your name"]')), 10000);
            yield nameInput.click();
            yield driver.sleep(randomDelay(500, 1500));
            yield typeSlowly(nameInput, "Meeting Attendee", driver);
            yield nameInput.sendKeys('value', "Meeting");
            yield driver.sleep(randomDelay(1000, 4000));
            const buttonInput = yield driver.wait(selenium_webdriver_1.until.elementLocated(selenium_webdriver_1.By.xpath('//span[contains(text(), "Ask to join")]')), 10000);
            buttonInput.click();
            // wait until admin lets u join
            yield startScreenshare(driver);
        }
        finally {
        }
    });
}
main();

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
        return new Promise(async (resolve, reject) => {
            try {
                function wait(delayInMS) {
                    return new Promise((resolve) => setTimeout(resolve, delayInMS));
                }

                function startMediaRecording(stream, lengthInMS, mimeType) {
                    let recorder = new MediaRecorder(stream, { mimeType });
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
                
                // Get screen stream for video
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: { displaySurface: "browser" },
                    audio: false // We'll handle audio separately for better control
                });
                
                // Get all audio streams from the meeting
                const audioElements = document.querySelectorAll("audio");
                const audioContext = new AudioContext();
                const audioDestination = audioContext.createMediaStreamDestination();
                
                // Connect all audio elements to our destination
                Array.from(audioElements).forEach(audioEl => {
                    if (audioEl.srcObject) {
                        const source = audioContext.createMediaStreamSource(audioEl.srcObject);
                        source.connect(audioDestination);
                    }
                });

                // Get the combined audio stream
                const audioStream = audioDestination.stream;
                
                // Create a combined stream for video with audio
                const combinedStream = new MediaStream([
                    ...screenStream.getVideoTracks(),
                    ...audioStream.getAudioTracks()
                ]);
                
                // Also keep a separate audio-only stream for transcription
                const audioOnlyStream = new MediaStream([...audioStream.getAudioTracks()]);
                
                // Start recording video with audio
                console.log("Starting video recording with audio");
                const videoChunks = startMediaRecording(combinedStream, 40000, 'video/webm');
                
                // Start recording audio only (for transcription)
                console.log("Starting audio-only recording for transcription");
                const audioChunks = startMediaRecording(audioOnlyStream, 40000, 'audio/webm');
                
                // Wait for both recordings to finish
                const [videoData, audioData] = await Promise.all([videoChunks, audioChunks]);
                
                // Create blobs from the chunks
                const videoBlob = new Blob(videoData, { type: 'video/webm' });
                const audioBlob = new Blob(audioData, { type: 'audio/webm' });
                
                // Create download elements
                const videoURL = URL.createObjectURL(videoBlob);
                const audioURL = URL.createObjectURL(audioBlob);
                
                // Download video file (with audio)
                const videoLink = document.createElement('a');
                videoLink.href = videoURL;
                videoLink.download = "Recorded Video File";
                videoLink.click();
                
                // Download audio file (for transcription)
                const audioLink = document.createElement('a');
                audioLink.href = audioURL;
                audioLink.download = "Recorded Audio File";
                audioLink.click();
                
                // Clean up streams
                screenStream.getTracks().forEach(track => track.stop());
                audioStream.getTracks().forEach(track => track.stop());
                
                // Give some time for downloads to start
                await wait(2000);
                
                resolve({
                    videoFilename: "Recorded Video File",
                    audioFilename: "Recorded Audio File"
                });
            } catch (error) {
                console.error("Error in recording:", error);
                reject(error);
            }
        });
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
            console.log("Asked to join");
            buttonInput.click();
            // wait until admin lets u join
            yield new Promise(x => setTimeout(x, 20000));
            yield startScreenshare(driver);
        }
        finally {
        }
    });
}
main();

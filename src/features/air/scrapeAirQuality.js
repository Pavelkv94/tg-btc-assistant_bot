import { Builder, By, until } from 'selenium-webdriver';
import firefox from 'selenium-webdriver/firefox.js';
import 'chromedriver'; // This ensures the correct ChromeDriver version is used
import { airService } from './air.service.js';

export async function scrapeAirQuality(userChatIds, type) {
    // Set up Chrome options for headless browsing
    const options = new firefox.Options().setBinary('/usr/local/bin/firefox');
    options.addArguments('--headless');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    let driver;

    try {
        // Create a new browser instance
        console.log('Starting browser...');
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();

        // Navigate to the URL
        const url = 'https://www.iqair.com/ru/poland/lesser-poland-voivodeship/krakow';
        console.log(`Navigating to ${url}...`);
        await driver.get(url);

        // Wait for the page to load and the element to be present
        console.log('Waiting for page to load...');
        // Navigate: main#main-content > div.bg-linear-gradient.relative > div[2] > div[1] > div[2] > div[2]
        const xpath = "//main[@id='main-content']/div[contains(@class, 'bg-linear-gradient') and contains(@class, 'relative')]/div[2]/div[1]/div[2]/div[2]";
        await driver.wait(until.elementLocated(By.xpath(xpath)), 10000);

        // Find the element using the specific DOM path
        const element = await driver.findElement(By.xpath(xpath));

        // Get the text content
        const text = await element.getText();

        // Extract just the AQI value (first line/number) and parse as integer
        const aqiValue = parseInt(text.split('\n')[0].trim());

        console.log('\n=== AQI Value ===');
        console.log(aqiValue);
        console.log('=================\n');

        // Monitor and send alerts if needed
        await airService.monitorAQI(aqiValue, userChatIds, type);

    } catch (error) {
        console.error('Error occurred:', error.message);
        throw error;
    } finally {
        // Close the browser
        if (driver) {
            console.log('Closing browser...');
            await driver.quit();
        }
    }
}


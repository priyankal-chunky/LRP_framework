import { generateRandomNumber } from '../utils/utils'
const { allure } = require('allure-playwright');
import assert from 'node:assert/strict';
import { expect } from '@playwright/test'
import { mailConfig } from '../config/testConfiguration'
let newPage;

export class keywords {

    constructor(page) {
        this.page = page;
    }

    async logs(page, stepName, text, isError) {
        const formattedText = isError ? `❌ ERROR: ${text}` : `✅ SUCCESS: ${text}`;
        allure.attachment('Log Message', formattedText, 'text/plain');
        const shouldAttachScreenshot = isError || (mailConfig.pass_screenshot === 'Yes' && !isError);
        if (shouldAttachScreenshot) {
            const screenshotBuffer = await page.screenshot({ timeout: 25000 });
            allure.attachment(stepName, screenshotBuffer, 'image/png');
        }
    }

    async click(page, locator, stepName) {
        await allure.step(`Click on ${stepName}`, async () => {
            try {
              
                await locator.waitFor({ state: 'visible', timeout: 65000 });
                await locator.click();
                await this.logs(page, stepName, `Clicked on ${stepName}`, false)
                console.log(`Clicked on ${stepName}`);
            } catch (err) {
                await this.logs(page, stepName, `Not clicked on ${stepName}`, true)
                console.error(`Not clicked on ${stepName}`);
                throw new Error(err.message);
            }
        });
    }


    async clear(page, locator, stepName) {
        await allure.step(`Clear text on ${stepName}`, async () => {
            try {
                
                await locator.waitForLoadState
                await locator.clear();
                await this.logs(page, stepName, `Cleared the text: ${stepName}`, false)
                console.log(`Cleared the text: ${stepName}`);
            } catch (err) {
                await this.logs(page, stepName, `Not cleared the text: ${stepName}`, true)
                console.error(`Not cleared the text on : ${stepName}`);
                throw new Error(err.message);
            }
        });
    }

    async fill(page, locator, value, stepName) {
        await allure.step(`Fill on ${stepName} with text ${value}`, async () => {
            try {
               
                await locator.waitFor({ state: 'visible', timeout: 30000 });
                await locator.fill(value);
                await this.logs(page, stepName, `Keys entered : ${value}`, false)
                console.log(`Keys entered on ${value}`)
            } catch (err) {
                await this.logs(page, stepName, `Keys not entered : ${value}`, true)
                console.error(`Keys not entered on ${value}`);
                // throw new Error(err.message);
                assert.fail(err);
            }
        });
    }

     async type(page, locator, value, stepName) {
        await allure.step(`Fill on ${stepName} with text ${value}`, async () => {
            try {
               
                await locator.waitFor({ state: 'visible', timeout: 65000 });
                await expect(locator).toBeEnabled({timeout:10000});
                await locator.focus();
                await locator.type(value);
                await this.logs(page, stepName, `Keys entered : ${value}`, false)
                console.log(`Keys entered on ${value}`)
            } catch (err) {
                await this.logs(page, stepName, `Keys not entered : ${value}`, true)
                console.error(`Keys not entered on ${value}`);
                throw new Error(err.message);
            }
        });
    }

    // page.setDefaultTimeout(30*1000);

    async waitForElement(page, locator, stepName) {
        
        try{
            await locator.waitFor({ state: 'attached', timeout: 30*1000});
            await locator.waitFor({ state: 'visible', timeout: 30*1000});
           
        }catch(err){
            throw new Error(err.message);
        }
    }
    async getText(page, locator, stepName) {
        let text=null;
      await allure.step(`Get text on ${stepName}`, async () => {
        try {
            await locator.waitFor({ state: 'visible', timeout: 30000});
            text = await locator.textContent();
            await this.logs(page, stepName, `Text on ${stepName} is ${text}`, false);
            console.log(`Text on ${stepName} is ${text}`);
            
        }catch(err){
            await this.logs(page, stepName, `Not able to get text on ${stepName}`, true);
            console.error(`Not able to get text on ${stepName}`);
            assert.fail(err);
        }
     });
     return text;
    }

    async doubleClick(page, locator, elementName) {
        await allure.step(`Double Click on ${stepName}`,async()=>{
        try {
            await page.locator(locator).waitFor({ state: 'visible' })
            await page.locator(locator).dblclick();
            console.log(`Clicked on ${stepName}`);
            await this.logs(page, stepName, `Double Cliked on: ${stepName}`, false);
        } catch (err) {
            console.error(`Not Clicked on ${stepName}`);
            await this.logs(page, stepName, `Not Dobe Clicked on: ${steName}`, true);
            assert.fail(err);
        }
        })
    }

    async gotoUrl(page, url, stepName) {
        await allure.step(`Navigate to ${url}`, async () => {
            try {
                await page.goto(url);
                await page.waitForLoadState('load', { timeout: 200000 });
                await this.logs(page, stepName, `URL Launched: ${stepName}`, false);
                console.log(`URL Launched: ${url}`);
            } catch (err) {
                await this.logs(page, stepName, `URL not Launched: ${stepName}`, true)
                console.error("URL is not launched");
                throw new Error(`Navigation failed for URL: ${url} - ${err.message}`);
            }
        });
    }

    async scrollIntoViewIfNeeded(page, locator, stepName) {
    
    await allure.step(`Scroll into view if needed on ${stepName}`, async () => {
    try{
    await locator.waitFor({ state: 'visible', timeout: 120000 });
    await locator.scrollIntoViewIfNeeded();
    await this.logs(page, stepName, `Scrolled into view on ${stepName}`, false);
    console.log(`Scrolled into view on ${stepName}`);
    }catch(error){
    await this.logs(page, stepName, `Not able to scroll into view on ${stepName}`, true);
    throw new Error(`Not able to scroll into view on ${stepName} - ${error.message}`);
    }
    });
    }

    async displaycheck(page, locator, elementName) {
        await allure.step(`Display check ${stepName}`, async () => {
            try {
               
                await locator.waitFor({ state: 'visible', timeout: 120000 });
                await expect.soft(locator).toBeVisible();
                await this.logs(page, stepName, `${stepName} is Visible`, false)
                console.log(`${stepName} is Visible`)
            } catch (err) {
                await this.logs(page, elementName, `${stepName} is not Visible`, true)
                console.error(`${stepName} is not Visible`);
                throw new Error(`${stepName} is not Visible - ${err.message}`);
            }
        });
    }

    async getAttribute(page, xpath, attribute, stepName) {
        let attributeValue=null;
        const waitTimeInSeconds = 10;
        await allure.step(`Get attribute ${attribute} on ${stepName}`, async () => {
        try {
            const elementHandle = await page.waitForXPath(xpath, { timeout: waitTimeInSeconds * 1000 });
             attributeValue = await elementHandle.getAttribute(attribute);
            console.log(`Attribute value for ${stepName}:`, attributeValue);
            await this.logs(page, stepName, `Attribute value for ${stepName}: ${attributeValue}`, false);
            
        } catch (error) {
            await this.logs(page, stepName, `Unable to get the attribute value of ${stepName}: ${error}`, true);
            throw new Error(`Unable to get the attribute value of ${stepName}: ${error}`);  
        }
    });
    return attributeValue;
    }

   

    async dropdown(page, locator, value, elementName) {
        await allure.step(`Select dropdown ${stepName}`, async () => {
            try {
                await page.locator(locator).waitFor({ state: 'visible', timeout: 180000 });
                await page.locator(locator).selectOption(value);
                await this.logs(page, elementName, `dropdown ${value} is selected`, false);
                console.log(` dropdown on ${elementName}`);
            } catch (err) {
                await this.logs(page, elementName, `dropdown ${value} is not selected`, true)
                throw new Error(err.message);
            }
        });
    }

    async check(page, locator, elementName) {
        await allure.step(`Check on ${stepName}`, async () => {
        try {
            await page.locator(locator.toString()).waitFor({ state: 'visible', timeout: 120000 })
            await page.locator(locator.toString()).check();
            console.log(`Check on ${stepName}`);
            await this.logs(page, stepName, `Checked on: ${stepName}`, false);
        } catch (err) {
            await this.logs(page, stepName, `Not Checked on: ${stepName}`, true);
            throw new Error(err.message);
        }
    });
    }

    async hoverAndClick(page, locator) {
        await allure.step(`Hover and Click on element`, async () => {
        try {
            const element = await page.locator(locator);

            if (element) {

                await element.hover(locator);

                await page.waitForTimeout(500);

                await element.click();
                console.log("Click on the element: Success");
                await this.logs(page, "Hover and Click", "Click on the element: Success", false);
            } else {
                await this.logs(page, "Hover and Click", "Element not found", true);
                throw new Error("Element not found");
            }
        } catch (err) {
            await this.logs(page, "Hover and Click", `Unable to Click on the element: ${err}`, true);
            throw new Error(err.message);
        }
    });
    }


    async uploadfile(page, locator, data) {
        await allure.step(`Upload file in ${stepName}`, async () => {
            try {
                await page.locator(locator).setInputFiles(`./testdata/uploadData/${data}.jpg`);
                console.log(`File uploaded successfully - ${data}`);
                await this.logs(page, stepName, `File uploaded successfully - ${data}`, false);
            } catch (err) {
                await this.logs(page, stepName, `File not uploaded - ${data}`, true);
                throw new Error(err.message);
            }
        })
    }


    async switchToTab(page, locator) {
        await allure.step(`Switch to new tab`, async () => {
        try {
            const pagePromise = page.waitForEvent('popup');
            await page.locator(locator).click();
            newPage = await pagePromise;
            await this.logs(page, "Switch to new tab", "New tab is Populated", false);
            console.log("New tab is Populated");
            return newPage;
        } catch (err) {
            await this.logs(page, "Switch to new tab", "New tab is not Populated", true);
            throw new Error(err.message);
        }
    });
    }

}
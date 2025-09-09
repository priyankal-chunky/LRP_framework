import {expect} from "@playwright/test";
import { homePageLocators } from "../pageobjects/lrpLocators/homePageLocator.js";
import { keywords } from "../common/keywords.js";
export class home{
    constructor(page){
        this.page=page;
        // this.locators=new homePageLocators(this.page);
        this.keywords=new keywords(this.page);

    }

    async moduleSearch(moduleName){
        const concateLoc=new homePageLocators(this.page);
        await concateLoc.concate();
            await this.keywords.type(this.page,concateLoc.moduleSearchfield,moduleName,"Module Searchfield");
            await this.page.waitForTimeout(3000);
            await this.keywords.click(this.page,concateLoc.moduleSelect,"Module Searchfield");
            await expect(concateLoc.moduleTab).toBeVisible({timeout:5000});

        // await this.locators.moduleSearchfield.waitFor({ state: "visible", timeout: 10000 });
        // await this.locators.moduleSearchfield.clear({timeout:3000});
        // await this.locators.moduleSearchfield.type(moduleName,{timeout:3000});
    // Old code commented as per request
    // await concateLoc.moduleSelect.click({delay:5000});
    // await expect(concateLoc.moduleTab).toBeVisible({delay:5000});
    // await this.page.waitForTimeout(5000);
    // await concateLoc.moduleSelect.click();
    // Old code commented as per request
    // await expect(concateLoc.moduleTab).toBeVisible();
    // await expect(concateLoc.moduleTab).toBeVisible({ timeout: 5000 });
    }
}
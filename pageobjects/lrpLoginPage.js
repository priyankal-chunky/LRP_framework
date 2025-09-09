import {lrpLoginLocators} from "../pageobjects/lrpLocators/lrpLogin_Locators.js";
import {expect} from "@playwright/test";
import { timeout } from "../playwright.config.js";
import { keywords } from "../common/keywords.js";

export class lrpLogin{
    constructor(page){
        this.page=page;
        // this.locators=new lrpLoginLocators(this.page);
        this.keywords=new keywords(this.page);
    }

    async login(username,password){
        const locObj=new lrpLoginLocators(this.page);


        // Old code commented as per request
        // await expect(this.locators.loginPage).toBeVisible({timeout:3000});
        // await this.locators.usernameTextfield.fill(username);
        // await this.locators.passwordTextfield.fill(password);
        // await this.locators.loginButton.click();
        await expect(locObj.loginPage).toBeVisible({timeout:3000});
        await this.keywords.fill(this.page,locObj.usernameTextfield,username,"Username Textfield");
        await this.keywords.fill(this.page,locObj.passwordTextfield,password,"Password Textfield");
        await this.keywords.click(this.page,locObj.loginButton,"Login Button");
        await expect(locObj.homePageLogo).toBeVisible({timeout:10000});
       
    }
}

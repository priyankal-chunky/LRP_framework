import { expect } from "@playwright/test";
import { movementEntry_Locators } from "../pageobjects/lrpLocators/movementEntryLocators.js";
import { keywords } from "../common/keywords.js";
import { getValueByRowAndHeader } from '../utils/utils.js';
import { allure} from "allure-playwright";

export class moveEntry{
    constructor(page){
        this.page=page;
         this.keywords=new keywords(this.page);
    }

    async movementEntry(equipmentNo,activity,location,termDepot){
         let filePath="./testdata/TestData_EMS.xlsx";
         let sheetName="Movement_Entry_TS015";
         let expectedPopup= await getValueByRowAndHeader(filePath,sheetName,"Dataset1",11);
        const locObj=new movementEntry_Locators(this.page);
         
        // await expect(locObj.equipmentNoTextfield).toBeVisible({timeout:3000});

        await this.keywords.fill(this.page,locObj.equipmentNoTextfield,equipmentNo,"Equipment No Textfield");
        await this.keywords.type(this.page,locObj.activitySearchfield,activity,"Activity Searchfield");
        // await this.page.waitForTimeout(3000);
        // await this.keywords.waitForElement(this.page,locObj.autoSuggestOption,"Auto Suggest Option");
        await locObj.concate();
         await this.keywords.click(this.page,locObj.autoSuggestOption,"select Activity");

        // await this.page.keyboard.press('Enter');
        await this.keywords.click(this.page,locObj.showInputfieldsButton,"Show Inputfields Button");
        // await this.page.waitForTimeout(5000);
        // await expect(locObj.popupMessage).toBeVisible({timeout:3000});

        let actualConfirmPopup=await this.keywords.getText(this.page,locObj.popupMessage,"Popup Message");
        console.log("Popup Message Displayed:",actualConfirmPopup);

        await this.keywords.click(this.page,locObj.popupMessage_Yes_Button,"Popup Message Ok Button");
        // await expect(locObj.locationTextfield).toBeVisible({timeout:3000});
      

        await this.keywords.type(this.page,locObj.locationTextfield,location,"Location Textfield");
        // await this.page.waitForTimeout(3000);
        // await this.keywords.waitForElement(this.page,locObj.selectLocation,"Auto Suggest Option");
         await this.keywords.click(this.page,locObj.selectLocation,"Select Location ");
        // await this.page.keyboard.press('Enter');
        // await this.page.waitForTimeout(2000);

        // await this.keywords.waitForElement(this.page,locObj.termDepotTextfield,"Term Depot Textfield");
        await this.keywords.type(this.page,locObj.termDepotTextfield,termDepot,"Term Depot Textfield");

         await this.keywords.click(this.page,locObj.selectTermDepot,"Select Terminal Depot  ");

        // await this.page.waitForTimeout(3000);   
        // await this.page.keyboard.press('Enter');
        await this.keywords.click(this.page,locObj.sizeTypeDropdown,"Size Type Dropdown");
        // await this.page.waitForTimeout(3000);
       
        await this.keywords.click(this.page,locObj.sizeTypeSelect,"Select Size Type");
        // await this.page.waitForTimeout(3000);
        await this.keywords.click(this.page,locObj.saveButton,"Save Button");
        // await this.page.waitForTimeout(5000);
        let actualPopup=await this.keywords.getText(this.page,locObj.popupMessage,"Popup Message");
        console.log("Popup Message Displayed:",actualPopup);

        this.keywords=new keywords(this.page);        
          await allure.step(`Movement Entry Completed Successfully with pop up message : ${expectedPopup}`,async()=>{
            if(actualPopup === expectedPopup){
                console.log("Matched || Expected popup message:",expectedPopup +" || Actual popup message:",actualPopup);
                await this.keywords.logs(this.page,"Popup Verification",`Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`,false);
            }else{
                // console.log("Not Matched || Expected popup message:",expectedPopup +" || Actual popup message:",actualPopup);
                await this.keywords.logs(this.page,"Popup Verification",`Not Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`,true);
                throw new Error(`Not Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`);
            }
        })
        
    
        await this.keywords.click(this.page,locObj.popupMessage_Ok_Button,"Popup Message Ok Button");  
        return actualPopup; 
        // await this.page.waitForTimeout(5000);
        // let eqpID=await this.keywords.getAttribute(this.page,locObj.equipmentNoTextfield,"value","Equipment No Textfield");   
        // console.log("Movement Entry Completed Successfully for Equipment No:",eqpID); 
    }
}
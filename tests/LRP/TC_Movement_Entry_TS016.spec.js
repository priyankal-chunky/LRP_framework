import {test, expect} from "@playwright/test";
import { lrpLogin } from "../../pageobjects/lrpLoginPage.js";
import { lrpLoginLocators } from "../../pageobjects/lrpLocators/lrpLogin_Locators.js";
import { getCellValueByRowIdentifier, runTestByFlag} from '../../utils/utils.js';
import {movementEntry_Locators} from "../../pageobjects/lrpLocators/movementEntryLocators.js";

import {home} from "../../pageobjects/homePage.js";
import { keywords } from "../../common/keywords.js";
import { allure } from "allure-playwright";

const filePathExe = './testdata/TestExecutionLRP.xlsx';
const filePath="./testdata/TestData_EMS.xlsx";
const testNameExe="TC_Movement_Entry_TS_016";
const sheetName="Movement_Entry_TS015";
const sheetNameExe="LRP";


if(runTestByFlag(filePathExe, sheetNameExe, testNameExe)){
    test.describe(testNameExe, () => {

test('TC_Movement_Entry_TS_016', async({page})=>{
       
     let condition= await getCellValueByRowIdentifier(filePathExe, sheetNameExe, "Testcase ID", testNameExe,"Flag");
    console.log("TC_Movement_Entry_TS_016 Condition value is:",condition);
    
    let url= await getCellValueByRowIdentifier(filePathExe, sheetNameExe, "Testcase ID", testNameExe,"Environment");
    console.log("Navigating to URL",url);

        const keywordsObj=new keywords(page);
        await keywordsObj.gotoUrl(page,url,"LRP Application");
    
    let username = await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Username","Dataset1");
    let password = await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Password","Dataset1");
    let moduleName= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "ModuleMovementEntry","Dataset1");
    let equipmentNo= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "EquipmentNo","Dataset1");
    let activity= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "ActivityEqpEntry","Dataset1");
    let location= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Location","Dataset1");
    let termDepot= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "TermDepot","Dataset1");
    let expectedPopup = await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "SavedPopup","Dataset1");
    

   console.log("Username is:",username);
   console.log("Password is:",password);

    console.log("Login Testcase started");
    const loginObj=new lrpLogin(page);
   
    await loginObj.login(username,password);
    const loc=new lrpLoginLocators(page);
    
    // await expect(loc.homePageLogo).toBeVisible({timeout:10000});

    console.log("Module Name is:",moduleName);
   
    const homePageObj=new home(page);
    await homePageObj.moduleSearch(moduleName);
    
    const locObj = new movementEntry_Locators(page);
    const keyword = new keywords(page);
    
            await keyword.fill(page,locObj.equipmentNoTextfield,equipmentNo,"Equipment No Textfield");
            await keyword.type(page,locObj.activitySearchfield,activity,"Activity Searchfield");
            await locObj.concate();
            await keyword.click(page,locObj.autoSuggestOption,"select Activity");
            await keyword.click(page,locObj.showInputfieldsButton,"Show Inputfields Button");
            let actualConfirmPopup=await keyword.getText(page,locObj.popupMessage,"Popup Message");
            console.log("Popup Message Displayed:",actualConfirmPopup);
    
            await keyword.click(page,locObj.popupMessage_Yes_Button,"Popup Message Ok Button");
           
            await keyword.type(page,locObj.locationTextfield,location,"Location Textfield");
            await keyword.click(page,locObj.selectLocation,"Select Location ");
            await keyword.type(page,locObj.termDepotTextfield,termDepot,"Term Depot Textfield");
    
            await keyword.click(page,locObj.selectTermDepot,"Select Terminal Depot  ");
    
            await keyword.click(page,locObj.sizeTypeDropdown,"Size Type Dropdown");
           
            await keyword.click(page,locObj.sizeTypeSelect,"Select Size Type");
          
            await keyword.click(page,locObj.saveButton,"Save Button");
            
            let actualPopup=await keyword.getText(page,locObj.popupMessage,"Popup Message");
            console.log("Popup Message Displayed:",actualPopup);
    
                  
              await allure.step(`Movement Entry Completed Successfully with pop up message : ${expectedPopup}`,async()=>{
                if(actualPopup === expectedPopup){
                    console.log("Matched || Expected popup message:",expectedPopup +" || Actual popup message:",actualPopup);
                    await keyword.logs(page,"Popup Verification",`Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`,false);
                }else{
    
                    await keyword.logs(page,"Popup Verification",`Not Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`,true);
                    throw new Error(`Not Matched || Expected popup message:"${expectedPopup} || Actual popup message: "${actualPopup}`);
                }
            })
           
            await keyword.click(page,locObj.popupMessage_Ok_Button,"Popup Message Ok Button");  
            console.log("Saved Popup Message:",expectedPopup);
   
})
        });
} 

 
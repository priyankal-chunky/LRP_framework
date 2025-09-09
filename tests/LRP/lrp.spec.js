import {test, expect} from "@playwright/test";
import { lrpLogin } from "../../pageobjects/lrpLoginPage.js";
import { lrpLoginLocators } from "../../pageobjects/lrpLocators/lrpLogin_Locators.js";
import { runTestByFlag, getCellValueByRowIdentifier} from '../../utils/utils.js';
import {moveEntry} from "../../pageobjects/movementEntryPage.js";

import {home} from "../../pageobjects/homePage.js";
import { keywords } from "../../common/keywords.js";

const filePathExe = './testdata/TestExecutionLRP.xlsx';
const filePath="./testdata/TestData_EMS.xlsx";
let sheetNameExe="TC_Movement_Entry_TS_015";
const sheetName="Movement_Entry_TS015";


if(runTestByFlag(filePathExe, "LRP", sheetNameExe)){
    test.describe('LRP Movement Entry Test Suite', () => {

test('TC_Movement_Entry_TS_015',async({page})=>{
    let condition= await getCellValueByRowIdentifier(filePathExe, "LRP", "Testcase ID", sheetNameExe,"Flag");
    console.log("Condition value is:",condition);
    
    let url= await getCellValueByRowIdentifier(filePathExe, "LRP", "Testcase ID", sheetNameExe,"Environment");
    console.log("Navigating to URL",url);
    
    let username = await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Username","Dataset1");
    let password = await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Password","Dataset1");
    let moduleName= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "ModuleMovementEntry","Dataset1");
    let equipmentNo= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "EquipmentNo","Dataset1");
    let activity= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "ActivityEqpEntry","Dataset1");
    let location= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "Location","Dataset1");
    let termDepot= await getCellValueByRowIdentifier(filePath, sheetName, "TC_Movement_Entry_TS_015", "TermDepot","Dataset1");
    
   
        const keywordsObj=new keywords(page);
        await keywordsObj.gotoUrl(page,url,"LRP Application");

    
   console.log("Username is:",username);
   console.log("Password is:",password);

    console.log("Login Testcase started");
    const loginObj=new lrpLogin(page);
   
    await loginObj.login(username,password);
    const loc=new lrpLoginLocators(page);
    
    await expect(loc.homePageLogo).toBeVisible({timeout:10000});

    
    console.log("Module Name is:",moduleName);
    // const homeLoc=new homePageLocators(page);
    const homePageObj=new home(page);
    await homePageObj.moduleSearch(moduleName);

    // await page.waitForTimeout(5000);
   
    const movementEntryPageObj=new moveEntry(page);
    let savedPopup= await movementEntryPageObj.movementEntry(equipmentNo,activity,location,termDepot);
    console.log("Saved Popup Message:",savedPopup);
   

})
    });
}

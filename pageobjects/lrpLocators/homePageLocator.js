
import { getValueByRowAndHeader } from "../../utils/utils.js";
export class homePageLocators{



constructor(page){
    this.page=page;
  
    this.moduleSearchfield=page.locator("#nfr_topbar_autocomp_input");
    // this.moduleSelect=null;
    // this.moduleTab=null;
}

async concate(){
let filePath="./testdata/TestData_EMS.xlsx";
    let sheetName="Movement_Entry_TS015";

    let moduleName=await getValueByRowAndHeader(filePath,sheetName,"Dataset1",5);
    this.moduleSelect=this.page.locator(`li[data-item-label='${moduleName}']`);
    this.moduleTab=this.page.locator(`//li[contains(@title,'${moduleName}')]`);
}
}
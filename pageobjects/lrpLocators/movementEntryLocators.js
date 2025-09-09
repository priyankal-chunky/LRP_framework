import { getValueByRowAndHeader } from "../../utils/utils.js";
export class movementEntry_Locators{
    constructor(page){
        this.page=page;
      this.equipmentNoTextfield=page.locator("//input[@id='CGE-CGE_txtSinConNo']");
      this.activitySearchfield=page.locator("#CGE-CGE_txtSinActivity_input");
      this.showInputfieldsButton=page.locator("#CGE-CGE_btnSinShow");
      this.popupMessage=page.locator("//h2/following-sibling::span[not(@class)]");
      this.popupMessage_Ok_Button=page.locator("//h2/following-sibling::nav/button[text()='Ok']");
      this.popupMessage_Yes_Button=page.locator("//h2/following-sibling::nav/button[text()='Yes']");
      this.locationTextfield=page.locator("//input[@id='CGE-CGE_txtSinLocation2_input']");
      this.termDepotTextfield=page.locator("//input[@id='CGE-CGE_txtSinDepot_input']");
      this.sizeTypeDropdown=page.locator("#CGE-CGE_cmbSinSpec_label");
      this.saveButton=page.locator("//button[contains(@id,'btnsave')]");
      
    }

    async concate(){
    let filePath="./testdata/TestData_EMS.xlsx";
        let sheetName="Movement_Entry_TS015";
        let sizeType=await getValueByRowAndHeader(filePath,sheetName,"Dataset1",21);
         let activity=await getValueByRowAndHeader(filePath,sheetName,"Dataset1",7);
         let location= await getValueByRowAndHeader(filePath,sheetName,"Dataset1",14);
        let termDepot= await getValueByRowAndHeader(filePath,sheetName,"Dataset1",16);

        this.sizeTypeSelect=this.page.locator(`//ul[@id='CGE-CGE_cmbSinSpec_items']/li[text()='${sizeType}']`);
        this.autoSuggestOption=this.page.locator(`//div[contains(@class,'autocomplete-panel')]/table/tbody/tr/td/label[text()='${activity}']`);
        this.selectLocation=this.page.locator(`//div[contains(@class,'autocomplete-panel')]/table/tbody/tr/td/label[text()='${location}']`);
        this.selectTermDepot=this.page.locator(`//div[contains(@class,'autocomplete-panel')]/table/tbody/tr/td[text()='${termDepot}']`);
    }
}
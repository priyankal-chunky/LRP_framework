export class lrpLoginLocators {

    constructor(page){
        this.page = page;
        this.loginPage=page.locator("div[class='nfr_login_sec']");
        this.usernameTextfield=page.locator("#nfr_login_authname");
        this.passwordTextfield=page.locator("#nfr_login_authid");
        this.loginButton=page.locator("#nfr_login_btnlogin");
        this.homePageLogo=page.locator("#nfr_dashboard_li");
    }
}
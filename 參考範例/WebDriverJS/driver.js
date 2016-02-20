var webdriver = require('selenium-webdriver')
var driver = new webdriver.Builder().forBrowser('chrome').build();
driver.get('http://www.google.com.tw')
driver.findElement({ id: 'lst-ib' }).sendKeys('Hello World' + webdriver.Key.ENTER);
// driver.close();

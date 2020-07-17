const puppeteer = require('puppeteer');
let fs = require('fs');
let browser;
let page;
let username = "backend exploit";
let _accSync = 0;
let acc = [];

async function addFollow(username) {
    if(browser == undefined) {
        browser = await puppeteer.launch({
            headless: true
        });
        page = await browser.newPage();
    }
    page.setUserAgent('Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3571.0 Mobile Safari/537.36');
    await delay(5500);
    page.goto(`https://account.xbox.com/en-us/profile?gamertag=${username}`);
    let elem = "#i0116";
    _Login(elem);
}

async function _Login(elem) {
    let accFound = acc[_accSync];
    if(accFound != undefined && accFound && "undefined" && accFound != null) {
        await page.waitForSelector(elem);
        await page.focus('#i0116');
        await page.keyboard.type(acc[_accSync].username);
        await page.$eval( '#idSIButton9', form => form.click() );
        await page.focus('#i0118');
        await page.keyboard.type(acc[_accSync].password);
        await delay(1000);
        await page.keyboard.press('Enter');
        await _addFriend("#addfriendactionbutton");
    } else {
        await delay(2500);
        await browser.close();
    }
}

async function _addFriend(elem) {
    try {
        await page.waitForSelector(elem, { timeout: 10000 });
        await page.$eval(elem, btn => btn.click() );
        await delay(2500);
        await page.goto('https://account.xbox.com/account/onerf/signout');
        _accSync++;
        await addFollow(username);
    } catch(err) {
        console.log(err.message);
        await delay(2500);
        await page.goto('https://account.xbox.com/account/onerf/signout');
        _accSync++;
        await addFollow(username);
        //await browser.close();
    }
}

function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
 }


async function readLines() {
    var array = fs.readFileSync('accounts.txt').toString().split("\n");
    for(let i in array) {
        let split = array[i].split(":");
        acc.push( { "username": split[0], "password": split[1].replace("\r", "") });
    }
    await addFollow(username);
}

readLines();

//addFollow(username);
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    // await page.goto('https://kyfw.12306.cn/otn/leftTicket/query?leftTicketDTO.train_date=2020-10-05&leftTicketDTO.from_station=GZQ&leftTicketDTO.to_station=SZQ&purpose_codes=ADULT');
    await page.goto('https://www.12306.cn/index/');
    await page.on('response', res => {
        if(res._headers['content-type'] === 'application/json;charset=UTF-8'){
            res.text().then(r => {
                console.log(res.url() ,r);
            });
        }
    });
    // await browser.close();
})();
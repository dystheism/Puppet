'use strict';

let browser = null;
const puppeteer = require('puppeteer-extra');
puppeteer.use(require('puppeteer-extra-plugin-anonymize-ua')({ makeWindows: true }));
const pluginStealth = require("puppeteer-extra-plugin-stealth");
puppeteer.use(pluginStealth());

let credentials = {
    username: 'testuser33423',
    password: 'password3423423'
};

let searchDivs = null;

export function login(cb) {
    (async () => {
        if (!browser) browser = await puppeteer.launch({headless: true, slowMo:10, defaultViewport: null});
        const page = await browser.newPage();
        await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' });

        await page.setViewport({
            width: 920,
            height: 783
        });
        await page.goto('https://www.reddit.com/login/', {waitUntil: 'networkidle2'});

        await page.screenshot({path: 'login.png'});

        if (await page.$('#loginUsername') !== null) {
            console.log('logging in');
            await page.focus('#loginUsername');
            await page.keyboard.type(credentials.username, {
                delay: 100
            });
            await page.focus('#loginPassword');
            await page.keyboard.type(credentials.password, {
                delay: 100
            });

            await page.click('button[type="submit"]');

            //await page.waitFor(8000);
        } else {
            console.log('already logged in');
        }

        //await page.goto('https://www.reddit.com/r/asktransgender', {waitUntil: 'networkidle2'});

        await page.screenshot({path: 'after.png'});

        console.log('done');

        return cb(null, 'success');
    })();
}

export function post(cb) {
    (async () => {
        if (browser) {
            const page = await browser.newPage();
            await page.setExtraHTTPHeaders({'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'});

            await page.goto('https://www.reddit.com/r/test/', {waitUntil: 'networkidle2'});

            await page.screenshot({path: 'posting_started.png'});

            // Click create a post.
            await page.evaluate( () =>
            {
                Array.from( document.querySelectorAll(
                    'button'
                ) ).filter( element => element.getAttribute('aria-label') === 'Create Post' )[0].click();

            });

            //await page.waitFor(3000);

            await page.waitForFunction("Array.from(document.querySelectorAll('textarea')).filter(element => element.placeholder === 'Title')[0]");

            // Add post title.
            await page.evaluate( () =>
            {
                let temp = Array.from( document.querySelectorAll(
                    'textarea'
                )).filter( element => element.placeholder === 'Title' )[0];
                temp.id = 'temp_1';
            });
            await page.type('#temp_1', 'hello world');

            // Add post message.
            await page.evaluate( () =>
            {
                let temp = Array.from( document.querySelectorAll(
                    'div'
                )).filter( element => element.getAttribute('role') === 'textbox')[0];
                temp.id = 'temp_2'
            });
            await page.type('#temp_2', 'example post...');

            // Click post.
            await page.evaluate( () =>
            {
                let temp = Array.from( document.querySelectorAll(
                    'button'
                )).filter( element => element.innerHTML.includes('Post') && !element.innerHTML.includes('svg'))[0];
                temp.id = 'temp_3';
            });

            await page.click('#temp_3');

            await page.waitFor(4000);

            // Check if post went through.
            await page.evaluate( () =>
            {
                let temp = Array.from( document.querySelectorAll(
                    'span'
                )).filter( element => element.innerText.includes('you are doing that too much. try again'));
                if (temp.length > 0) {
                    temp[0].id = 'temp_4';
                }
            });

            try {
                await page.waitForSelector('#temp_4', {
                    timeout: 5000
                });
                console.log('post error: reddit try again later after waiting message');

            } catch(error) {
                console.log('post complete');
            }

            await page.screenshot({path: 'post_complete.png'});

            //console.log('post complete');


            return cb(null, 'success');
        } else {
            login(function(err, message) {
                if (err) {
                    return cb(null, 'failure');
                } else {
                    this.post(function(err, message) {
                        if (err) {
                            return cb(null, 'failure');
                        } else {
                            return cb(null, 'success');
                        }
                    })
                }
            });
        }
    })();
};

// export function shutdown(cb) {
//     (async () => {
//         await browser.close();
//         await browser = null;
//         return cb(false, 'success');
//     })();
// }

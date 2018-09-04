"use strict";

const fs = require('fs');
const path = require('path');
const randomatic = require('randomatic');
const scrape = require('website-scraper');
const puppeteer = require('puppeteer');
const md5File = require('md5-file');
const archiver = require('archiver');


class Scraper {

    async run(name, url, save_dir) {
        let image_path = await this.saveScreenshot(url, path.join(save_dir, name));
//        await this.download(url, path.join(save_dir, name));

        let image_hash = md5File.sync(image_path);

        return {
            url: url,
            name: name,
            image_path: image_path,
            image_hash: image_hash
        };
    }

    async saveScreenshot(url, name) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setViewport({"width":1920,"height":1080});
            await page.goto(url);
            await page.waitFor(3000);
            let filename = name + '.png';
            await page.screenshot({path: filename, fullPage: true});
            await browser.close();

            return filename;
        }
        catch(e) {
            console.log(e);
        }
    }

    async download(url, dir) {
        const options = {
            urls: [url],
            directory: dir,
        };

        await scrape(options);
        const output = fs.createWriteStream(dir + '.zip');
        const archive = archiver('zip', {
            zlib: {level: 9}
        });
        archive.pipe(output);
        archive.directory(dir, false);
        archive.finalize();

        //todo rm directory

    }
}

module.exports = Scraper;
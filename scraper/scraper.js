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
        let archive_path = await Scraper.saveZip(url, path.join(save_dir, name));
        let data = await Scraper.saveScreen(url, path.join(save_dir, name));
        let image_hash = md5File.sync(data['img']);
        let archive_hash = md5File.sync(archive_path);
        let pdf_hash = md5File.sync(data['pdf']);

        return {
            url: url,
            name: name,
            image_path: data['img'],
            pdf_path: data['pdf'],
            archive_path: archive_path,
            image_hash: image_hash,
            pdf_hash: pdf_hash,
            archive_hash: archive_hash,
        };
    }

    static async saveScreen(url, name) {
        try {
            const browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage();
            await page.setViewport({'width': 1920, 'height': 1080});
            await page.goto(url);
            await page.waitFor(4000);
            let img_filename = name + '.png';
            let pdf_filename = name + '.pdf';
            await page.screenshot({path: img_filename, fullPage: true});
            await page.pdf({
                path: pdf_filename,
                printBackground: true,
                margin: {top: 0, bottom: 0, left: 0, right: 0}
            });
            await browser.close();

            return {pdf: pdf_filename, img: img_filename};
        }
        catch(e) {
            console.log(e);
        }
    }

    static async saveZip(url, dir) {
        const options = {
            urls: [url],
            directory: dir,
        };

        await scrape(options);
        const filename = dir + '.zip';
        const output = fs.createWriteStream(filename);
        const archive = archiver('zip', {
            zlib: {level: 9}
        });
        archive.pipe(output);
        archive.directory(dir, false);
        archive.finalize();

        //todo rm directory

        return filename;
    }
}

module.exports = Scraper;
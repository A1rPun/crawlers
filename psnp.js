#!/usr/bin/env node

/**
 *
 * Usage:
 *  1. $ npm install
 *  2. $ node crawler.js
 *
 */

const Crawler = require('crawler');
const fs = require('fs');

const user = 'A1rPun';
const getUrl = (user, page) => ({
  uri: `https://psnprofiles.com/${user}?ajax=1&completion=all&order=last-played&pf=all&page=${page}`,
});
const outputFile = `${__dirname}/output.txt`;
// TODO: Scrape amount of pages (amount of Math.ceil(trophies / 1000))
const pages = [
  getUrl(user, 1),
  getUrl(user, 2),
  getUrl(user, 3),
  getUrl(user, 4),
];
let entities = [];

const psnp = new Crawler({
  jQuery: false,
  callback: function(error, { body }, done) {
    if (error) {
      console.log(error);
    } else {
      actualCrawler.queue({
        html: body,
      });
    }
    done();
  },
});

const actualCrawler = new Crawler({
  callback: function(error, { $, body }, done) {
    if (error) {
      console.log(error);
    } else {
      const html = JSON.parse(body).html;
      $(html).each(function(i) {
        const title = $(this)
          .find('.title')
          .text();
        if (title) entities.push(title);
      });
    }
    done();
  },
});

psnp.queue(pages);

psnp.on('drain', function() {
  console.log(`Done processing ${entities.length} entities`);
});

actualCrawler.on('drain', function() {
  fs.createWriteStream(outputFile).write(JSON.stringify(entities, null, 2));
  console.log(`Done processing ${entities.length} entities ACTUAL`);
});

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');


const domain = 'https://www.fxstreet.com';
let links = [];

function scrapUrl(url){
    axios(domain)
        .then(response => {
            let linksSize = links.length;
            const html = response.data;
            const $ = cheerio.load(html);
            $('a').each(function () {
                let href = this.attribs.href;
                if (href.startsWith("/")) {
                    href = domain + href;
                }
                if (href.startsWith(domain)) {
                    if (!links.includes(href)){
                        links.push(href);
                    }
                }
                console.log(href);
            });
            if (links.length > linksSize){
                links.forEach(function (element) {
                    scrapUrl(element)
                });
            }
        })
        .catch(console.error);
}
scrapUrl(domain);

fs.exists('myjsonfile.json', function (exists) {

    if (exists) {

        console.log("yes file exists");

        fs.readFile('myjsonfile.json', function readFileCallback(err, data) {

            if (err) {
                console.log(err);
            } else {
                
                obj = JSON.parse(data);

                links.forEach(function (value) {
                    console.log(value);
                    obj.links.push(value);
                });


                let json = JSON.stringify(obj);
                fs.writeFile('myjsonfile.json', json, 'utf8', function () { });
            }
        });
    } else {

        console.log("file not exists");

        let obj = {
            links: []
        }

        links.forEach(function (value) {
            console.log(value);
            obj.links.push(value);
        });


        let json = JSON.stringify(obj);
        fs.writeFile('myjsonfile.json', json, 'utf8', function(){});
    }
});
const puppeteer = require('puppeteer');
const fs = require('fs');

exports.ConvertToPDF = async function (options) {
    // parsing whole options once so no need to do again for each params
    options = this.parse(options);

    // pdf file path
    var filePath = __dirname + '/../../../' + options.folderName + '/' + options.fileName + '.pdf';

    var folderPath = __dirname + '/../../../' + options.folderName;
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }

    const pdfOptions = {
        path: filePath, // pdf file path
        printBackground: true // will display background colors also
    };

    // pdf paper size and custom width height, we are taking unit as mm
    var pageSize = (options.paperSize == '') ? 'A4' : options.paperSize; // if null then paper is A4 by default
    if (pageSize == 'Custom') { // if custom then custom height weight of paper
        pdfOptions.width = options.pageWidth + 'mm';
        pdfOptions.height = options.pageHeight + 'mm';
    }
    else {
        pdfOptions.format = pageSize;
    }

    // pdf header footer template
    // NOTE: Pupperteer applies their own padding to header and footers. Style tags below remove/override that.
    if (options.headerHTML != '' || options.footerHTML != '') { // checking if header or footer is not empty
        pdfOptions.displayHeaderFooter = true; // this flag will set header footer seperate on the paper

        if (options.headerHTML != '') { // if header template exist
            if (options.headerMargin != '') {
                pdfOptions.headerTemplate = '<style>#header { padding-top: ' + options.headerMargin + 'mm !important;}</style>' + options.headerHTML;
            }
            else {
                pdfOptions.headerTemplate = '<style>#header { padding: 0 !important; }</style>' + options.headerHTML; // if header margin is not specified then removing default header padding
            }
        }
        if (options.headerHTML != '') { // if footer template exist
            if (options.footerMargin != '') {
                pdfOptions.footerTemplate = '<style>#footer { padding-bottom: ' + options.footerMargin + 'mm !important;}</style>' + options.footerHTML;
            }
            else {
                pdfOptions.footerTemplate = '<style>#footer { padding-bottom: 0 !important;}</style>' + options.footerHTML;
            }
        }
    }

    // pdf page orientation, default is portrait. L => Landscape, P => Portrait
    if (options.orientation == 'L') {
        pdfOptions.landscape = true;
    }

    // pdf page custom margin, unit as mm
    if (options.bodyMarginLeft != '' || options.bodyMarginRight != '' || options.bodyMarginTop != '' || options.bodyMarginBottom != '') {
        pdfOptions.margin = {
            left: options.bodyMarginLeft + 'mm', // page left margin
            top: options.bodyMarginTop + 'mm',  // page top margin
            right: options.bodyMarginRight + 'mm',  // page right margin
            bottom: options.bodyMarginBottom + 'mm' // page bottom margin
        };
    }

    // removing default padding and margin from body applied by Pupperteer
    var html = '<style>body { padding: 0 !important; margin: 0 !important}</style>' + options.bodyHTML; // main body html

    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const page = await browser.newPage(); // adding a new page

    // waiting for dom to load complete html
    await page.setContent(html, {
        waitUntill: 'networkidle2'
    });
    // hack to allow web fonts to load correctly
    await page.screenshot();

    // generate and save pdf output
    await page.pdf(pdfOptions);
    await browser.close();

    var response = {};
    response.FilePath = '/' + options.folderName + '/' + options.fileName + '.pdf';
    response.FileName = options.fileName + '.pdf';
    return response;
}
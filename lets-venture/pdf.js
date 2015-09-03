'use strict';
const Pdf = require('pdfkit');
const fs = require('fs');
const FILE_NAME = 'Dictionary.pdf';
module.exports = function(object) {
	var myDoc = new Pdf();
	myDoc.font('Times-Roman').fontSize(20).text('Favourites');
	myDoc.font('Times-Roman').fontSize(15);
	myDoc.pipe(fs.createWriteStream(FILE_NAME));
	for (var word in object) {
		if (object.hasOwnProperty(word)) {
			myDoc.text(word+': '+object[word]);
		}
		
	}
	console.log('PDF created.');
	myDoc.end();
	return './'+FILE_NAME;
};
const fs = require('fs');
const path = require('path');
const readWay = path.join(__dirname, 'text.txt');

const newReadStream = fs.createReadStream(readWay, {encoding: 'utf-8'});

newReadStream.on('data', (elem) => {
    console.log(elem.trim());
});
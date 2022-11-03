const fs = require('fs');
const path = require('path');
const pathAnswer = path.join('02-write-file', 'text.txt');
let info;
const {stdin} = require('process');
const newReadStream = fs.createReadStream(__filename);

newReadStream.on('open', () => {

    fs.open(path.join(__dirname, 'text.txt'), 'w', (err) => {
        if (err) throw err;
        console.log('Hi! Enter your text...');

    });
    stdin.on('data', (data) => {
        info = data.toString().trim();

        let exit = () => {
            console.log('Exit? OK! The end.');
            process.exit();                                //метод для выхода из цикла
        };
        if (info === 'exit') {
            exit();
        };
        fs.appendFile(pathAnswer, info + '\n', (err) => {
            if (err) throw err;
            process.on('SIGINT', exit);
        });
    })
});

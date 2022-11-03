const fs = require('fs');   //расширение д/работы с файловой системой*/
const path = require('path'); //расширения д/работы с путями
const dirNamePath = path.join(__dirname, 'secret-folder');
const newStream = fs.createReadStream(__filename);


newStream.on('open', function () {

    fs.readdir(dirNamePath, (err, data) => {

        data.forEach(elem => {

            let fileName = path.join(__dirname, 'secret-folder', `${elem}`);

            fs.stat(fileName, (err, stats) => {
                if (err) throw err;
                if (stats.isFile() == true) {
                    console.log(`${elem.split('.').slice(0, 1)} - ${((path.extname(elem)).slice(1))} - ${Math.ceil((stats.size) / 1000)} kb`);
                }
            });
        });
    });
});
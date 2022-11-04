

const fs = require('fs');   
const path = require('path'); 
const newStream = fs.createReadStream(__filename);
const filesCopy = path.join(__dirname, 'files-copy');
const filesName = path.join(__dirname, 'files');
const promises = fs.promises;

newStream.on('open', function createFolder() {

    fs.stat(filesCopy, (err, stats) => {
        if (!err) {
            fs.rm(filesCopy, { recursive: true }, (err) => {
                if (err) throw err;
                return createFolder();                             
            });
        }
        else {
            promises.mkdir(filesCopy).then(() => {            
                fs.readdir(filesName, (err, files) => {     
                    if (err) throw err;
                    files.forEach(elem => {
                        fs.copyFile(path.join(filesName, `${elem}`), (path.join(filesCopy, `${elem}`)), (err) => {
                            if (err) throw err;
                        });
                    })
                });
            }).catch( () => {
                console.log('Directory  is not created');
            });
        }
    });
});
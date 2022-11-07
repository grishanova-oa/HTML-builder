const fs = require('fs');
const path = require('path'); 
const {readdir,copyFile} = require('fs/promises');
// ---from---
const pathToTemplate = path.join(__dirname, 'template.html');
const pathToStyles = path.join(__dirname,'styles');
const pathToAssets = path.join(__dirname, 'assets');

// ---to---
const pathToProjectDist = path.join(__dirname, 'project-dist'); 
const pathPackageIndex = path.join(pathToProjectDist, 'index.html');
const pathPackageStyles = path.join(pathToProjectDist, 'style.css');
const pathPackageAssets =  path.join(pathToProjectDist, 'assets');

const pathToComponents = path.join(__dirname, 'components');
const readingStreamTemp = fs.createReadStream(pathToTemplate, 'utf-8');
const newWriteStream = fs.createWriteStream(pathPackageIndex);


fs.mkdir(pathToProjectDist, {recursive: true}, (err)=>{
  if(err) console.log(err);
});

fs.open(path.join(pathToProjectDist, 'index.html'), 'w', (err) => {
  if (err) throw err;
});
fs.open(path.join(pathToProjectDist, 'style.css'), 'w', (err) => {
  if (err) throw err;
});

readingStreamTemp.pipe(newWriteStream);
let templateData = [];

readingStreamTemp.on('data',(slice) => {
  templateData.push(slice); 
});

let objectDataComponents = {};
let arrayNameComponents = [];

readingStreamTemp.on('end', async () => {
  fs.readdir(pathToComponents, (err, files) => {
    if (err) console.log(err);

    let dataComponent;

    files.forEach(name => {
      if (path.extname(name) === '.html') {
        arrayNameComponents.push(path.basename(name, path.extname(name)));
        dataComponent = fs.createReadStream(path.join(pathToComponents, name)); 
        dataComponent.on('data', (slice) => {
          if (objectDataComponents[name]) {
            objectDataComponents[name] += slice.toString();
          } else {
            objectDataComponents[name] = slice.toString();
          }

        });
      };
    });
    dataComponent.on('end', () => {
      includeComponents();
    });
  });
});

function includeComponents() {
  let indexName = {};

  templateData.join('').split('\r\n').forEach((element, index) => {
    arrayNameComponents.forEach(fileName => {
      if (element.search(fileName) != -1) {
        indexName[`${fileName}`] = index;
      } 
    });
  });

  templateData = templateData.join('').split('\r\n');

  for (let key in indexName) {
    if (objectDataComponents[`${key}.html`]) {
      templateData.splice(+indexName[key], 1, objectDataComponents[`${key}.html`]);
    }
  }
  templateData = templateData.join('\r\n');

  fs.writeFile(pathPackageIndex, templateData, (err) => {
    if(err)  throw err;
  });
}

let arrayFileNames = [];
let package = [];

readdir(pathToStyles, { withFileTypes: true })
  .then((dirent) => {
    dirent.forEach(file => {
      if (path.extname(file.name) === '.css') {
        arrayFileNames.push(file.name);
      }
    });
  })
  .then(() => {
    arrayFileNames.forEach(async (fileName, index) => {

      const stream = fs.createReadStream(path.join(pathToStyles, fileName));
      let dataFile;

      await stream.on('data', async (data) => {

        dataFile = data;

        stream.on('close', async () => {
          await package.push(dataFile);
          let stringBundle = await package.join('').toString();

          await fs.writeFile(pathPackageStyles, stringBundle, (err) => {
            if (err) console.log(err);
          });
        });
      });
    });
  });

async function copyAssets () {
  fs.stat(pathToAssets, (err) => {
    if(err) throw err;
    fs.rm(pathPackageAssets, {recursive: true}, ()=>{
      fs.mkdir(pathPackageAssets, {recursive: true}, (err)=>{
        if (err) return err;
      });

      function recursive(pathFolder = pathToAssets, pathCopyFolder = pathPackageAssets) {
        fs.stat(pathFolder, (err) => {
          if(err) throw console.log(err);
          readdir(pathFolder, { withFileTypes: true })
            .then((dirent) => {
              dirent.forEach((element) => {
                if(element.isFile()) {
                  copyFile(path.join(pathFolder, element.name), path.join(pathCopyFolder, element.name));
                } else {
                  fs.mkdir(path.join(pathCopyFolder, `${element.name}`), { recursive: true }, (err) => {
                    if (err) return err;
                  });
                  recursive(path.join(pathFolder, `${element.name}`), path.join(pathCopyFolder, `${element.name}`));
                }
              });
            });
        });
      }
      recursive();
    });
  });
}
copyAssets();
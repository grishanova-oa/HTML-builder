
const fs = require('fs');
const path = require('path');
let element = '';

let fileBundle = fs.createWriteStream(path.join(__dirname, 'project-dist','bundle.css'));
fs.readdir(path.join(__dirname, 'styles'), (err, data)=>{
  if(err) throw err;
  data.forEach(file => {
    if(path.extname(file).slice(1) === 'css') {      
      let flow = fs.createReadStream(path.join(__dirname, 'styles', file), 'utf-8');
      flow.on('data', chunk => element += chunk); 
      flow.on('end', () => {
        element += '\n';
        fileBundle.write(element);   
        element = '';     
      });
      flow.on('error', error => console.log('error ', error.message));                
    }   
  });     
});
const express = require('express');
const path = require('path');
const router = express.Router();
const fs = require('fs');
const formidable = require('formidable');
const uuid = require('uuid/v4');

// Prevent 403 error due to directory traversal
const uploadPath = path.resolve(__dirname + '/../uploads/');

// Displays the upload form
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Dropzone Image Sharing' });
});

function generateFolderId() {
  const id = uuid().replace(/-/g, "").substring(0, 16);
  const folderPath = path.join(uploadPath, id);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    return id;
  } else {
    return generateFolder();
  }
}


// Handle storage of uploaded files
router.post('/upload', (req, res, next) => {
  let error = false;
  let fileCount = 1;
  const form = new formidable.IncomingForm();
  const folderId = generateFolderId();
  const folderPath = path.join(uploadPath, folderId);

  form.parse(req);
  form.on('file', function(field, file) {
    const newFileName = fileCount + path.extname(file.name);
    const newLocation = path.join(folderPath, newFileName);
    fs.renameSync(file.path, newLocation);
    fileCount++;
  });
  
  res.status(200).send({ error, folderId });
});

// Return a single file
router.get('/:uuid', (req, res, next) => {
  const folder = req.params.uuid;
  const folderLocation = path.join(uploadPath, folder);
  if (!fs.existsSync(folderLocation)) {
    res.sendStatus(404);
    return;
  }

  fs.readdir(folderLocation, function(err, files) {
    console.log(files);
    res.render('album', { files , folder });
  });
});

router.get('/:uuid/:file', (req, res, next) => {
  const folder = req.params.uuid;
  const fileName = req.params.file;

  const fileLocation = path.join(uploadPath, folder, fileName);
  res.sendFile(fileLocation);
});

module.exports = router;
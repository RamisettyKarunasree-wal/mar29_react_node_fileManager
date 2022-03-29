const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
router.post('/createFile', (req, res) => {
  const { filename, fileContent } = req.body;
  filepath = path.join(__dirname, '../files', filename);
  fs.writeFile(filepath, fileContent, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.send(`file with name ${filename} is created/modified at ${filepath}`);
    }
  });
});
router.get('/readFile/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../files', req.params.filename);
  console.log(filepath);
  if (fs.existsSync(filepath)) {
    if (fs.lstatSync(filepath).isDirectory()) {
      res.json({ status: 0, data: 'Unable to modify a directory' });
    } else {
      let content = fs.createReadStream(filepath);
      content.pipe(res);
    }
  } else {
    res.json({ status: 0, data: "File doesn't exists" });
  }
});
router.post('/createDirectory/:foldername', (req, res) => {
  folderpath = path.join(__dirname, '../files', req.params.foldername);
  fs.mkdir(folderpath, (err) => {
    if (err) {
      res.json(err);
    } else {
      res.send(
        `folder with name ${req.params.foldername} is created at ${folderpath}`
      );
    }
  });
});
router.get('/readDirectory', (req, res) => {
  folderpath = path.join(__dirname, '../files');
  fs.readdir(folderpath, (err, files) => {
    if (err) {
      res.json(err);
    } else {
      res.send(files);
    }
  });
});
router.delete('/deleteFile/:filename', (req, res) => {
  const filepath = path.join(__dirname, '../files', req.params.filename);
  if (fs.lstatSync(filepath).isDirectory()) {
    res.json({ status: 0, data: 'unable to delete a directory' });
  } else {
    fs.unlink(filepath, (err) => {
      if (err) {
        res.json(err);
      } else {
        res.send(`file ${req.params.filename} is deleted`);
      }
    });
  }
});
module.exports = router;

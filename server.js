var http = require('http');
var path = require('path');
var fs = require('fs');

var express = require('express');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

var router = express();
var server = http.createServer(router);

const GALLERY_FOLDER = './SharedData/gallery';
const DATA_FILE = './SharedData/story-data.json';

var story = {};
var storyWatcher;
var galleryWatcher;
var lastRename = 0;

// Middleware
router.use(fileUpload());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Static content
router.use(express.static(path.resolve(__dirname, 'SharedData')));
router.use(express.static(path.resolve(__dirname, 'StoryEditor')));
router.use(express.static(path.resolve(__dirname, 'VisualNovel')));
router.use(express.static(path.resolve(__dirname, 'Credits')));

// Services
router.post('/upload/:type', function(req, res) {
  req.files.imageFile.mv(`${GALLERY_FOLDER}/${req.params.type}/${req.files.imageFile.name}`, function(err) {
    if (err) {
      console.error(err);
      return res.redirect('/editor/editor.html');
    }
    res.redirect('/editor/editor.html');
  });
});

router.delete('/gallery/:type/:file', function(req, res) {
  fs.unlink(`${GALLERY_FOLDER}/${req.params.type}/${req.params.file}`, function(err) {
    if (err) {
      console.error(err);
      res.status(400).end();
      return;
    }
    res.end();
  });
});

router.get('/gallery', function(req, res) {
  var bgFiles = fs.readdirSync(`${GALLERY_FOLDER}/background`);
  var charFiles = fs.readdirSync(`${GALLERY_FOLDER}/character`);
  res.json({ background: bgFiles, character: charFiles });
}); 

router.get('/data', function(req, res) {
  res.json(story);
}); 

router.get('/download', function(req, res) {
  res.download(DATA_FILE,'story-data.json');
}); 

router.post('/cover', function(req, res) {
  // Update cover image
  story.cover.background = req.body.background;
  story.cover.next = req.body.next;

  saveStory(story);
  res.json(story);
}); 

router.post('/addPage', function(req, res) {
  handleAdd(req, res, story.pages);
}); 

router.post('/addChoice', function(req, res) {
  handleAdd(req, res, story.choices);
}); 

router.post('/addSide', function(req, res) {
  handleAdd(req, res, story.sides);
}); 

router.post('/updatePage', function(req, res) {
  handleUpdate(req, res, story.pages);
}); 

router.post('/updateChoice', function(req, res) {
  handleUpdate(req, res, story.choices);
}); 

router.post('/updateSide', function(req, res) {
  handleUpdate(req, res, story.sides);
}); 

router.post('/addAction', function(req, res) {
  handleActions(req, res, "add", story.pages);
}); 

router.post('/removeAction', function(req, res) {
  handleActions(req, res, "remove", story.pages);
}); 


function saveStory(storydata) {
  stopStoryWatcher();
  fs.writeFileSync(DATA_FILE, JSON.stringify(storydata, null, '  '));
  setupStoryWatcher();
}

function loadStory() {
  story = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  setupStoryWatcher();
}

function idExists(id) {
  return (story.pages[id] !== undefined || story.choices[id] !== undefined || story.sides[id] !== undefined);
}

function handleAdd(req, res, section) {
  var newStory = req.body;

  // Validate story content
  if (!newStory) {
    res.status(400).end();
    
  } else {
    var storyId = newStory.id;

    // Check for conflicting story id
    if (idExists(storyId)) {
      res.status(409).end();
    
    } else {
      if (newStory.text != undefined) {
        newStory.text = newStory.text.length > 0 ? newStory.text.split('\n\n').map(c=>c.trim()) : [];
      }
      
      // Ok to add new page
      section[storyId] = newStory;
      saveStory(story);
      
      res.json(story);
    }
  }
}

function handleUpdate(req, res, section) {
  var updateStory = req.body;

  if (!updateStory) {
    res.status(400).end();
  
  } else {
    var storyId = updateStory.id;

    if (!idExists(storyId)) {
      res.status(404).end();
      
    } else {
      if (updateStory.text != undefined) {
        updateStory.text = updateStory.text.length > 0 ? updateStory.text.split('\n\n').map(c=>c.trim()) : [];
      }

      // Keep actions
      updateStory.actions = (section[storyId].actions || []);

      // Ok to save page update
      section[storyId] = updateStory;
      saveStory(story);
      
      res.json(story);
    }
  }
}

function handleActions(req, res, mode, section) {
  var action = req.body;
  if (!action) {
    res.status(400).end();
  
  } else {
    var storyId = action.id;
    delete action.id;

    if (!idExists(storyId)) {
      res.status(404).end();
      
    } else {
      // Ok to save page actions update
      if (mode === "add") {
        section[storyId].actions = (section[storyId].actions || []).concat(action);
      } else if (mode === "remove" && section[storyId].actions) {
        section[storyId].actions.splice(action.position,1);
      } else {action
        res.status(400).end();
        return;
      }
      saveStory(story);
      
      res.json(story);
    }
  }
}

function stopStoryWatcher() {
    if (storyWatcher) {
      storyWatcher.close();
    }
}

function setupStoryWatcher() {
  storyWatcher = fs.watch(DATA_FILE, (eventType, filename) => {
    storyWatcher.close();
    loadStory();
  });
}

function setupGalleryWatcher() {
  galleryWatcher = fs.watch(`${GALLERY_FOLDER}/background`, (eventType, filename) => {
    var now = new Date();
    console.log(`${eventType} ${filename} after ${now-lastRename}ms`);
    lastRename = now;
  });
}

// Get started
server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0", function() {
  loadStory();
  setupGalleryWatcher();
  var addr = server.address();
  console.log("Story Reader / Editor listening at", addr.address + ":" + addr.port);
});

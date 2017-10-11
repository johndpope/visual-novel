# OUA BITS The Fifth Door - Visual Novel Project

The project includes two packaged applications.

1. The Story Reader is a set of static web files (SPA) driven by a JSON story data file
2. The Story Editor is a REST API and User Interface (SPA) facilitating story data file creation

## Organisation

- / 		Contains the NodeJS package.json and main server.js files (as well as read me in markdown and text formats)
- /VisualNovel 	Contains the visual novel application (index.html redirects to story.html) and related css/js/image folders
- /StoryEditor	Conatins editor folder with editor.html and related css/js/image folders
- /SharedData	Contains the story-data.json file and gallery folder of all character and background images (editor writes, novel reads)
- /Credits	Contains the credits.html with related css/images folder (page fades via CSS animation tecnique)

## Setup and Run

```
> npm install
> npm start (or Run via C9 IDE)

```

# Using

To accomodate and serve both applications this application runs as a NodeJS Express application.

1. The Story Reader is served from: /story.html
2. The Story Editor is served from: /editor/editor.html

## Story Reader

The Story Reader application provides the following features:

- __Cover Page__ (mouse click to start story)
- __Narration Pages__ (scroll text paragraphs using mouse clicks or up/down arrow key)
- __Decision Pages__ (option A/B via mouse click or left/right key)
- __Thought Pages__ (toggle access via Escape key or mouse click)
- __End Pages__ (mouse click for credits or story restart)
- __Credits__ (mouse click for replay credits or story restart)
- __Page Forward__ (mouse click or right arrow key)
- __Page Backward__ (mouse click or left arrow key)
- __Story Restart__ control (mouse click top left of screen)
- __Bookmark Story__ control (mouse click top left + 1 of screen)

## Story Editor

The story editor runs in the same file system context as the story reader application so editor updates are available to the reader with each story restart.
The Story Editor application provides the following features:

- Add new Narrative Page
- Add new Choice Page
- Add new Side/Thought Page
- Edit existing pages (narrative, choice, side)
- Identify page types in page list (including end pages)
- Identify linked page(s) for each page
- Add / Remove character sprites as associated text scroll actions
- Add / Remove image gallery files (backgrounds and character sprites)
- Export copy of the story data file 

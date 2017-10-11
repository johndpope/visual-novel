OUA BITS The Fifth Door - Visual Novel Project



The project includes two packaged applications.



1. The Story Reader is a set of static web files (SPA) driven by a JSON story data file

2. The Story Editor is a REST API and User Interface (SPA) facilitating story data file creation


Organisation
- / 		Contains the NodeJS package.json and main server.js files (as well as read me in markdown and text formats)
- /VisualNovel 	Contains the visual novel application (index.html redirects to story.html) and related css/js/image folders
- /StoryEditor	Contains editor folder with editor.html and related css/js/image folders
- /SharedData	Contains the story-data.json file and gallery folder of all character and background images (editor writes, novel reads)
- /Credits	Contains the credits.html with related css/images folder (page fades via CSS animation tecnique)

Setup and Run

> npm install

> npm start (or Run via C9 IDE)

Using


To accomodate and serve both applications this application runs as a NodeJS Express application.


1. The Story Reader is served from: /story.html

2. The Story Editor is served from: /editor/editor.html



Story Reader


The Story Reader application provides the following features:


- Cover Page (mouse click to start story)

- Narration Pages (scroll text paragraphs using mouse clicks or up/down arrow key)

- Decision Pages (option A/B via mouse click or left/right key)

- Thought Pages (toggle access via Escape key or mouse click)

- End Pages (mouse click for credits or story restart)

- Credits (mouse click for replay credits or story restart)

- Page Forward (mouse click or right arrow key)

- Page Backward (mouse click or left arrow key)

- Story Restart control (mouse click top left of screen)

- Bookmark Story control (mouse click top left + 1 of screen)


Story Editor


The Story Editor runs in the same file system context as the story reader application so editor updates are available to the reader with each story restart.

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

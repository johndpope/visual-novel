# Story Editor

## Purpose
The story editor provides a user friendly interface to enter and maintain the story content using a web interface.
        
## UX Data Entry
The editor will generally focus on one story page at a time beginning with the cover page. Subsequent pages can be created via Next Page, Decision, Dream, End actions
        
## Cover Page
- Every page needs a unique readable title
- At the entry of a page title a page id will be generated (lowercased & hyphens for spaces)
- Prompt for the entry of a background image (from preloaded images or upload a new image file)
- As the cover page needs no other information, select to Create Next Page
- Each subsequent page needs to be a narrative, decision, ending or dream/sidebar page type

## Narrative Page
- Enter a title (creates id)
- Select background image
- Enter narrative text with length limits (e.g. 160 chars), before a paragraph is added
- Create/Link a Dream/Sidebar link if required and a Next Page link or Story End 

## Decision Page
- Enter a title (creates id)
- Select background image
- Enter decision question to pose with length limit (e.g. 40 chars)
- Enter option text values and associated next pages
- Create/Link a Dream link if required

## Managed Objects
- When loading images they should be added to a gallery that allows the user to reuse
- When creating pages (sidebar or decision or narrative) add to selectable gallery for reuse

## Testing
- First test should simply be able to reproduce the current data file
- Confirm that gallery images and page nodes can be selected for reuse

## Implementation
- Due to the image uploading and gallery reuse feature and ease of team use, we can implement this as a nodejs server application.
- A simple web font end will be used to present the story node and take data entry.

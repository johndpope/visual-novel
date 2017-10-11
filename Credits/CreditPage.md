# Credits Page Proposal

1. Store the list of credits in a JavaScript object
2. Display a list of credits for this production from the stored object
3. Organised into blocks of contribution role and people/entities credited
4. May optionally include image to depict the activity / person|entity
5. Use easy to read font in a large size
6. Credit list will likely exceed screen size, determine navigation mechanism
6.1 Scrolling option
 a) the credits overflow the display area
 b) the display area will be cleanly cropped
 c) the credits initially display without any movement
 d) after a short delay the credits will start scrolling to reveal more of the cropped credits
 e) when the full credits are finally displayed stop the scrolling effect
6.2 Paging option
 a) the credits overflow the display area cleanly
 b) all blocks fit cleanly inside display area
 c) after a short delay the credits displayed will be replaced with the next page of credits
 d) display each page of credits for the same period of time before displaying the next page
 e) when the full credits are finally displayed stop the paging effect
7. As this is an interactive book provide the user a button to change the speed of the scrolling/paging
 a) Provide three speed options, say 1x, 2x, 4x
 b) The initial speed setting will 1x and displayed on the button
 c) If the reader presses the button go to the next speed setting
   i) if the speed is at 4x the next speed setting is 1x
   ii) update the speed displayed on the button
   iii) change the speed of the scrolling / paging affect to match the setting
 d) The control button must remain present and visible at all time regardless of scrolling / paging effects
 
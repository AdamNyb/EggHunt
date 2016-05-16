# EggHunt
Files: index.html, style.css, map.js, pubnubCode.js

### index.html
Html document and base. Contains the div where the map is created. Is adapted to mobile, a preliminary icon is set.
Contains links to the other files.

### style.css
CSS document for all the styles.

### map.js
Initializes the google map. Also creates some sample markers.

### pubnubCode.js
Initializes pubnub. Creates the fours channels 'eggChannel', 'scoreChannel', 'positionChannel' and places them in the channel group 'gameChannel_Group'

##### function publish(text,channel)
Publishes a message to chosen channel. Can post javascript objects.

##### function getHistory(channel, count)
General function that gets history for one specified channel. Input: what channel and number of messages
A thought: Since we are only able to get hold of the messages through the callback, maybe it's better to have a history function for each channel that we need to retrieve messages from?
OR maybe it's not so convienient to have a general history function at all? Maybe it's better to use the .history command when it's needed? 

##### function removeEgg(takenEgg)
Hides the taken egg from the map and calls the eggChannel for the positions of all eggs. The callback when successfully retrieved the history from the eggChannel calls the updateEggPositions.

##### function updateEggPositions(takenEgg, oldPositions)
Updates the 'eggChannel' with the new egg positions (the ones remaining)

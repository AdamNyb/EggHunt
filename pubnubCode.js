var eggChannel = 'eggChannel24';
var scoreChannel = 'scoreChannel24';
var positionChannel = 'positionChannel24';
var readyChannel = 'readyChannel24';
var winnerChannel = 'winnerChannel24';
var gameCtrlChannel = 'gameCtrlChannel24';
var gameChannel_Group = 'gameChannel_Group24';

var user = {
	uuid: generateUUID(usrAlias)
};
var scoreboard = {};

var poster;


var pubnub_data = PUBNUB.init({ // initializes pubnub
	publish_key: 'pub-c-bf94e267-7c61-4c6d-b237-727f398f655d',
	subscribe_key: 'sub-c-237e52d0-1b4c-11e6-be83-0619f8945a4f',
	uuid: user.uuid
	//state: {
	//	"alias" : user.alias
	//}
});

function generateUUID(usrAlias) {
	//generates a random uuid
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return usrAlias+'-'+uuid;
};



function setNewUUID(usrAlias, callback) {
	// sets a new uuid, ouside of the initialization
	if (usrAlias == "") {
		usrAlias = 'Eggbert';
	}
	user.uuid = generateUUID(usrAlias);
	user.alias = usrAlias;

	// get/create/store UUID
	PUBNUB.db.get('session') || (function(){ 
	    //var uuid = generateUUID('MUPP'); 
	    PUBNUB.db.set('session', user.uuid); 
	    //return uuid; 
	})();
	
	callback();
}

// creates channel group
pubnub_data.channel_group_add_channel({
    channel: eggChannel,
    channel_group: gameChannel_Group
});
pubnub_data.channel_group_add_channel({
    channel: scoreChannel,
    channel_group: gameChannel_Group
});
pubnub_data.channel_group_add_channel({
    channel: positionChannel,
    channel_group: gameChannel_Group
});
pubnub_data.channel_group_add_channel({
    channel: gameCtrlChannel,
    channel_group: gameChannel_Group
});


pubnub_data.subscribe({
	channel: ['eggChannel24','scoreChannel24','positionChannel24'],
	callback: function(m) {}
});


// oklart om denna behövs.. den behövs ibland
publish("YO",gameCtrlChannel);

// listens to gameCtrlChannel
// listens for 'startNewGame' message
pubnub_data.subscribe({
	channel: gameCtrlChannel,
	message: function(message) {
		if ( message.text == "startNewGame" && gameStarted == false ) {
			// starts new game, and resets all the other channels
			gameStarted = true;
			publish("gameStarted",gameCtrlChannel);
			// if I posted start game -> I will post newGame
			if (message.poster == user.uuid) {
				createEggs(); //when start game, create new eggs
			} 
			pubnub_data.history({
				channel: positionChannel,
				count: 1,
				callback: function(history) {
					if (history[0][0].text != "newGame") {
						publish("newGame",positionChannel);
					}
				}
			})
			/*pubnub_data.history({
				channel: scoreChannel,
				count: 1,
				callback: function(history) {
					if (history[0][0].text != "newGame") {
						publish("newGame",scoreChannel);
					if (history[0][0].text=='winner'){
					swal({   title: "WE HAVE A WINNER!!",   text: history[0][0].poster,   imageUrl: "https://media.giphy.com/media/pqZSDrEjCwdGw/giphy.gif" });

					}


					}
				}
			})*/
		// if someone has already started the game, and it wasn't me, I'll try to place out their eggs
		} else if ( message.text == "gameStarted" && message.poster != user.uuid ) {
			pubnub_data.history({
				channel: eggChannel,
				count: 1,
				callback: function(history) {
					if (history[0][0].text != "newGame") {
						/*console.log("EGG......: I didn't start the game so I will read egg positions");
						var eggPos = history[0][0].text;
						console.log("EGG.....: This is the egg positoins I'm trying to use: ",eggPos);
						placeEggs(eggPos);*/
					}
				}
			})
		} else if ( message.text == "endGame" && gameStarted == true ) {
			gameStarted = false;
			publish("endGame",eggChannel,"gameCtrl");
			publish("endGame",positionChannel,"gameCtrl");
			publish("endGame",scoreChannel,"gameCtrl");
		}
	}
})

// listen to the egg channel
// decides whether I should create my own egss or place someone else's
/*pubnub_data.subscribe({
	channel: eggChannel,
	message: function(message) {
		//console.log("listeing to eggchannel, and we have a new message: ", message);
		if ( message.text == "newGame" ) {
			//console.log("Eggchannel starts new game");
			//console.log("This is the one who started a new game: ", message.poster);
			//console.log("This is my uuid: ", user.uuid);
			if ( message.poster == user.uuid ) {
				console.log("EGG: I started the game so I will create eggs!");
				createEggs();
			} else if ( message.poster != user.uuid ) {
				// I didn't create the game
				console.log("I didn't start the game");
				var eggPos = message.text;
				//console.log("eggPos", eggPos);
				//placeEggs(eggPos);
				
			}
		} else if ( message.text != "newGame" && message.poster != user.uuid ) {
			// if it's new egg coordinates
			// check if it's the same coordinates that I have
			// or check if I posted the coordinates
			//console.log("EGG: I didn't start the game so I will read egg positions");
			
			//console.log("EGG: This is the egg positoins I'm trying to use: ",eggPos);
			
		}
	}
})*/

// listens to score channel, updates the score 
pubnub_data.subscribe({
	channel: scoreChannel,
	message: function(message) {
		if ( message.text == "newGame" ) {
			var blankScoreboard = {};
			publish(blankScoreboard,scoreChannel);
		} else {
			scoreboard = message.text;
			//updateMyScore(scoreboard);
		}
	}
})
pubnub_data.subscribe({
	channel: winnerChannel,
	message: function(message) {
		swal({   title: "WE HAVE A WINNER!!",   text: message.text,   imageUrl: "https://media.giphy.com/media/pqZSDrEjCwdGw/giphy.gif" });
		
	}
})

// listens to the postion channel
// if the position is another player's, update that player's position, or give them a new marker
// if the position is mine, update my marker
pubnub_data.subscribe({
	channel: positionChannel,
	message: function(message) {
		// kolla om ny position inte är min nya
		// uppdatera denna markers position
		if ( message.text == "newGame" ) {
			// empty playerpositions
			playerPositions = {};
		} else {
			// if it's my position
			if ( message.poster == user.uuid ) {
			// if it someone else's position
			} else if ( message.poster != user.uuid ) {
				// if the player doesn't have a marker
				if ( playerPositions[message.poster] == undefined || playerPositions[message.poster] == null ) {
					// creates new marker
					var otherPlayer = new google.maps.Marker({
				      position: {lat: message.text.lat, lng: message.text.lng},
				      map: map,
				      title: message.poster,
				      animation: google.maps.Animation.DROP,
				       icon: 'img/bird.png'
				      //icon: 'img/egg-app-icon.gif',
				    });
					playerPositions[message.poster] = otherPlayer;
				} else { // the player already has a marker
					// update markers position
					var currentPos = {
						lat: message.text.lat,
						lng: message.text.lng
					};
					playerPositions[message.poster].setPosition(currentPos);
				}
			}
		}
	}
});

// Get List of Occupants and Occupancy Count.
pubnub_data.here_now({
	channel_group: gameChannel_Group,
	callback: function (m) {
		if (m.total_occupancy > 4) { //4 channels means number of players = m*4
			gameReady();
		}
	}
});


function publish(text,channel,poster) {
	if (!text) return;
	if (!poster) {
		var poster = user.uuid;
	}
	 // PubNub Publish API
	pubnub_data.publish({
	  channel: channel,
	  message: {
	  	poster: poster,
	    text: text
	  },
	  callback: function(m) {
	  }
	});
}


function removeEgg(takenEgg) {
	// hides taken eggs from the map
	// tells egg channel which eggs are still in the game
	for (var i = 0; i < eggs.length; i ++) {
		var currEgg = eggs[i];
		if (currEgg.title == takenEgg) {
			currEgg.setMap(null);
			eggs.splice(i, 1, "null"); //set null in marker list
			eggData.splice(i, 1, "null"); //set null in data list
		}
	}
	pubnub_data.history({
		channel: eggChannel,
		count: 1,
		callback: function(history) {
			pubnub_data.each(history[0], function(m) {
		    });
			updateEggPositions(takenEgg, history)
		}
	})
}

function updateEggPositions(takenEgg, oldPositions) {
	//publishes the remaining eggs to the eggChannel
	oldPositions = oldPositions[0][0].text;
	var indexToRemove = oldPositions.indexOf(takenEgg);
	if (indexToRemove > -1) {
		oldPositions.splice(indexToRemove, 1, "null"); //removes 1 element on index 'indexToRemove' and sets to "null" in order not to mess up the indexes on the eggs
		var newPositions = oldPositions;	
		//posts the new positions to channel
		publish(newPositions,eggChannel);
	}
}


function getEggs() {
	//gets all the remaining eggs
	var remainingEggs;
	pubnub_data.history({
		channel: eggChannel,
		count:1,
		callback: function(history) {
			remainingEggs1 = history[0][0].text;
			remainingEggs = [];
			for (i = 0; i < remainingEggs1.length; i += 2){
				eggname = remainingEggs1[i]
				remainingEggs.push(eggname);		
			}
			checkForEggs(remainingEggs);
		}
	});
	
}

function updateMyScore() {
	//updates score with +1 for each taken egg
	var myScore = document.getElementById("myScore").innerHTML;
	var myScore = parseInt(myScore);
	myScore = myScore+1;
	if (myScore == 4){
		poster=user.uuid.split('-')[0]
		publish(poster,winnerChannel);
	}
	myScore.toString()
	document.getElementById("myScore").innerHTML= myScore;

	
}

function gameReady() {
	startGame = true;
}

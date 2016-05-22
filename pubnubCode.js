var eggChannel = 'eggChannel24';
var scoreChannel = 'scoreChannel24';
var positionChannel = 'positionChannel24';
var readyChannel = 'readyChannel24';
var gameCtrlChannel = 'gameCtrlChannel24';
var gameChannel_Group = 'gameChannel_Group24';
var user = {
	uuid: generateUUID(usrAlias)
};
var scoreboard = {};


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
	
	console.log("User uuid",user.uuid);
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



// // subscribes to channel group
// pubnub_data.subscribe({
//     channel_group: gameChannel_Group,
//     callback: function(m){
//         //console.log("subscribe callback",m);
//     }
// });

pubnub_data.subscribe({
	channel: ['eggChannel2','scoreChannel2','positionChannel2'],
	callback: function(m) {}
});

// pubnub_data.subscribe({
// 	channel: readyChannel,
// 	message: function(message){
// 		console.log("READYMSG");
// 		console.log(message.text);
// 		if (gameStarted == false || message.text[0] != "tom") {
// 			if (message.text[0] == user.uuid) {
// 				createEggs();
// 			} else {
// 				// look for already made eggs
// 				pubnub_data.history({
// 			      channel: eggChannel,
// 			      count: 1,
// 			      callback: function(history) {
// 			      	placeEggs(history[0][0].text);
// 			      }
// 				});
// 			}
// 		}
// 	}
// })
// publish("tom",readyChannel);

publish("YO",gameCtrlChannel);

// listens to gameCtrlChannel
// listens for 'startNewGame' message
pubnub_data.subscribe({
	channel: gameCtrlChannel,
	message: function(message) {
		console.log("listening to gameCtrlChannel, and we recieved a message!");
		console.log(message.text);
		if ( message.text == "startNewGame" && gameStarted == false ) {
			// starts new game, and resets all the other channels
			console.log("WE HAVE STARTED A NEW GAME!!!!!!!!");
			console.log("THIS IS THE ONE WHO STARTED THE GAME: ",message.poster);
			gameStarted = true;
			publish("gameStarted",gameCtrlChannel);
			if (message.poster == user.uuid) {
				// if I posted start game -> I will post newGame
				console.log("if I posted start game -> I will post newGame");
				publish("newGame",eggChannel);
			} else {
				// checks if the last message is "newGame"
				// if so, don't post a new "newGame" message
				// no
				// checks egg postiosns and places them
				pubnub_data.history({
					channel: eggChannel,
					count: 1,
					callback: function(history) {
						if (history[0][0].text != "newGame") {
							console.log("EGG......: I didn't start the game so I will read egg positions");
							var eggPos = history[0][0].text;
							console.log("EGG.....: This is the egg positoins I'm trying to use: ",eggPos);
							//placeEggs(eggPos);
						}
					}
				})
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
			pubnub_data.history({
				channel: scoreChannel,
				count: 1,
				callback: function(history) {
					if (history[0][0].text != "newGame") {
						publish("newGame",scoreChannel);
					}
				}
			})
		} else if ( message.text == "gameStarted" && message.poster != user.uuid ) {
			pubnub_data.history({
				channel: eggChannel,
				count: 1,
				callback: function(history) {
					if (history[0][0].text != "newGame") {
						console.log("EGG......: I didn't start the game so I will read egg positions");
						var eggPos = history[0][0].text;
						console.log("EGG.....: This is the egg positoins I'm trying to use: ",eggPos);
						placeEggs(eggPos);
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
pubnub_data.subscribe({
	channel: eggChannel,
	message: function(message) {
		console.log("listeing to eggchannel, and we have a new message: ", message);
		if ( message.text == "newGame" ) {
			console.log("Eggchannel starts new game");
			console.log("This is the one who started a new game: ", message.poster);
			console.log("This is my uuid: ", user.uuid);
			if ( message.poster == user.uuid ) {
				console.log("EGG: I started the game so I will create eggs!");
				createEggs();
			} else if ( message.poster != user.uuid ) {
				// I didn't create the game
				console.log("I didn't start the game");
				var eggPos = message.text;
				placeEggs(eggPos);
			}
		} else if ( message.text != "newGame" && message.poster != user.uuid ) {
			// if it's new egg coordinates
			// check if it's the same coordinates that I have
			// or check if I posted the coordinates
			console.log("EGG: I didn't start the game so I will read egg positions");
			
			console.log("EGG: This is the egg positoins I'm trying to use: ",eggPos);
			
		}
	}
})

pubnub_data.subscribe({
	channel: scoreChannel,
	message: function(message) {
		if ( message.text == "newGame" ) {
			console.log("Scorechannels starts new game");
			var blankScoreboard = {};
			publish(blankScoreboard,scoreChannel);
		} else {
			scoreboard = message.text;
			updateMyScore(scoreboard);
		}
	}
})

pubnub_data.subscribe({
	channel: positionChannel,
	message: function(message) {
		// kolla om ny position inte är min nya
		// uppdatera denna markers position
		console.log("These are the playerPositions");
		console.log(playerPositions);
		if ( message.text == "newGame" ) {
			// empty playerpositions
			playerPositions = {};
		} else {
			console.log("positionChannel recieved a message", message);
			if ( message.poster == user.uuid ) {
				console.log("MY POSITION!");
			} else if ( message.poster != user.uuid ) {
				// if the player doesn't have a marker
				if ( playerPositions[message.poster] == undefined || playerPositions[message.poster] == null ) {
					console.log("the player doesn't have a marker, let's create a new one", message.poster);
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
					console.log("The player HAS a marker, let's update it");
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

// när sidan laddas, kolla om det finns eggPositions i eggkanalen
// om det inte finns, skapa egna egg
// om det finns, kolla om den som skapade är online
// om den är online, använd de existerande


// Get List of Occupants and Occupancy Count.
pubnub_data.here_now({
	channel_group: gameChannel_Group,
	callback: function (m) {
		console.log("Occupancy: ");
		console.log(m);
		if (m.total_occupancy > 4) { //4 channels means number of players = m*4
			gameReady();
		}
	}
});


// pubnub_data.subscribe({
// 	channel: eggChannel,
// 	//noheresync: true,
// 	message: function(m){
// 		console.log("Message");
// 		console.log(m);
// 	},
// 	presence: function(m) {
// 		//console.log("presence");
// 		if (m.action == 'join') {
// 			console.log("someone joined!");
// 			console.log(m);
// 			scoreboard[m.uuid] = 0;
// 			publish(scoreboard,scoreChannel);
// 		} else if (m.action == 'leave') {
// 			console.log("someone left!");
// 		}
// 	}
// });


function publish(text,channel,poster) {
	if (!text) return;
	if (!poster) {
		var poster = user.uuid;
	}
	console.log("I'm gonna post this, to channel:",channel);
	console.log(text);
	console.log("This is the poster:",poster);

	 // PubNub Publish API
	pubnub_data.publish({
	  channel: channel,
	  message: {
	  	poster: poster,
	    text: text
	  },
	  callback: function(m) {
	    //console.log(m);
	  }
	});
}


var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.349877, lng: 18.070535};
var eggPos = [KTH,Sthlm,Sthlm2];
//publish(eggPos,eggChannel);
//var test = [12,14,19,15];
//publish(test,eggChannel);

function removeEgg(takenEgg) {
	// hides taken eggs from the map
	// tells egg channel which eggs are still in the game

	// if the eggs are marker objects, simply hide the marker:
	//takenEgg.setVisible(false);
	for (var i = 0; i < eggs.length; i ++) {
		var currEgg = eggs[i];
		//console.log("curreEgg", currEgg);
		if (currEgg.title == takenEgg) {
			currEgg.setMap(null);
			eggs.splice(i, 1);
			eggData.splice(i, 1);
		}
	}
	getScoreboard();
	pubnub_data.history({
		channel: eggChannel,
		count: 1,
		callback: function(history) {
			//console.log("Channel history: ",history);
			pubnub_data.each(history[0], function(m) {
		    	//console.log("Latest message:");
		    	//console.log(m.text);
		    	//console.log(m.text.lng);
		    });
			updateEggPositions(takenEgg, history)
		}
	})
}

function updateEggPositions(takenEgg, oldPositions) {
	//console.log("updateEggPositions");
	oldPositions = oldPositions[0][0].text;
	//console.log("Old positions", oldPositions);

	//console.log("taken egg:", takenEgg);
	//console.log("index of:", oldPositions.indexOf(takenEgg));
	var indexToRemove = oldPositions.indexOf(takenEgg);
	if (indexToRemove > -1) {
		// splice DOES NOT seem to work with objects
		oldPositions.splice(indexToRemove, 1); //removes 1 element on index 'indexToRemove'
		var newPositions = oldPositions;
		//console.log("New eggPos",newPositions);
		
		//posts the new positions to channel
		publish(newPositions,eggChannel);
	}

}

//removeEgg(Sthlm);


function getScoreboard() {
	pubnub_data.history({
		channel: scoreChannel,
		count: 1,
		callback: function(history) {
			var scoreboard = history[0][0].text;
			//console.log("SCore history: ",scoreboard);
			addScore(scoreboard);
		}
	})
}


function addScore(scoreboard) {
	//console.log("Let's rint out MY score");
	//console.log(scoreboard);
	//console.log(scoreboard[user.uuid]);
	if (scoreboard[user.uuid] == null ) {
		scoreboard[user.uuid] = 0;
	}
	scoreboard[user.uuid] = Number(scoreboard[user.uuid]) + 1;
	//console.log("MY NEW score");
	//console.log(scoreboard[user.uuid]);
	publish(scoreboard,scoreChannel);
	updateMyScore(scoreboard);
}

function updateMyScore(scoreboard) {
	var myScore = document.getElementById('myScore');
	if (scoreboard[user.uuid] == undefined) {
		scoreboard[user.uuid] = 0;
	}
	myScore.innerHTML = scoreboard[user.uuid];
}





function gameReady() {
	startGame = true;
}
//getScoreboard();

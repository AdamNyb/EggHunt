var eggChannel = 'eggChannel';
var scoreChannel = 'scoreChannel';
var positionChannel = 'positionChannel';
var gameChannel_Group = 'gameChannel_Group';
var user = {};


var pubnub_data = PUBNUB.init({ // initializes pubnub
	publish_key: 'pub-c-bf94e267-7c61-4c6d-b237-727f398f655d',
	subscribe_key: 'sub-c-237e52d0-1b4c-11e6-be83-0619f8945a4f',
	//uuid: user.uuid,
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



function setNewUUID(usrAlias) {
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


// subscribes to channel group
pubnub_data.subscribe({
    channel_group: gameChannel_Group,
    callback: function(m){
        //console.log("subscribe callback",m);
    }
});
// Get List of Occupants and Occupancy Count.
pubnub_data.here_now({
    channel_group : gameChannel_Group,
    callback : function(m){
    	console.log("HELLO");
        console.log(m);
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




function publish(text,channel) {
	if (!text) return;

	 // PubNub Publish API
	pubnub_data.publish({
	  channel: channel,
	  message: {
	    text: text
	  },
	  callback: function(m) {
	    console.log(m);
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
		console.log("curreEgg", currEgg);
		if (currEgg.title == takenEgg) {
			currEgg.setMap(null);
			eggs.splice(i, 1);
			eggTitles.splice(i, 1);
		}
	}
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
			console.log("SCore history: ",scoreboard);
			addScore(scoreboard);
		}
	})
}

function addScore(scoreboard) {
	//console.log("Let's rint out MY score");
	//console.log(scoreboard[user.uuid]);
	scoreboard[user.uuid] = scoreboard[user.uuid] + 1;
	//console.log("MY NEW score");
	//console.log(scoreboard[user.uuid]);
	publish(scoreboard,scoreChannel);
	updateMyScore(scoreboard);
}

function updateMyScore(scoreboard) {
	var myScore = document.getElementById('myScore');
	myScore.innerHTML = scoreboard[user.uuid];
}

//getScoreboard();


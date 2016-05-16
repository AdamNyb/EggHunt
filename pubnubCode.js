var pubnub_data = PUBNUB.init({ // initializes pubnub
	publish_key: 'pub-c-bf94e267-7c61-4c6d-b237-727f398f655d',
	subscribe_key: 'sub-c-237e52d0-1b4c-11e6-be83-0619f8945a4f'
});

var eggChannel = 'eggChannel';
var scoreChannel = 'scoreChannel';
var positionChannel = 'positionChannel';
var gameChannel_Group = 'gameChannel_Group';

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
        console.log("subscribe callback",m);
    }
});

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

function getHistory(channel, count) {
	// gets history for one specified channel
	// input: what channel and number of messages
	// since we are only able to get hold of the messages through 
	// the callback, maybe it's better to have a history function 
	// for each channel that we need to retrieve messages from?
	// OR maybe it's not so convienient to have a general history function at all?
	// maybe it's better to use the .history command when it's needed?
	console.log("Gets history");
	pubnub_data.history({
	  channel: channel,
	  count: count,
	  callback: function(messages) {
	    pubnub_data.each(messages[0], function(m) {
	    	console.log(m);
	    	//console.log(m.text.lng);
	    });
	    eggs = messages;
	    console.log("eggs2",eggs);
	  }
	});
};



var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.349877, lng: 18.070535};
var eggPos = [KTH,Sthlm,Sthlm2];
publish(eggPos,eggChannel);
//var test = [12,14,19,15];
//publish(test,eggChannel);

function removeEgg(takenEgg) {
	// hides taken eggs from the map
	// tells egg channel which eggs are still in the game

	// if the eggs are marker objects, simply hide the marker:
	//takenEgg.setVisible(false);

	pubnub_data.history({
		channel: eggChannel,
		count: 1,
		callback: function(history) {
			console.log("Channel history: ",history);
			pubnub_data.each(history[0], function(m) {
		    	console.log("Latest message:");
		    	console.log(m.text);
		    	//console.log(m.text.lng);
		    });
			updateEggPositions(takenEgg, history)
		}
	})
}

function updateEggPositions(takenEgg, oldPositions) {
	console.log("updateEggPositions");
	oldPositions = oldPositions[0][0].text;
	console.log("Old positions", oldPositions);

	console.log("taken egg:", takenEgg);
	console.log("index of:", oldPositions.indexOf(takenEgg));
	var indexToRemove = oldPositions.indexOf(takenEgg);
	if (indexToRemove > -1) {
		// splice DOES NOT seem to work with objects
		oldPositions.splice(indexToRemove, 1); //removes 1 element on index 'indexToRemove'
		var newPositions = oldPositions;
		console.log("New eggPos",newPositions);
		
		//posts the new positions to channel
		publish(newPositions,eggChannel);
	}

}

removeEgg(Sthlm);

var pubnub_data = PUBNUB.init({ // initializes pubnub
	publish_key: 'pub-c-bf94e267-7c61-4c6d-b237-727f398f655d',
	subscribe_key: 'sub-c-237e52d0-1b4c-11e6-be83-0619f8945a4f'
});

// creates channel group
pubnub_data.channel_group_add_channel({
    channel: "eggChannel",
    channel_group: "gameChannel_Group"
});
pubnub_data.channel_group_add_channel({
    channel: "scoreChannel",
    channel_group: "gameChannel_Group"
});
pubnub_data.channel_group_add_channel({
    channel: "positionChannel",
    channel_group: "gameChannel_Group"
});

// subscribes to channel group
pubnub_data.subscribe({
    channel_group: "gameChannel_Group",
    callback: function(m){
        console.log("subscribe callback",m);
    }
})

function getHistory(channel, count) {
	console.log("Gets history");
	//output.innerHTML = ''; //empties the div for the old channel
	pubnub_data.history({
	  channel: channel,
	  count: count,
	  callback: function(messages) {
	    pubnub_data.each(messages[0], function(m) {
	    	console.log(m);
	    	//console.log(m.text.lng);
	    });
	  }
	});
};

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

//publish("Test3",'eggChannel');
getHistory('eggChannel', 3);
var KTH = {lat: 59.349877, lng: 18.070535};
//publish(KTH,'eggChannel');
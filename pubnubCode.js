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
    channel_group: "gameChannel_Group"
})
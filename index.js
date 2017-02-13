"use strict"

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var express  = require('express');
var url = require('url');
var $ = require('jquery');
var _ = require('lodash');
var request = require('request');



var tickerList = [];
var idCounter = 0; 
var msgData = [];
var polls = [];
var pollData = {};
var emojiData = {};
var refreshRate = 500;
emojiData.connected = false;
emojiData.postID = '';
emojiData.count = {
	like: undefined,
	love: undefined,
	haha: undefined,
	angry: undefined,
	sad: undefined,
};
emojiData.baseline = {};
emojiData.baseline.love = 0;

emojiData.baseline.haha = 0;

emojiData.access_token = '369577906743625|0VPUwP1JlXagmBwWHvgWFbBa_sE';

getEmojiData();
setInterval(updateEmojiData, refreshRate);

function updateEmojiData(){
	getEmojiData();
	io.emit('getEmojiData',emojiData);	
}
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/control_panel.html');
});
app.get('/overlay', function(req, res){
	res.sendFile(__dirname + '/overlay.html');
});


io.on('connection', function(socket){
	sendMsgData();
	emitTickerList();
	socket.on('chat message', function(msg){
		msgData.push(msg);
		io.emit('chat message', msg);
		sendMsgData();
	});
	socket.on('pollState', function(_data){
		var data = {};
		data.bool = _data.bool;
		if(_data){
			data.time = addMinutes(new Date(),_data.minutes).toLocaleString();
			emojiData.baseline.love = emojiData.count.love;
			emojiData.baseline.haha = emojiData.count.haha;
			console.log(data);

		}


		io.emit('showPoll', data);
	});


		function addMinutes(date, minutes) {
			return new Date(date.getTime() + minutes*60000);
		}

	socket.on('newTick', function(tick){
		if(tick !== ' '){
			idCounter++;
			tick.id = idCounter;
			console.log('new tick: '+tick);
			tickerList.push(tick);
			console.log('add: '+ tickerList);
			emitTickerList();			
		}
	});
	socket.on('removeTick', function(id){
		console.log('id_counter: ' + idCounter);
		for(var i = 0; i < tickerList.length; i++){

			if(parseInt(tickerList[i].id) === parseInt(id)){
				tickerList.splice(i, 1);
			}

		}
		emitTickerList();
	});
	socket.on('newPostID',function(_ID){
		emojiData.postID = _ID;
		io.emit('getEmojiData',getEmojiData());	
		
	});
});

http.listen(process.env.PORT || 3000);

function sendMsgData() {
	io.emit('newConnection',msgData);	
}

function emitTickerList() {
	io.emit('getTickerList',tickerList);	
}

function emitPollData(){
	io.emit('getPollData',pollData);	
}



function newPostID(_id){
	emojiData.postID = _id;
}


function getEmojiData(){


	var reactions = ['LIKE', 'LOVE', 'WOW', 'HAHA', 'SAD', 'ANGRY'].map(function (e) {
		var code = 'reactions_' + e.toLowerCase();
		return 'reactions.type(' + e + ').limit(0).summary(total_count).as(' + code + ')'
	}).join(',');
	var adress = 'https://graph.facebook.com/v2.8/?ids=' + emojiData.postID + '&fields=' + reactions + '&access_token=' + emojiData.access_token ;

	request(adress, function(err, res, data){
		if (data === undefined) {
			console.log('No connection');
			return;
		}
		var data = JSON.parse(data);
		var postID = emojiData.postID;
		if(data[postID] !== undefined){
			emojiData.count.like = data[postID].reactions_like.summary.total_count;
			emojiData.count.love = data[postID].reactions_love.summary.total_count;
			emojiData.count.haha = data[postID].reactions_haha.summary.total_count;
			emojiData.count.wow = data[postID].reactions_wow.summary.total_count;
			emojiData.count.angry = data[postID].reactions_angry.summary.total_count;
			emojiData.count.sad = data[postID].reactions_sad.summary.total_count;
			calcBar(emojiData.count.love,emojiData.count.haha)
			emojiData.connected = true;
		}else{
			console.log('PostID is unacceptable');
			emojiData.count.like = 0;
			emojiData.count.love = 0;
			emojiData.count.haha = 0;
			emojiData.count.wow = 0;
			emojiData.count.angry = 0;
			emojiData.count.sad = 0;
			emojiData.connected = false;
		}
	});
}

function calcBar(_a,_b){

	var a = _a - emojiData.baseline.love ;
	var b = _b - emojiData.baseline.haha ;

	a+=1;
	b+=1;

	if(a <= 0){
		a = 1;
	}
	if(b <= 0){
		b = 1; 
	}

	var full = a+b;

	var per = full/100


	var aPer = a/per;
	var bPer = b/per;

	pollData.aPer = aPer;
	pollData.bPer = bPer;
	emitPollData();

}

var app = angular.module('twitchCardsApp', []);

app.controller('TwichCardsController', function($scope, $http) {
	
	var API = 'https://api.twitch.tv/kraken/';
	var DEFAULT_IMAGE = 'https://static-cdn.jtvnw.net/jtv_user_pictures/xarth/404_user_150x150.png';

	var twitchUsernames = [
		'freecodecamp'
		,'terakilobyte'
		,'RobotCaleb'
		,'habathcx'
		,'thomasballinger'
		,'storbeck'
		,'noobs2ninjas'
		,'beohoff'
		,'brunofin'
		,'comster404'
		,'chiszen'
		,'ragefu'
		,'player2player'
		,'charlespbf1'
		,'chanmanv'
		,'susanaandradee'
		,'the_sp4ceman'
		,'strictlygrumps'
	];

	twitchUsernames = shuffle(twitchUsernames);

	$scope.twitchUsers = [];


	var init = function() {

		twitchUsernames.forEach(function(username) {
			getTwichUserData(username);
		});
	};

	var getTwichUserData = function(username) {
		var url = API + 'streams/' + username;
		$http.get(url)
			.success(function(data) {
				var user = createTwichUser(username, data);
				getImage(user);		
			})
			.error(function(data, status, headers, config) {
				console.log('Unable to get info for twich user', username, 'status', status);
				var unavailable = createUnavailableTwitchUser(username);
				$scope.twitchUsers.push(unavailable);
			});
	};

	var createTwichUser = function(username, data) {
		var twitchUser = {};
		var TWITCH = 'https://www.twitch.tv/';
		twitchUser.url = TWITCH + username;
		twitchUser.username = username; 
		
		if (data.stream) {
			twitchUser.isStreaming = true;
			twitchUser.isOnline = true;
			twitchUser.isOffline = false;
			twitchUser.isUnavailable = false;
			twitchUser.streamingTitle = data.stream.channel.status;
			twitchUser.image = unescape(data.stream.channel.logo);
		} else {
			twitchUser.isStreaming = false;
			twitchUser.isOnline = false;
			twitchUser.isOffline = true;
			twitchUser.isUnavailable = false;
		}

		return twitchUser;
	}

	var createUnavailableTwitchUser = function(username) {
		var twitchUser = {};
		twitchUser.username = username;
		twitchUser.image = DEFAULT_IMAGE;
		twitchUser.isStreaming = false;
		twitchUser.isOnline = false;
		twitchUser.isOffline = false;
		twitchUser.isUnavailable = true;

		return twitchUser;
	};

	var getImage = function(user) {
		var url = API + 'users/' + user.username;
		$http.get(url)
			.success(function(data) {
				user.image = data.logo || DEFAULT_IMAGE;
				$scope.twitchUsers.push(user);
			})
			.error(function(data, status, headers, config) {
				console.log('Unable to get image twich user', user.username, 'status', status);
				user.image = DEFAULT_IMAGE;
				$scope.twitchUsers.push(user);
			});
	};

	// See https://github.com/coolaj86/knuth-shuffle
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	};


	$scope.openTwitch = function(user) {
		if (user.isUnavailable) return false; 
		window.location.href = user.url;
	};

	init();
});
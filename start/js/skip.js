//UTILS
function getUrls(source) {
	var e=/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	return source.match(e);
}


//TEMPLATES
var info_template = '<img src="{{profileImageUrl}}" height="40px" width="40px" />' +
'<span class="username">{{screenName}}</span>' +
'<ul class="follows">' +
'<li class="following"><span class="num">{{friendsCount}}</span><span>Following</span></li>' +
'<li class="followers"><span class="num">{{followersCount}}</span><span>Followers</span></li>' +
'<li class="listed"><span class="num">{{statusesCount}}</span><span>Tweets</span></li>' +
'</ul>';

var tweet_template = '<li id="status_{{id}}" class="status">' +
'<span class="thumb">' +
	  '<a href="http://twitter.com/screeley">' +
	  '<img width="48" height="48" src="{{user.profileImageUrl}}" class="photo fn" alt="" /></a>' +
'</span>' +
'<span class="status-body">' +
  '<span class="status-content">' +
    '<strong><a class="tweet-url screen-name" href="http://twitter.com/screeley">{{user.screenName}}</a></strong>' +
    '<span class="entry-content">{{text}}</span>' +
  '</span>' +
	'<span class="meta entry-meta">' +
		'<a href="http://twitter.com/screeley/status/13331451888" rel="bookmark" class="entry-date">' +
  	'<span class="published timestamp">about 7 hours ago</span></a>' +
  	   '<span class="source"></span>' +
  '</span>' +
'</span>' +
'</li>';

function createStatus(status){
	//Set View Attributes
	var view = status.attributes;
	view["user"] = null;
	$.each(status.user, function(k,v) {
		view["user."+k] = v;
	});
	
	var html = Mustache.to_html(tweet_template, view);
	$('div#tweets OL').append(html);
	$("LI#status_"+status.id+" .source").html('via '+status.source);
	//ADD EMBEDLY HERE
}

function createUserInfo(currentUser){
	var view = currentUser.attributes;
	var html = Mustache.to_html(info_template, view);
	$('div.left div.info').html(html);
}

function isPhoto(url){
	var re = /http:\/\/(.*yfrog\..*\/.*|tweetphoto\.com\/.*|www\.flickr\.com\/photos\/.*|.*twitpic\.com\/.*|.*imgur\.com\/.*|.*\.posterous\.com\/.*|post\.ly\/.*|twitgoo\.com\/.*|i.*\.photobucket\.com\/albums\/.*|gi.*\.photobucket\.com\/groups\/.*|phodroid\.com\/.*\/.*\/.*|www\.mobypicture\.com\/user\/.*\/view\/.*|moby\.to\/.*|xkcd\.com\/.*|www\.asofterworld\.com\/index\.php\?id=.*|www\.qwantz\.com\/index\.php\?comic=.*|23hq\.com\/.*\/photo\/.*|www\.23hq\.com\/.*\/photo\/.*|.*dribbble\.com\/shots\/.*|drbl\.in\/.*|.*\.smugmug\.com\/.*|.*\.smugmug\.com\/.*#.*|emberapp\.com\/.*\/images\/.*|emberapp\.com\/.*\/images\/.*\/sizes\/.*|emberapp\.com\/.*\/collections\/.*\/.*|emberapp\.com\/.*\/categories\/.*\/.*\/.*|embr\.it\/.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*)/i;
	if (url.match(re))
		return true;
	return false;
}
function isVideo(url){
	//ADD VIDEO REGEX HERE
	var re = null;
	if (url.match(re))
		return true;
	return false;
}
function isAudio(url){
	var re = /http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|www\.lala\.com\/#album\/.*|www\.lala\.com\/album\/.*|www\.lala\.com\/#song\/.*|www\.lala\.com\/song\/.*|www\.mixcloud\.com\/.*\/.*\/)/i;
	if (url.match(re))
		return true;
	return false;
}

function homeTimeline(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.homeTimeline().first(20).each(function(status) {
		    createStatus(status);
		    T("LI#status_"+status.id).hovercards();
		});
	});
}
function mentions(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.mentions().first(20).each(function(status) {
	         createStatus(status);
	         T("LI#status_"+status.id).hovercards();
	    });
	});
}
function dms(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.dms().first(20).each(function(status) {
	         createStatus(status);
	         T("LI#status_"+status.id).hovercards();
	    });
	});
}
function favorites(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.favorites().first(20).each(function(status) {
	         createStatus(status);
	         T("LI#status_"+status.id).hovercards();
	    });
	});
}
function testing(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.User.find('embedly_tester').timeline().first(20).each(function(status) {
			createStatus(status);
	         T("LI#status_"+status.id).hovercards();
	     });
	});
}

function photos(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.homeTimeline().each(function(status) {
			var urls = getUrls(status.text)
			if (urls != null){
				$.each(urls, function(index, url){
					if (isPhoto(url)){
						createStatus(status);
						return false;
					}
				});
			}
		});
	});
};
function videos(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.homeTimeline().first(100).each(function(status) {
			var urls = getUrls(status.text)
			if (urls != null){
				$.each(urls, function(index, url){
					if (isVideo(url)){
						createStatus(status);
						return false;
					}
				});
			}
		});
	});
};
function audio(){
	$('div#tweets OL').html('');
	twttr.anywhere(function (T) {
		T.currentUser.homeTimeline(100).first(100).each(function(status) {
			var urls = getUrls(status.text)
			if (urls != null){
				$.each(urls, function(index, url){
					if (isAudio(url)){
						createStatus(status);
						return false;
					}
				});
			}
		});
	});
};
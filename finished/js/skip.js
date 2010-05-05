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
	urls = getUrls(status.text);
	if (urls != null){
		$.each(urls, function(index, url){
				$.embedly(url, {maxWidth:580}, function(oembed){
					if (oembed != null){
						$("LI#status_"+status.id).append(oembed.code);
						return false;
					}
				});
		});
	}
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
	var re = /http:\/\/(.*youtube\.com\/watch.*|.*\.youtube\.com\/v\/.*|youtu\.be\/.*|www\.veoh\.com\/.*\/watch\/.*|.*justin\.tv\/.*|.*justin\.tv\/.*\/b\/.*|www\.ustream\.tv\/recorded\/.*|www\.ustream\.tv\/channel\/.*|qik\.com\/video\/.*|qik\.com\/.*|.*revision3\.com\/.*|.*\.dailymotion\.com\/video\/.*|.*\.dailymotion\.com\/.*\/video\/.*|www\.collegehumor\.com\/video:.*|.*twitvid\.com\/.*|www\.break\.com\/.*\/.*|vids\.myspace\.com\/index\.cfm\?fuseaction=vids\.individual&videoid.*|www\.myspace\.com\/index\.cfm\?fuseaction=.*&videoid.*|www\.metacafe\.com\/watch\/.*|blip\.tv\/file\/.*|.*\.blip\.tv\/file\/.*|video\.google\.com\/videoplay\?.*|.*revver\.com\/video\/.*|video\.yahoo\.com\/watch\/.*\/.*|video\.yahoo\.com\/network\/.*|.*viddler\.com\/explore\/.*\/videos\/.*|liveleak\.com\/view\?.*|www\.liveleak\.com\/view\?.*|animoto\.com\/play\/.*|dotsub\.com\/view\/.*|www\.overstream\.net\/view\.php\?oid=.*|www\.whitehouse\.gov\/photos-and-video\/video\/.*|www\.whitehouse\.gov\/video\/.*|wh\.gov\/photos-and-video\/video\/.*|wh\.gov\/video\/.*|www\.hulu\.com\/watch.*|www\.hulu\.com\/w\/.*|hulu\.com\/watch.*|hulu\.com\/w\/.*|movieclips\.com\/watch\/.*\/.*\/|movieclips\.com\/watch\/.*\/.*\/.*\/.*|.*crackle\.com\/c\/.*|www\.fancast\.com\/.*\/videos|www\.funnyordie\.com\/videos\/.*|www\.vimeo\.com\/groups\/.*\/videos\/.*|www\.vimeo\.com\/.*|vimeo\.com\/groups\/.*\/videos\/.*|vimeo\.com\/.*|www\.ted\.com\/talks\/.*\.html.*|www\.ted\.com\/talks\/lang\/.*\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/.*\.html.*|www\.ted\.com\/index\.php\/talks\/lang\/.*\/.*\.html.*|.*omnisio\.com\/.*|.*nfb\.ca\/film\/.*|www\.thedailyshow\.com\/watch\/.*|www\.thedailyshow\.com\/full-episodes\/.*|www\.thedailyshow\.com\/collection\/.*\/.*\/.*|movies\.yahoo\.com\/movie\/.*\/video\/.*|movies\.yahoo\.com\/movie\/.*\/info|movies\.yahoo\.com\/movie\/.*\/trailer|www\.colbertnation\.com\/the-colbert-report-collections\/.*|www\.colbertnation\.com\/full-episodes\/.*|www\.colbertnation\.com\/the-colbert-report-videos\/.*|www\.comedycentral\.com\/videos\/index\.jhtml\?.*|www\.theonion\.com\/video\/.*|theonion\.com\/video\/.*|wordpress\.tv\/.*\/.*\/.*\/.*\/|www\.traileraddict\.com\/trailer\/.*|www\.traileraddict\.com\/clip\/.*|www\.traileraddict\.com\/poster\/.*|www\.escapistmagazine\.com\/videos\/.*|www\.trailerspy\.com\/trailer\/.*\/.*|www\.trailerspy\.com\/trailer\/.*|www\.trailerspy\.com\/view_video\.php.*|screenr\.com\/.*|www\.5min\.com\/Video\/.*|www\.howcast\.com\/videos\/.*|www\.screencast\.com\/.*\/media\/.*|screencast\.com\/.*\/media\/.*|www\.screencast\.com\/t\/.*|screencast\.com\/t\/.*|tumblr\.com\/.*|.*\.tumblr\.com\/post\/.*)/i;
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
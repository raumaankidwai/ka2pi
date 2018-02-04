const OAuth = require("oauth");

exports = function KAOAuthSession (options) {
	this.KEY = options.KEY;
	this.SECRET = options.SECRET;
	this.HOST = options.HOST;
	this.PORT = options.PORT;
	
	this.CALLBACK = `http://${this.HOST}:${this.PORT}/callback`;
	
	this.session = new OAuth.OAuth(
		`https://www.khanacademy.org/api/auth2/request_token?oauth_callback=${this.CALLBACK}`,
		`https://www.khanacademy.org/api/auth2/access_token?oauth_callback=${this.CALLBACK}`,
		this.KEY,
		this.SECRET,
		"1.0",
		null,
		"HMAC-SHA1"
	);
};

/*
	Callback should expect:
	URL to send to user,
	request token secret (remember to pass this to getAccessToken later on!)
*/
exports.prototype.getRequestToken = function getRequestToken (callback) {
	this.session.getOAuthRequestToken(function (error, token, secret, results) {
		if (error) {
			throw error;
		}
		
		callback(`https://www.khanacademy.org/api/auth2/authorize?oauth_token=${token}`, secret);
	});
};

/*
	Parameters:
	reqToken		-- oauth_token from GET parameters
	verifier		-- oauth_verifier from GET parameters
	reqTokenSecret		-- secret passed into earlier callback; see getRequestToken
	
	Callback should expect:
	Access token to pass to KAOauthSession.get later on,
	Access token secret to do the same with
*/
exports.prototype.getAccessToken = function getAccessToken (reqToken, verifier, reqTokenSecret, callback) {
	this.session.getOAuthAccessToken(reqToken, verifier, reqTokenSecret, function (error, accessToken, accessTokenSecret) {
		if (error) {
			throw error;
		}
		
		callback(accessToken, accessTokenSecret);
	});
};

/*
	Parameters:
	uri			-- path of the API endpoint you want to access, ex /api/v1/user/exercises
	accessToken		-- accessToken passed into getAccessToken callback
	accessTokenSecret	-- accessTokenSecret passed into getAccessToken callback.
	
	Callback should expect:
	JSON.parse'd API response data
*/
exports.prototype.get = function get (uri, accessToken, accessTokenSecret, callback) {
	this.session.get(uri, accessToken, accessTokenSecret, function (error, response) {
		if (error) {
			throw error;
		}
		
		callback(JSON.parse(response));
	});
};

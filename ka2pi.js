const http = require("http");
const OAuth = require("oauth");
const { URL } = require("url");

const { KEY, SECRET, PORT } = require("./options.json");

const CALLBACK = `http://localhost:${PORT}/callback`;

const KA2PI = new OAuth.OAuth(
	`https://www.khanacademy.org/api/auth2/request_token?oauth_callback=${CALLBACK}`,
	`https://www.khanacademy.org/api/auth2/access_token?oauth_callback=${CALLBACK}`,
	KEY,
	SECRET,
	"1.0",
	null,
	"HMAC-SHA1"
);

KA2PI.getOAuthRequestToken(function (error, token, secret, results) {
	console.log(`https://www.khanacademy.org/api/auth2/authorize?oauth_token=${token}`)
});

http.createServer(function (request, response) {
	var url = new URL(request.url);
	console.log(url.query);
}).listen(PORT);

import * as functions from "firebase-functions";
import * as jsSha256 from "js-sha256";

export const tweetApi = functions.https.onRequest(async (req, res) => {
	try {
		if (req.headers["X-Hub-Signature-256"]) {
			if (req.headers["X-Hub-Signature-256"].includes("sha256=")) {
				const signature:string=req.headers["X-Hub-Signature-256"].toString();
				const hashRecieved:string=signature.split("sha256=")[1];
				const webPushSecret:string=functions.config().github.webPushSecret;
				const computedHash:string=jsSha256.sha256.hmac(webPushSecret, req.body);
				if (hashRecieved !== computedHash) {
					res.status(200).json({status: "Webhook Processed Successfully", content: {tweeted: false}});
				} else {
					res.status(401).json({status: "Invalid Webhook", content: {reason: "Invalid X-Hub-Signature-256 header"}});
				}
			} else {
				res.status(401).json({status: "Invalid Webhook", content: {reason: "Malformed X-Hub-Signature-256 header"}});
			}
		} else {
			res.status(401).json({status: "Invalid Webhook", content: {reason: "Missing X-Hub-Signature-256 header"}});
		}
	} catch (error) {
		res.status(500).json({status: "Unable To Process Request", content: {error: error.message}});
	}
});

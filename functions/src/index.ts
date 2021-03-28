import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

export const tweetApi = functions.https.onRequest((req, res) => {
	const ref = admin.database().ref("/req");
	ref.push({body: JSON.parse(req.body), headers: req.headers});
	res.send("Recieved");
});

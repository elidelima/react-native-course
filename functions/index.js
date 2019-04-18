const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true});
const fs = require("fs");
const gcconfig = {
  projectId: "rn-course-237221",
  keyFileName: "rn-course.json"
}
const gcs = require("@google-cloud/storage")(gcconfig);
const UUID = require("uuid-v4");

admin.initializeApp({
  credential: admin.credential.cert(require("./rn-course.json"))
})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storeImage = functions.https.onRequest((request, response) => {

  cors(request, response, () => {
    
    if (!request.headers.authorization || !request.headers.authorization.startsWith("Bearer ")){
      response.status(403).json({message: "Unauthorized! Token is missing!"});
      return;
    }
    
    let idToken = request.headers.authorization.split("Bearer ")[1];
    admin.auth().verifyIdToken(idToken)
    .then(decodedToken =>{
      const body = JSON.parse(request.body);
      fs.writeFileSync(
        "/tmp/uploaded-image.jpg", 
        body.image, 
        "base64", 
        err => {
          console.log(err);
          return response.status(500).json({ error: err});
        }
      );
      const bucket = gcs.bucket("rn-course-237221.appspot.com");
      const uuid = UUID();
  
      bucket.upload(
        "/tmp/uploaded-image.jpg", 
        {
          uploadType: "media",
          destination: "/places/"+uuid+".jpeg",
          metadata: {
            metadata: {
              contentType: "image/jpeg",
              firebaseStorageDownloadTokens: uuid
            } 
          }
        },
        (err, file) => {
          if (!err) {
            response.status(201).json({
              imageUrl: "https://firebasestorage.googleapis.com/v0/b/" +
                        bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid,
              imagePath: "/places/"+uuid+".jpeg" 
            });
          } else {
            console.log(err);
            response.status(500).json({ error: err});
          }
        }
      );
    })
    .catch(err => {
      console.log("Token is invalid!");
      response.status(403).json({ message: "Unauthorized! Token cannot be verified!", error: err});
    })
  });
});

exports.deleteImage = functions.database.ref("/places/{placeId}").onDelete(snapshot => {
  const placeData = snapshot.val();
  const imagePath = placeData.imagePath;

  const bucket = gcs.bucket("rn-course-237221.appspot.com");
  bucket.file(imagePath).delete();
});
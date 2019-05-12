/*
  Deploy:   firebase deploy --only functions
  Run locally: tsc; firebase serve --only functions
  Firebase: magic
*/ 

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const Firestore = require('@google-cloud/firestore');

const db = () => {
  const database = new Firestore();
  return database
}

const handleOptions = (req, res, next) => {
  if(req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
}

const logRequest = (req, res, next) => {
  console.log('Request received');
  console.log('Body: ', req.body);
  console.log('Query: ', req.query);
  next();
}

const validateFirebaseIdToken = (req, res, next) => {
  console.log('validateFirebaseIdToken: Requested URL: ', req.url);

  if(req.url === '/screens' && req.method === 'POST'){
    return next();
  }

  if(req.url === '/receipts' && req.method === 'POST'){
    return next();
  }

  if(req.url === '/outdatedmessages' && req.method === 'DELETE'){
    return next();
  }

  if(req.url === '/outdatedscreens' && req.method === 'DELETE'){
    return next();
  }

  if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
      !req.cookies.__session) {
    console.error('Missing authentication',
        'Use HTTP header: ',
        'Authorization: Bearer <FirebaseIdToken>');
    res.status(403).send('Unauthorized');
    return;
  }

  let idToken;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    // Read the ID Token from the Authorization header.
    idToken = req.headers.authorization.split('Bearer ')[1];
    // console.log('idToken: ', idToken);
  } else {
    console.log('Found "__session" cookie');
    // Read the ID Token from cookie.
    idToken = req.cookies.__session;
  }
  admin.auth().verifyIdToken(idToken).then((decodedIdToken) => {
  // auth.verifyIdToken(idToken).then((decodedIdToken) => {
    req.user = decodedIdToken;
    return next();
  }).catch((error) => {
    console.error('Error while verifying Firebase ID token:', error);
    res.status(403).send('Unauthorized');
  });
};

app.use(cors);
app.use(cookieParser);
app.use(handleOptions);
app.use(logRequest);
app.use(validateFirebaseIdToken);
app.get('/hello', (req, res) => {
  res.send(`Hello ${req.query.name}`);
});


require('./outdatedmessages')(app, db);
require('./messages')(app, db);
require('./receipts')(app, db);
require('./screens')(app, db);
require('./outdatedscreens')(app, db);

console.log('message-function server starting...');
exports.app = functions.https.onRequest(app);


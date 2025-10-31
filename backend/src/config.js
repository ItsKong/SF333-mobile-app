const firebase = require('firebase')
const firebaseConfig = {
  apiKey: "AIzaSyDe4Qd-ivX_WW4KZopkuFPOYjjnO9KNdd8",
  authDomain: "fantistic-11b5f.firebaseapp.com",
  databaseURL: "https://fantistic-11b5f-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "fantistic-11b5f",
  storageBucket: "fantistic-11b5f.firebasestorage.app",
  messagingSenderId: "208407179156",
  appId: "1:208407179156:web:93b41eedc6faaca4d4e981",
  measurementId: "G-P4QBG6MRTT"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const User = db.collection("Users");
module.exports = User;
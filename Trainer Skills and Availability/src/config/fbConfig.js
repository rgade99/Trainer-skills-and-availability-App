//Configuration details for Firebase
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var fbConfig = {
    apiKey: "AIzaSyAgXcyHnHWhXpsxXzrFV2LQt5pOwfQH8-Q",
    authDomain: "cshapp-2b06a.firebaseapp.com",
    databaseURL: "https://cshapp-2b06a.firebaseio.com",
    projectId: "cshapp-2b06a",
    storageBucket: "cshapp-2b06a.appspot.com",
    messagingSenderId: "229291526957",
    appId: "1:229291526957:web:4e313549b0091fcf47e1a4",
    measurementId: "G-JQYGGL1Z4H"
  };
  // Initialize Firebase
  firebase.initializeApp(fbConfig);

  export default fbConfig;

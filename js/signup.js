// Initialize Firebase
var config = {
    apiKey: "AIzaSyBhYCyUQE0XiOGHhzhelNdtGwBsYj8Af7Y",
    authDomain: "easy-poll-54c41.firebaseapp.com",
    databaseURL: "https://easy-poll-54c41.firebaseio.com",
    projectId: "easy-poll-54c41",
    storageBucket: "easy-poll-54c41.appspot.com",
    messagingSenderId: "7924447937"
};
firebase.initializeApp(config);

var signIn = document.getElementById('signIn');
var signUp = document.getElementById('signUp');
var redirect_signup = document.getElementById('redirect_signup');

signIn.addEventListener('click', login);
signUp.addEventListener('click', login);
redirect_signup.addEventListener('click', login);

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function (result) {
        window.location.href = '/dashboard.html';
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
        console.log(errorCode);
        console.log(errorMessage);
        console.log(email);
        console.log(credential);
    });
}

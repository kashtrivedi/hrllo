var app;
var database;

window.onload = function () {
    setup();
}

function setup() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBhYCyUQE0XiOGHhzhelNdtGwBsYj8Af7Y",
        authDomain: "easy-poll-54c41.firebaseapp.com",
        databaseURL: "https://easy-poll-54c41.firebaseio.com",
        projectId: "easy-poll-54c41",
        storageBucket: "easy-poll-54c41.appspot.com",
        messagingSenderId: "7924447937"
    };
    app = firebase.initializeApp(config);

    app.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            main(user);
        } else {
            // No user is signed in.
            window.location.href = '/';
        }
    });
}

function main() {
    
}

function getOldData(doc) {
    title = doc.data().title;
    desc = doc.data().description;
    opts = doc.data().options;
}
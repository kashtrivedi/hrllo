function setup(cb) {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBhYCyUQE0XiOGHhzhelNdtGwBsYj8Af7Y",
        authDomain: "easy-poll-54c41.firebaseapp.com",
        databaseURL: "https://easy-poll-54c41.firebaseio.com",
        projectId: "easy-poll-54c41",
        storageBucket: "easy-poll-54c41.appspot.com",
        messagingSenderId: "7924447937"
    };
    window.app = firebase.initializeApp(config);
    window.database = window.app.firestore();

    window.app.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            window.user = user;
            return cb();
        } else if (window.location.href !== '/') {
            // No user is signed in.
            window.location.href = '/';
        }
    });
}

window.onload = () => setup(main);
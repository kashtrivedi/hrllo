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

    window.app.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            window.user = user;
            if (window.location.pathname === "/dashboard.html") {
                return cb();
            } else if (window.location.pathname === '/index.html') {
                window.location.href = '/dashboard.html';
                return cb();
            } else {
                return cb();
            }
        } else {
            if (window.location.pathname === '/') {
                return cb();
            } else {
                window.location.href = '/';
                return cb();
            }
        }
    });
}

window.onload = () => setup(main);
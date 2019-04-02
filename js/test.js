function cb(x) {
    return;
}


db.add(data, cb);




db.add(data, function cb(x) {
    return;
});

db.add(data, cb);



db.add(data, function (x) {
    return;
});

db.add(data, (x) => {
    return;
});

.forEach(function(val) {
    return;
})

.forEach(function renderPoll(doc) {

})

.forEach(renderPoll)




// init.js

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
            window.user = user
            return cb();
        } else {
            // No user is signed in.
            window.location.href = '/';
        }
    });
}

window.onload = () => setup(main)
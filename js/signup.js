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
            window.location.href = '/dashboard.html';
            return cb();
        } else if (window.location.href !== '/') {
            // No user is signed in.
            window.location.href = '/';
        }
    });
}

window.onload = () => setup(main);

function main() {
    $('#signIn').on('click', login);
    $('#signUp').on('click', login);
    $('#redirectSignup').on('click', login);
};

function login() {
    firebase.auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
            var uid = result.user.uid;
            return database.collection('info')
                .where("uid", "==", uid).get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        return database.collection('info').add({
                            uid: uid,
                            karma: 0,
                            polls_created: 0,
                            polls_participated: 0
                        });
                    }
                });
        })
        .then(() => window.location.href = '/dashboard.html')
        .catch((error) => {
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

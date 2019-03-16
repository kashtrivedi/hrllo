// If user is on a page without signing in then redirect to sign in page
if (getCookie("displayName") == "" || getCookie("email") == "") {
    window.location.href = '../index.html';
}

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

var database = firebase.firestore();
var form = document.getElementById('create-poll-form');

window.onload = function() {
    saveData();
}

function saveData() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        database.collection('polls').add({
            title: form.title.value,
            description: form.desc.value,
        })
        setInterval(function() {
            window.location.href = '../dashboard.html';
        }, 2000)
    })
}
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

var profilePic = $("#pro-pic");
var profileName = $("#pro-name");
var profileEmail = $("#pro-email");
var firestore = firebase.firestore();
var docRef = firestore.doc("polls/2iZMIHyKKKkULGzL4eNu/poll_1/title");

window.onload = function () {
    displayProfile();
};


function displayProfile() {
    profilePic.attr('src', getCookie("photo"));
    profileName.html(getCookie("displayName"));
    profileEmail.html(getCookie("email"));

    docRef.get().then(function (doc) {
        var myData = doc.data();
        console.log(myData);
    })

    var poll = {
        title: "Vacation",
        description: "Where shall we go for our vacation trip?",
        options: ["Manali", "Andaman", "Goa", "Wayanad"]
    }

    var user = {
        karma: 25,
        polls_created: 10,
        polls_participated: 35
    }

    $(".cre-pl h4").html(poll.title);
    $(".cre-pl p").html(poll.description);
    $('.cre-pl ul').append(poll.options.map(t => $('<li>').text(t)));

    $("#karma").html(user.karma);
    $("#created").html(user.polls_created);
    $("#participated").html(user.polls_participated);

}


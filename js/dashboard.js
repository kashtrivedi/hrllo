var app;
var database;
var count = 0;

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

function main(user) {
    database = app.firestore();
    var profilePic = $('#pro-pic');

    var Today = moment().format("YYYY-MM-DD HH:mm").valueOf();
    var epochToday = moment(Today, "YYYY-MM-DD HH:mm").valueOf();

    profilePic.attr('src', user.photoURL);

    database.collection('polls').where("uid", "==", user.uid).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderPollTitle(doc);
            if (doc.data().endsOn > epochToday) {
                renderActivePoll(doc);
            } else {
                renderInactivePoll(doc);
            }
        })
    })
}

function renderPollTitle(doc) {
    var title = doc.data().title;
    count = count +1;

    var pollTitles = `
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="list-nm">
                        <p id="title${count}">${title}</p>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="action-icons">
                        <ul>
                            <li><a href="#"><img src="images/ic1.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" onclick="window.location.href='/poll-stats.html';"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#pollTitles').append(pollTitles);
}

function renderActivePoll(doc) {
    var title = doc.data().title;

    var pollTitles = `
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="list-nm">
                        <p>${title}</p>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="action-icons">
                        <ul>
                            <li><a href="#"><img src="images/ic1.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" onclick="window.location.href='/poll-stats.html';"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#activePolls').append(pollTitles);
}

function renderInactivePoll(doc) {
    var title = doc.data().title;
    
    var pollTitles = `
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="list-nm">
                        <p>${title}</p>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="action-icons">
                        <ul>
                            <li><a href="#"><img src="images/ic1.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" onclick="window.location.href='/poll-stats.html';"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#inactivePolls').append(pollTitles);
}

function deletePoll() {
    var title = $().text();
    console.log(title);
    // database.collection("polls").where("title", "==", pollTitle).delete().then(function () {
    //     console.log("Document successfully deleted!");
    // }).catch(function (error) {
    //     console.error("Error removing document: ", error);
    // });

    // $('#deletePoll').modal('hide');
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
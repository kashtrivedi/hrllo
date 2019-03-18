var app;
var database;
var todayDate;
var todayTime;

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

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    todayDate = today = yyyy + '-' + mm + '-' + dd;

    var time = new Date();
    var hours = String(time.getHours());
    var min = String(time.getMinutes());

    todayTime = time = hours + ':' + min;

    profilePic.attr('src', user.photoURL);

    database.collection('polls').where("uid", "==", user.uid).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderPollTitles(doc);
            if (doc.data().date >= todayDate && doc.data().time < todayTime) {
                renderActivePolls(doc);
            } else {
                renderInactivePolls(doc);
            }
        })
    })
}

function renderPollTitles(doc) {
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
                            <li><a href="#"><img src="images/ic2.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt=""></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#pollTitles').append(pollTitles);
}

function renderActivePolls(doc) {
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
                            <li><a href="#"><img src="images/ic2.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt=""></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#activePolls').append(pollTitles);
}

function renderInactivePolls(doc) {
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
                            <li><a href="#"><img src="images/ic2.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt=""></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#inactivePolls').append(pollTitles);
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
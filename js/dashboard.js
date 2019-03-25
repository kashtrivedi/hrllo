var app;
var database;
var count = 0;
var item;
var docID;

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
    count = count + 1;

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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id, this)" id="edit${count}" data-id="${doc.id}"></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" id="item${count}" onclick="getId(this.id)"></a></li>
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
    count = count + 1;

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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id, this)" id="edit${count}" data-id="${doc.id}"></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" id="item${count}" onclick="getId(this.id)"></a></li>
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
    count = count + 1;

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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id, this)" id="edit${count}" data-id="${doc.id}"></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" id="item${count}" onclick="getId(this.id)"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#inactivePolls').append(pollTitles);
}

function getId(title) {
    item = title;
}


// TODO ASYNC
function deletePoll() {
    var titleID = `title${item[4]}`;
    var title = $(`#${titleID}`).text();
    database.collection("polls").where("title", "==", title).get().then(function (snap) {
        snap.forEach(function (doc) {
            doc.ref.delete();
        })
        console.log("Document successfully deleted!");
    }).catch(function (error) {
        console.error("Error removing document: ", error);
    });

    // Dont need to do this because reloading takes care of it
    // $(`#${titleID}`).each(function() {
    //     $(this).parent().parent().parent().parent().remove();
    // })

    setInterval(function () {
        window.location.href = "/dashboard";
    }, 2000)
}

// Poll-stats

function getStats(poll) {
    var title = $(`#title${poll[9]}`).text();
    var statOpts;

    database.collection('polls').where("title", "==", title).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            var myNode = $('.progress-poll').html('');
            $('.start-head h1').text(doc.data().title);
            $('.start-head h2').text(doc.data().description);
            statOpts = doc.data().options;
            statOpts.map((option) => addStat(option));
        })
    })
}

function addStat(option) {
    count = count + 1;
    var stat = `
        <div class="progress-reviews">
            <h4 class="stat-opt${count}"></h4>
            <div class="progress skill-bar ">
                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="50"
                    aria-valuemin="0" aria-valuemax="50">
                </div>
            </div>
            <p><img src="images/user-2.png" alt=""> 5</p>
        </div>
    `;

    $('.progress-poll').append(stat);
    $(`.stat-opt${count}`).text(option);
    $('.progress .progress-bar').css("width",
        function () {
            return $(this).attr("aria-valuenow") + "%";
        }
    )
}

function getOldData(id, docid) {
    var title = $(`#title${id[4]}`).text();
    var docID = $(docid).data("id");
    window.location.href = `/edit-poll.html?title=${title}&docID=${docID}`;
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
var app;
var database;
var count = 0;
var item;

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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // SUBMIT EDITED POLL

    var uid = user.uid;
    var form = document.getElementById('create-poll-form');

    // TODO ASYNC
    // Does not work yet, making changes
    // form.addEventListener('submit', function (e) {
    //     e.preventDefault();

    //     var title = $('#poll-title').val();

    //     var opts = [];
    //     $('.opt').each(function () {
    //         opts.push($(this).val());
    //     });

    //     var endDate = $('#endDate').val();
    //     var endTime = $('#endTime').val();
    //     var dateTime = `${endDate} ${endTime}`;
    //     var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

    //     database.collection("polls").doc(`${title}`)



    //     database.collection('polls').where("title", "==", title).get().then((snapshot) => {
    //         snapshot.docs.forEach(doc => {
    //             doc.update({
    //                 title: form.title.value,
    //                 description: form.desc.value,
    //                 options: opts,
    //                 endsOn: epochTime,
    //                 multipleSelections: form.multSelections.checked,
    //                 addOptions: form.addOptions.checked,
    //                 public: form.public.checked,
    //                 uid: uid
    //             })
    //         })
    //     })

    //     setInterval(function () {
    //         window.location.href = "/dashboard.html";
    //     }, 2000)
    // })

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id)" id="edit${count}"></a></li>
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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id)" id="edit${count}"></a></li>
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
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" onclick="getOldData(this.id)" id="edit${count}"></a></li>
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
        window.location.href = "/dashboard.html";
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getOldData(pollTitle) {
    var title = $(`#title${pollTitle[4]}`).text();

    $("body").load("/edit-poll.html");

    database.collection('polls').where("title", "==", title).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            oldData(doc);
        })
    })
}

function oldData(doc) {
    var title = doc.data().title;
    var desc = doc.data().description;
    var opts = doc.data().options;
    var epochTime = doc.data().endsOn;
    var multSelections = doc.data().multipleSelections;
    var addOptions = doc.data().addOptions;
    var public = doc.data().public;

    var dateTime = moment(epochTime).format("YYYY-MM-DD H:mm");
    var date = dateTime.slice(0, 10);
    var time = dateTime.slice(11, );

    $('#poll-title').val(title);
    $('#poll-desc').val(desc);
    $('#multSelections').prop("checked", multSelections);
    $('#addOptions').prop("checked", addOptions);
    $('#public').prop("checked", public);
    $('#endDate').val(date);
    $('#endTime').val(time);

    $("#opt-list").sortable({
        containment: "parent",
        tolerance: "pointer",
        handle: ".sortIcon",
        revert: 300,
    }).disableSelection();

    opts.map(function (option) {
        addOpt(option);
    })


}

function addOpt(option) {
    count = count + 1;
    var opt = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="Type here" id="poll-option${count}">
                <img src="images/close.png" alt="" onclick="delOpt(this)">
            </div>
        </li>
    `;

    $('#opt-list').append(opt);
    $(`#poll-option${count}`).val(option);
    $('#opt-list').sortable("refresh");
}

function delOpt(opt) {
    opt.parentNode.parentNode.remove();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
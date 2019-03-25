var app;
var count = 0;
var database;

window.onload = function () {
    setup();
};

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
    var profilePic = $("#pro-pic");
    var profileName = $("#pro-name");
    var profileEmail = $("#pro-email");

    profilePic.attr('src', user.photoURL);
    profileName.html(user.displayName);
    profileEmail.html(user.email);

    var user = {
        karma: 25,
        polls_created: 10,
        polls_participated: 35
    }

    // WORK IN PROGRESS, WILL WORK ON IT AFTER CREATE POLL

    function renderPolls(doc) {
        title = doc.data().title;
        desc = doc.data().description;
        opts = doc.data().options;
        count = count + 1;

        var output = `
            <div class="col-md-6 col-sm-6 singlePoll">
                <div class="created-poll">
                    <div class="cre-pl">
                        <h4 id="title${count}">${title}</h4>
                        <p>${desc}</p>
                        <ul class="options${count}">

                        </ul>
                    </div>
                    <div class="poll-act">
                        <ul>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        $('#polls').append(output);
        // https://www.kirupa.com/html5/dynamically_create_populate_list.htm
        $(`.options${count}`).append(opts.map(t => $('<li>').text(t)));
    }

    database.collection('polls').get().then((snapshot) => {
        var noPolls = snapshot.size;
        $("#no_polls").text(`(${noPolls})`);
        snapshot.docs.forEach(doc => {
            renderPolls(doc);
        })
    })

    $("#karma").html(user.karma);
    $("#created").html(user.polls_created);
    $("#participated").html(user.polls_participated);

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
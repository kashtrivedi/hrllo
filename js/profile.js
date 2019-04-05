var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    var profilePic = $(".profile-picture");
    var profileName = $("#pro-name");
    var profileEmail = $("#pro-email");

    profilePic.attr('src', user.photoURL);
    profileName.html(user.displayName);
    profileEmail.html(user.email);

    database.collection('info').where("uid", "==", user.uid).get().then((snapshot) => {
        var userInfo = snapshot.docs[0].data();
        $("#karma").html(userInfo.karma);
        $("#participated").html(userInfo.polls_participated);
    });

    database.collection('polls').where("uid", "==", user.uid).get().then((snapshot) => {
        var numberPolls = snapshot.size;
        $("#created").html(numberPolls);
        $("#no_polls").text(`(${numberPolls})`);
        snapshot.docs.forEach(renderPoll);
    });
}

function renderPoll(doc) {
    var title = doc.data().title;
    var desc = doc.data().description;
    var options = Object.keys(doc.data().options);
    var id = doc.id;

    var output = `
        <div class="col-md-6 col-sm-6 singlePoll">
            <div class="created-poll" data-id="${doc.id}" onclick="votePoll(this)">
                <div class="cre-pl">
                    <h4>${title}</h4>
                    <p>${desc}</p>
                    <ul id="${id}">

                    </ul>
                </div>
                <div class="poll-act">
                    <ul>
                        <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" data-id="${id}" onclick="getStats(this)"></a></li>
                        <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    $('#polls').append(output);
    options.map((option) => {
        $(`#${id}`).append(`<li>${option}</li>`);
    });

}

function votePoll(e) {
    var docID = e.getAttribute("data-id");
    window.location.href = `/vote-poll.html?docID=${docID}`;
}

// Poll-stats

function getStats(e) {
    var docID = e.getAttribute('data-id');

    database.collection('polls').doc(`${docID}`).get().then((doc) => {
        var myNode = $('.progress-poll').html('');
        $('.start-head h1').text(doc.data().title);
        $('.start-head h2').text(doc.data().description);
        var statOpts = doc.data().options;
        statOpts.forEach(function (value, i) {
            addStat(statOpts[i].option, statOpts[i].voters);
        })
    })
}

function addStat(option) {
    var stat = `
        <div class="progress-reviews">
            <h4>${option}</h4>
            <div class="progress skill-bar ">
                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="50"
                    aria-valuemin="0" aria-valuemax="50">
                </div>
            </div>
            <p><img src="images/user-2.png" alt=""> 5</p>
        </div>
    `;

    $('.progress-poll').append(stat);
    $('.progress .progress-bar').css("width",
        function () {
            return $(this).attr("aria-valuenow") + "%";
        }
    )
}
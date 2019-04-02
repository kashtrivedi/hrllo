var app = window.app;
var database = window.database;
var user = window.user;
var count = 0;

function main() {
    var profilePic = $("#profile-picture");
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
    opts.forEach(function (value, i) {
        // https://www.kirupa.com/html5/dynamically_create_populate_list.htm
        $(`.options${count}`).append([opts[i].option].map(t => $('<li>').text(t)));
    });

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
            statOpts.forEach(function (value, i) {
                addStat(statOpts[i].option, statOpts[i].votes);
            })
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
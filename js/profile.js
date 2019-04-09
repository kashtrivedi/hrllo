var app = window.app;
var database = window.database;
var user = window.user;
var allPollsVoteTotal = 0;

function main() {
    var profilePic = $(".profile-picture");
    var profileName = $("#pro-name");
    var profileEmail = $("#pro-email");

    profilePic.attr('src', user.photoURL);
    profileName.html(user.displayName);
    profileEmail.html(user.email);

    // Doing this directly with logic in the next part
    // database.collection('info').where("uid", "==", user.uid).get().then((snapshot) => {
    //     var userInfo = snapshot.docs[0].data();
    //     $("#participated").html(userInfo.polls_participated);
    // });

    database.collection('polls').where("uid", "==", user.uid).get().then((snapshot) => {
        var numberPollsCreated = snapshot.size;
        var numberPollsParticipated = 0;

        if (numberPollsCreated === 0) {
            var noPolls = `<h1 id="noCreatedPolls">You have not created any polls!</h1>`;
            $('#polls').append(noPolls);
        }

        $("#created").html(numberPollsCreated);
        $("#no_polls").text(`(${numberPollsCreated})`);
        snapshot.docs.forEach(renderPoll);
        snapshot.forEach((doc) => {
            allPollsVoteTotal +=  Object.keys(doc.data().options).length;
            Object.values(doc.data().options).every((option) => {
                if (option.includes(user.uid)) {
                    ++numberPollsParticipated;
                    return false;
                } else {
                    return true;
                }
            })
        })
        var karma = Math.round(allPollsVoteTotal / (numberPollsCreated + numberPollsParticipated));
        $('#karma').text(karma);
        $('#participated').text(numberPollsParticipated);
    });
}

function renderPoll(doc) {
    var title = doc.data().title;
    var desc = doc.data().description;
    var options = Object.keys(doc.data().options);
    var id = doc.id;

    var output = `
        <div class="col-md-6 col-sm-6 singlePoll">
            <div class="created-poll">
                <div class="cre-pl">
                    <h4 data-id="${doc.id}" onclick="votePoll(this)">${title}</h4>
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
        var options = Object.entries(doc.data().options);
        var totalVotes = 0;
        options.forEach((option) => {
            totalVotes += option[1].length;
        })
        $('#totalVotes').html(totalVotes);
        options.forEach((option) => {
            addStat(option[0], option[1].length, totalVotes);
        });
    })
}

function addStat(option, optionVotes, totalVotes) {
    var stat = `
        <div class="progress-reviews">
            <h4>${option}</h4>
            <div class="progress skill-bar ">
                <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="${optionVotes}"
                    aria-valuemin="0" aria-valuemax="${totalVotes}">
                </div>
            </div>
            <p><img src="images/user-2.png" alt="">${optionVotes}</p>
        </div>
    `;

    $('.progress-poll').append(stat);
    $('.progress .progress-bar').css("width",
        function () {
            var votes = $(this).attr("aria-valuenow");
            var totalVotes = $(this).attr("aria-valuemax")
            var votePerctentage = (votes/totalVotes) * 100;
            return `${votePerctentage}%`;
        }
    )
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
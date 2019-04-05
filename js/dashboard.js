var app = window.app;
var database = window.database;
var user = window.user;
var item;
var docID;
var infoID;

function main() {
    var today = moment().format("YYYY-MM-DD HH:mm").valueOf();
    var epochToday = moment(today, "YYYY-MM-DD HH:mm").valueOf();

    $('#profile-picture').attr('src', user.photoURL);

    database.collection('polls').where("uid", "==", user.uid).orderBy("endsOn", "desc").get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            var isActive;
            if (doc.data().endsOn > epochToday) {
                isActive = true;
                renderPollTitle(doc, isActive);
                renderActivePoll(doc);
            } else {
                isActive = false;
                renderPollTitle(doc, isActive);
                renderInactivePoll(doc);
            }
        })
    })
}

function renderPollTitle(doc, isActive) {
    var title = doc.data().title;

    if (isActive) {
        var pollTitle = `
            <li>
                <div class="row">
                    <div class="col-sm-8">
                        <div class="list-nm">
                            <p data-id="${doc.id}" onclick="votePoll(this)">${title}</p>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="action-icons">
                            <ul>
                                <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" data-id="${doc.id}" onclick="editThisPoll(this)"></a></li>
                                <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" data-id="${doc.id}" onclick="getStats(this)"></a></li>
                                <li><a href="#"><img src="images/ic3.png" alt="Share" data-id="${doc.id}"></a></li>
                                <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" data-id="${doc.id}" onclick="showDeleteModal(this)"></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        `;

        $('#pollTitles').append(pollTitle);
    } else {
        var pollTitle = `
            <li>
                <div class="row">
                    <div class="col-sm-8">
                        <div class="list-nm">
                            <p data-id="${doc.id}" onclick="votePoll(this)">${title}</p>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="action-icons">
                            <ul>
                                <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" data-id="${doc.id}" onclick="getStats(this)"></a></li>
                                <li><a href="#"><img src="images/ic3.png" alt="Share" data-id="${doc.id}"></a></li>
                                <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" data-id="${doc.id}" onclick="showDeleteModal(this)"></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        `;

        $('#pollTitles').append(pollTitle);
    }
}

function renderActivePoll(doc) {
    var title = doc.data().title;

    var pollTitle = `
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="list-nm">
                        <p data-id="${doc.id}" onclick="votePoll(this)">${title}</p>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="action-icons">
                        <ul>
                            <li><a href="#"><img src="images/ic1.png" alt="Edit Poll" data-id="${doc.id}" onclick="editThisPoll(this)"></a></li>
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" data-id="${doc.id}" onclick="getStats(this)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt="Share" data-id="${doc.id}"></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" data-id="${doc.id}" onclick="showDeleteModal(this)"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#activePolls').append(pollTitle);
}

function renderInactivePoll(doc) {
    var title = doc.data().title;
    var pollTitle = `
            <li>
                <div class="row">
                    <div class="col-sm-8">
                        <div class="list-nm">
                            <p data-id="${doc.id}" onclick="votePoll(this)">${title}</p>
                        </div>
                    </div>
                    <div class="col-sm-4">
                        <div class="action-icons">
                            <ul>
                                <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" data-id="${doc.id}" onclick="getStats(this)"></a></li>
                                <li><a href="#"><img src="images/ic3.png" alt="Share" data-id="${doc.id}"></a></li>
                                <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" data-id="${doc.id}" onclick="showDeleteModal(this)"></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </li>
        `;

    $('#inactivePolls').append(pollTitle);
}

function editThisPoll(e) {
    var docID = e.getAttribute("data-id");
    window.location.href = `/edit-poll.html?docID=${docID}`;
}

function getStats(e) {
    var docID = e.getAttribute("data-id");
    database.collection('polls').doc(`${docID}`).get().then((doc) => {
        var data = doc.data();
        $('.progress-poll').html('');
        $('.start-head h1').text(data.title);
        $('.start-head h2').text(data.description);
        var options = Object.entries(data.options);
        options.forEach((option) => {
            addStat(option[0], option[1].length);
        });
    })
}

function addStat(option, voters) {
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

function votePoll(e) {
    var docID = e.getAttribute("data-id");
    window.location.href = `/vote-poll.html?docID=${docID}`;
}

function showDeleteModal(e) {
    var listItem = $(e);
    var docID = e.getAttribute("data-id");
    $('#deleteModal').attr('data-deleteid', docID);
    $('#deleteModal').modal('show');

}

function deletePoll() {
    var docID = $('#deleteModal').data("deleteid");

    database.collection('polls').doc(`${docID}`).delete()
        .then(() => console.log("Document successfully deleted!"))
        .then(() => window.location.href = "/dashboard.html")
        .catch((error) => {
            console.error("Error removing document: ", error);
        })
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
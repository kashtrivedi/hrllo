var app = window.app;
var database = window.database;
var user = window.user;
var count = 0;
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
    count = count + 1;

    if (isActive) {
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
    } else {
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
    ++count;

    // var pollTitle = `
    //     <li>
    //         <div class="row">
    //             <div class="col-sm-8">
    //                 <div class="list-nm">
    //                     <p id="title${count}">${title}</p>
    //                 </div>
    //             </div>
    //             <div class="col-sm-4">
    //                 <div class="action-icons">
    //                     <ul>
    //                         <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
    //                         <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
    //                         <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" data-toggle="modal" data-target="#deletePoll" id="item${count}" onclick="getId(this.id)"></a></li>
    //                     </ul>
    //                 </div>
    //             </div>
    //         </div>
    //     </li>
    // `;

    var pollTitle = `
        <li>
            <div class="row">
                <div class="col-sm-8">
                    <div class="list-nm">
                        <p id="title${count}">${doc.data().title}</p>
                    </div>
                </div>
                <div class="col-sm-4">
                    <div class="action-icons">
                        <ul data-id="${doc.id}">
                            <li><a href="#"><img src="images/ic2.png" alt="Statistics" data-toggle="modal" data-target=".bd-example-modal-lg" class="pollStats${count}" onclick="getStats(this.className)"></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic4.png" alt="Delete Poll" onclick="showDeleteModal(this)"></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </li>
    `;

    $('#inactivePolls').append(pollTitle);
}

function showDeleteModal(e) {
    var listItem = $(e);
    $('#deleteModal').attr('data-deleteId', listItem.parent().parent().parent().data('id'));
    $('#deleteModal').modal('show');
}

function getId(title) {
    item = title;
}


// TODO ASYNC
function deletePoll() {
    var titleID = `title${item[4]}`;
    var title = $(`#${titleID}`).text();
    database.collection("polls").where("title", "==", title).get().then((snap) => {
        snap.forEach((doc) => doc.ref.delete());
        console.log("Document successfully deleted!");
    })
    .then(() => window.location.href = "/dashboard.html")
    .catch((error) => {
        console.error("Error removing document: ", error);
    })

    // Dont need to do this because reloading takes care of it
    // $(`#${titleID}`).each(function() {
    //     $(this).parent().parent().parent().parent().remove();
    // })
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
            });
        })
    })
}

function addStat(option, votes) {
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
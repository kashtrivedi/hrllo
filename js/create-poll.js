var app = window.app;
var database = window.database;
var user = window.user;
var infoID;

function main() {
    $('#profile-picture').attr('src', user.photoURL);
    var uid = user.uid;
    var database = app.firestore();
    var form = document.getElementById('create-poll-form');

    database.collection('info')
        .where("uid", "==", uid).get()
        .then((snapshot) => {
            infoID = snapshot.docs[0].id;
        });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var options = [];

        $('.opt').get().map((option) => {
            options.push($(option).val());
        });

        if (options.length < 2) {
            alert('Minimum of 2 options are needed!');
            return;
        }

        // Storing options as object -> option_name: array of voters_uid (initialized as empty)
        var dbOptions = options.reduce((acc, elem) => { acc[elem] = []; return acc; }, {});

        var endDate = $('#endDate').val();
        var endTime = $('#endTime').val();
        var dateTime = `${endDate} ${endTime}`;
        var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        database.collection('polls').add({
            title: form.title.value,
            description: form.desc.value,
            options: dbOptions,
            endsOn: epochTime,
            multipleSelections: form.multipleSelections.checked,
            addOptions: form.addOptions.checked,
            public: form.public.checked,
            uid: uid,
        }).then(() => window.location.href = "/dashboard.html")
    })

    $("#opt-list").sortable({
        containment: "parent",
        tolerance: "pointer",
        handle: ".sortIcon",
        revert: 300,
    }).disableSelection();
}

function addOpt() {
    var option = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="" required>
                <img src="images/close.png" alt="" onclick="delOpt(this)">
            </div>
        </li>
    `;

    $('#opt-list').append(option);
    $('#opt-list').sortable("refresh");
}

function delOpt(opt) {
    opt.parentNode.parentNode.remove();
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
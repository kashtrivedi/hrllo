var app = window.app;
var database = window.database;
var user = window.user;

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

    // TODO ASYNC
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var opts = [];

        $('.opt').each(function () {
            var option = {};
            option["option"] = $(this).val();
            option["votes"] = 0;
            opts.push(option);
        });

        var endDate = $('#endDate').val();
        var endTime = $('#endTime').val();
        var dateTime = `${endDate} ${endTime}`;
        var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        //Delete this after async done
        database.collection('polls').add({
            title: form.title.value,
            description: form.desc.value,
            options: opts,
            endsOn: epochTime,
            multipleSelections: form.multipleSelections.checked,
            addOptions: form.addOptions.checked,
            public: form.public.checked,
            uid: uid,
        }).then(() => window.location.href = "/dashboard.html")
    })

    // ADD USER INFO LOGIC HERE, update karma and polls created

    //

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
                <input class="opt" type="text" placeholder="Type here" required>
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
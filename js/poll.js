var app;

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
    var uid = user.uid;
    var database = app.firestore();
    var form = document.getElementById('create-poll-form');

    // TODO ASYNC
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // var submitData = new Promise(function (resolve, reject) {
        //     var opts = [];
        //     $('.opt').each(function () {
        //         opts.push($(this).val());
        //     });

        //     var endDate = $('#endDate').val();
        //     var endTime = $('#endTime').val();
        //     var dateTime = `${endDate} ${endTime}`;
        //     var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        //     database.collection('polls').add({
        //         title: form.title.value,
        //         description: form.desc.value,
        //         options: opts,
        //         endsOn: epochTime,
        //         multipleSelections: form.multSelections.checked,
        //         addOptions: form.addOptions.checked,
        //         public: form.public.checked,
        //         uid: uid,
        //     })
        //     resolve();
        // })

        // submitData.then(function () {
        //     window.location.href = '../dashboard.html';
        // })

        var opts = [];
        $('.opt').each(function () {
            opts.push($(this).val());
        });

        var endDate = $('#endDate').val();
        var endTime = $('#endTime').val();
        var dateTime = `${endDate} ${endTime}`;
        var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        database.collection('polls').add({
            title: form.title.value,
            description: form.desc.value,
            options: opts,
            endsOn: epochTime,
            multipleSelections: form.multSelections.checked,
            addOptions: form.addOptions.checked,
            public: form.public.checked,
            uid: uid,
        })

        setInterval(function() {
            window.location.href="/dashboard.html";
        }, 2000)
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
                <input class="opt" type="text" placeholder="Type here">
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
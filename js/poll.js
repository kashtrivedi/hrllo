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

        var opts = [];
        $('.opt').each(function () {
            opts.push($(this).val());
        });

        database.collection('polls').add({
            title: form.title.value,
            description: form.desc.value,
            options: opts,
            date: form.date.value,
            time: form.time.value,
            multipleSelections: form.multSelection.checked,
            addOptions: form.addOptions.checked,
            uid: uid,
        })
        setInterval(function () {
            window.location.href = '../dashboard.html';
        }, 2000);
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
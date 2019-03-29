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
    $('#pro-pic').attr('src', user.photoURL);
    var uid = user.uid;
    var database = app.firestore();
    var form = document.getElementById('create-poll-form');

    database.collection('info').where("uid", "==", uid).get().then((snapshot) => {
        infoID = snapshot.docs[0].id;
    })

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
            multipleSelections: form.multSelections.checked,
            addOptions: form.addOptions.checked,
            public: form.public.checked,
            uid: uid,
        })
        
        // ADD USER INFO LOGIC HERE, update karma and polls created
        database.collection('info').where("uid", "==", uid).get().then((snapshot) => {
            var incPollsCreated = snapshot.docs[0].data().polls_created + 1;
            database.collection('info').doc(`${infoID}`).update({
                // karma = // INSERT LOGIC 
                polls_created: incPollsCreated,
            })
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
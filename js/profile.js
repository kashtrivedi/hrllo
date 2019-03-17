// Initialize Firebase
var config = {
    apiKey: "AIzaSyBhYCyUQE0XiOGHhzhelNdtGwBsYj8Af7Y",
    authDomain: "easy-poll-54c41.firebaseapp.com",
    databaseURL: "https://easy-poll-54c41.firebaseio.com",
    projectId: "easy-poll-54c41",
    storageBucket: "easy-poll-54c41.appspot.com",
    messagingSenderId: "7924447937"
};
firebase.initializeApp(config);

var profilePic = $("#pro-pic");
var profileName = $("#pro-name");
var profileEmail = $("#pro-email");
var database = firebase.firestore();

window.onload = function () {
    displayProfile();
};


function displayProfile() {
    profilePic.attr('src', getCookie("photo"));
    profileName.html(getCookie("displayName"));
    profileEmail.html(getCookie("email"));

    var user = {
        karma: 25,
        polls_created: 10,
        polls_participated: 35
    }

    // WORK IN PROGRESS, WILL WORK ON IT AFTER CREATE POLL

    function renderPolls(doc) {
        title = doc.data().title;
        desc = doc.data().description;
        opts = doc.data().options;

        // opts.forEach(op => {
        //     console.log(op);
        // })

        var output = `
            <div class="col-md-6 col-sm-6">
                <div class="created-poll">
                    <div class="cre-pl">
                        <h4>${title}</h4>
                        <p>${desc}</p>
                        <ul id="options">

                        </ul>
                    </div>
                    <div class="poll-act">
                        <ul>
                            <li><a href="poll-stats.html"><img src="images/ic2.png" alt=""></a></li>
                            <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        $('#polls').append(output);
        // https://www.kirupa.com/html5/dynamically_create_populate_list.htm
        $('#options').append(opts.map(t => $('<li>').text(t)));
    }

    database.collection('polls').get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            renderPolls(doc);
        })
    })

    $("#karma").html(user.karma);
    $("#created").html(user.polls_created);
    $("#participated").html(user.polls_participated);

}


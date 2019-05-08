var onclickVal;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBhYCyUQE0XiOGHhzhelNdtGwBsYj8Af7Y",
    authDomain: "easy-poll-54c41.firebaseapp.com",
    databaseURL: "https://easy-poll-54c41.firebaseio.com",
    projectId: "easy-poll-54c41",
    storageBucket: "easy-poll-54c41.appspot.com",
    messagingSenderId: "7924447937"
};
var app = firebase.initializeApp(config);
var database = window.app.firestore();

window.onload = () => {
    app.auth().onAuthStateChanged(function (user) {
        if (!user) {
            login();
        }
        main(user);
    })
}

function login() {
    firebase.auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
            var uid = result.user.uid;
            return database.collection('info')
                .where("uid", "==", uid).get()
                .then((snapshot) => {
                    if (snapshot.empty) {
                        return database.collection('info').add({
                            uid: uid,
                            polls_created: 0,
                            polls_participated: 0
                        });
                    }
                });
        })
        .then(() => window.location.href = window.location.href)
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
            console.log(errorCode);
            console.log(errorMessage);
            console.log(email);
            console.log(credential);
        });
}

function main(user) {
    if (user) {

        $("#profile-picture").attr('src', user.photoURL);
        var url = window.location.href;
        var urlInfo = url.split('?');
        var docID = urlInfo[1];
        var form = $('#votePollForm');

        database.collection('polls').doc(`${docID}`).get()
            .then((doc) => {
                var data = doc.data();
                $("#votePollTitle").text(`${data.title}`);
                $("#votePollDescription").text(`${data.description}`);

                if (data.addOptions) {
                    $('#voteAddOption').css('display', 'flex');
                } else {
                    $('#voteAddOption').css('display', 'none');
                }

                var options = Object.keys(data.options);

                var iconType;
                var selection;

                if (data.multipleSelections) {
                    iconType = "checkmark";
                    onclickVal = "";
                    $('#voteAddOptionBtn').attr('data-selection', true);
                    $('#ifMultipleSelections').text('You can choose MULTIPLE options');
                } else {
                    iconType = "dotIcon";
                    onclickVal = "oneOptionAllowed()";
                    $('#voteAddOptionBtn').attr('data-selection', false);
                    $('#ifMultipleSelections').text('You can only choose ONE option');
                }

                options.map((option) => `<li class='votePollOption'>${option}<label class='cus-chek votePollCheckbox'><input type='checkbox' class='optionSelector allOptions' onclick='${onclickVal}'><span class='displayIcon ${iconType}'></span></label></li>`).forEach((li) => $("#votePollOptions").append(li))


                // Disable voting if user is creator of poll
                if (data.uid === user.uid) {
                    disableVoting();
                    $("#submitVote").text("NOT ALLOWED");
                }

                // If user has already voted, displays vote else disables voting
                var optionValues = Object.values(data.options);
                optionValues.forEach((optionValue, i) => {
                    optionValue.forEach((voter) => {
                        if (voter === user.uid) {
                            var votedOption = $('.optionSelector').get(i);
                            $(votedOption).attr('checked', 'true');

                            // Remove this if editing vote option is allowed
                            // Code for disabling voting multiple times
                            disableVoting();
                            $("#submitVote").text("ALREADY VOTED");
                        }
                    })
                })

                // Disables voting if the poll has expired
                var today = moment().format("YYYY-MM-DD HH:mm").valueOf();
                var epochToday = moment(today, "YYYY-MM-DD HH:mm").valueOf();
                if (data.endsOn < epochToday) {
                    disableVoting();
                    $("#submitVote").text("EXPIRED");
                }
            })


        form.on('submit', (e) => {
            e.preventDefault();

            var inputs = $('input.optionSelector').get();
            var checkedInputs = inputs.filter((e) => $(e).prop('checked'));
            var oldChecked = checkedInputs.map((e) => $(e).parent().parent().text());
            var newCheckedInputs = $('input.newOptionSelector').get().filter((e) => $(e).prop('checked'));
            var newCheckedOptions = newCheckedInputs.map((e) => {
                var input = $(e).parent().parent().children()[0];
                return $(input).val();
            })

            var newOptions = $('input.newOptionSelector').get().map((e) => {
                var input = $(e).parent().parent().children()[0];
                return $(input).val();
            })

            var checked = oldChecked.concat(newCheckedOptions);
            var options = inputs.map((e) => $(e).parent().parent().text());

            var updatedOptions = options.concat(newOptions);

            if (checked.length === 0) {
                $('#error-message p').text('Select atleast one option!');
                displayError();
                return;
            }

            database.collection('polls').doc(`${docID}`).get()
                .then((doc) => {
                    var entries = Object.entries(doc.data().options);
                    var options = entries.reduce((acc, [option, uids]) => {
                        if (checked.includes(option)) {
                            uids.push(user.uid);
                        }

                        acc[option] = uids;
                        return acc;
                    }, {})

                    var allOptions = newOptions.reduce((acc, option) => {
                        var uids = [];
                        if (checked.includes(option)) {
                            uids.push(user.uid);
                        }
                        acc[option] = uids;
                        return acc;
                    }, options);

                    return database.collection('polls').doc(`${docID}`)
                        .update({
                            options: allOptions,
                        })
                })
                .then(() => {
                    window.location.href = '/dashboard.html';
                })
        })
    }
}

function disableVoting() {
    var allOptions = $(".optionSelector").get();
    $(allOptions).attr("disabled", true);
    $("#submitVote").attr("disabled", true);
    $("#voteAddOptionBtn").css("display", 'none');
    $(".cus-chek").css("cursor", "default");
}

function oneOptionAllowed() {
    $('input.allOptions').on('change', function () {
        $(`input.allOptions`).not(this).prop('checked', false);
    });
}

function displayError() {
    $('#center-error').fadeIn(0, () => {
        $('#center-error').css('display', 'flex');
    })

    setTimeout(() => {
        $('#center-error').fadeOut("fast", () => {
            $('#center-error').css('display', 'none');
        })
    }, 5000);
    $(".newPollOption").focus();
}

function addVoteOption(selection) {
    var empty = false;
    $('.newPollOption').get().some((option) => {
        if (option.value == "") {
            $('#error-message p').text('Please fill in the empty option!');
            displayError();
            empty = true;
            return;
        }
    })

    if (!empty) {

        $("#votePollOptions").append(`<li class='votePollOption'><input class='newPollOption' placeholder="Option" required><img src="images/close.png" alt="Delete Option" id="deleteNewOption" onclick="delOpt(this)"><label class='cus-chek votePollCheckbox'><input type='checkbox' class='newOptionSelector allOptions' onclick='${onclickVal}'><span class='displayIcon'></span></label></li>`);
        $(".newPollOption").focus();

        if (selection.getAttribute("data-selection") == "true") {
            $('.displayIcon').addClass("checkmark");
        } else {
            $('.displayIcon').addClass("dotIcon");
        }
    }
}

function delOpt(opt) {
    opt.parentNode.remove();
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
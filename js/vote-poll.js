var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    $("#profile-picture").attr('src', user.photoURL);
    var url = window.location;
    var urlString = new URL(url);
    var docID = urlString.searchParams.get("docID");
    var form = $('#votePollForm');

    database.collection('polls').doc(`${docID}`).get()
        .then((doc) => {
            var data = doc.data();
            $("#votePollTitle").text(`${data.title}`);
            $("#votePollDescription").text(`${data.description}`);
            var options = Object.keys(data.options);

            if (data.multipleSelections) {
                $('#ifMultipleSelections').text('You can choose MULTIPLE options');

                options.map((option) => {
                    $("#votePollOptions").append(`<li class='votePollOption'>${option}<label class='cus-chek votePollCheckbox'><input type='checkbox' class="optionSelection"><span class='displayIcon'></span></label>`);
                });

                $('.displayIcon').addClass("checkmark");

            } else {
                $('#ifMultipleSelections').text('You can only choose ONE option');

                options.map((option) => {
                    $("#votePollOptions").append(`<li class='votePollOption'>${option}<label class='cus-chek votePollCheckbox'><input type='checkbox' class="optionSelection" onclick="oneOptionAllowed()"><span class='displayIcon'></span></label>`);
                });

                $('.displayIcon').addClass("dotIcon");
            }

            // If user has already voted, displays vote else disables voting
            var optionValues = Object.values(data.options);
            optionValues.forEach((optionValue, i) => {
                optionValue.forEach((voter) => {
                    if (voter === user.uid) {
                        var votedOption = $('.optionSelection').get(i);
                        $(votedOption).attr('checked', 'true');

                        // Remove this if editing vote option is allowed
                        var allOptions = $(".optionSelection").get();
                        $(allOptions).attr("disabled", true);
                        $("#submitVote").attr("disabled", true);
                        $("#submitVote").text("DISABLED");
                    }
                })
            })
        })

    form.on('submit', (e) => {
        e.preventDefault();

        var inputs = $('input.optionSelection').get();
        var checkedInputs = inputs.filter((e) => $(e).prop('checked'));
        var checked = checkedInputs.map((e) => $(e).parent().parent().text())
        var options = inputs.map((e) => $(e).parent().parent().text())

        if (checked.length === 0) {
            alert('Select atleast one option');
            return;
        }

        var entries;
        database.collection('polls').doc(`${docID}`).get()
            .then((doc) => {
                entries = Object.entries(doc.data().options);
            })
            .then(() => {
                database.collection('polls').doc(`${docID}`)
                    .update({
                        options: 
                            entries.reduce((acc,elem) => {
            
                                if (checked.includes(elem[0])) {
                                    elem[1].push(user.uid);
                                }
            
                                acc[elem[0]] = elem[1]; 
                                return acc;
                            }, {})
                    })
                    .then(() => {
                        window.location.href = '/dashboard.html';
                    })
            })


    })

}

function oneOptionAllowed() {
    $('input.optionSelection').on('change', function () {
        $(`input.optionSelection`).not(this).prop('checked', false);
    });
}

function signOut() {
    firebase.auth().signOut().then(function () {

    }, function (error) {
        console.error('Sign Out Error', error);
    });
}
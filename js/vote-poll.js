var app = window.app;
var database = window.database;
var user = window.user;
var onclickVal;

function main() {
    $("#profile-picture").attr('src', user.photoURL);
    var url = new URL(window.location);
    var docID = url.searchParams.get("docID");
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


            // If user has already voted, displays vote else disables voting
            var optionValues = Object.values(data.options);
            optionValues.forEach((optionValue, i) => {
                optionValue.forEach((voter) => {
                    if (voter === user.uid) {
                        var votedOption = $('.optionSelector').get(i);
                        $(votedOption).attr('checked', 'true');

                        // Remove this if editing vote option is allowed
                        // Code for disabling voting multiple times
                        var allOptions = $(".optionSelector").get();
                        $(allOptions).attr("disabled", true);
                        $("#submitVote").attr("disabled", true);
                        $("#voteAddOptionBtn").css("display", 'none');
                        $("#submitVote").text("DISABLED");
                    }
                })
            })

            // Disables voting if the poll has expired
            var today = moment().format("YYYY-MM-DD HH:mm").valueOf();
            var epochToday = moment(today, "YYYY-MM-DD HH:mm").valueOf();
            if (data.endsOn < epochToday) {
                var allOptions = $(".optionSelector").get();
                $(allOptions).attr("disabled", true);
                $("#submitVote").attr("disabled", true);
                $("#voteAddOptionBtn").css("display", 'none');
                $("#submitVote").text("DISABLED");
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
            alert('Select atleast one option');
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

function oneOptionAllowed() {
    $('input.allOptions').on('change', function () {
        $(`input.allOptions`).not(this).prop('checked', false);
    });
}

function addVoteOption(selection) {
    $("#votePollOptions").append(`<li class='votePollOption'><input class='newPollOption' placeholder="Option" required><img src="images/close.png" alt="Delete Option" id="deleteNewOption" onclick="delOpt(this)"><label class='cus-chek votePollCheckbox'><input type='checkbox' class='newOptionSelector allOptions' onclick='${onclickVal}'><span class='displayIcon'></span></label></li>`);

    if (selection.getAttribute("data-selection") == "true") {
        $('.displayIcon').addClass("checkmark");
    } else {
        $('.displayIcon').addClass("dotIcon");
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
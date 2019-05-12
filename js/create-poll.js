var app = window.app;
var database = window.database;
var user = window.user;
var infoID;
var index = 0;

function main() {
    $('#profile-picture').attr('src', user.photoURL);
    var uid = user.uid;
    var database = app.firestore();
    var form = document.getElementById('create-poll-form');
    var allowSubmit = true;

    database.collection('info')
        .where("uid", "==", uid).get()
        .then((snapshot) => {
            infoID = snapshot.docs[0].id;
        });

    var currentDate = moment().format('YYYY-MM-DD');
    $('#endDate').val(currentDate);

    $('#endDate').attr('min', currentDate);

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        var options = [];

        if ($('.opt').get().length < 2) {
            $('#error-message p').text('Please add atleast 2 options!');
            displayError();
        }

        $('.opt').get().map((option) => {
            options.push($(option).val());
        });

        options.forEach(option => {
            if (options.includes(option)) {
                $('#error-message p').text('2 options cannot be the same!');
                displayError();
            }
        })

        // Storing options as object -> option_name: array of voters_uid (initialized as empty)
        var dbOptions = options.reduce((acc, elem) => {
            acc[elem] = [];
            return acc;
        }, {});

        var endDate = $('#endDate').val();

        // Disables clicking on submit multiple times
        if (allowSubmit)
            allowSubmit = false;
        else
            return false;

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

function displayError() {
    $('#center-error').fadeIn(0, () => {
        $('#center-error').css('display', 'flex');
    })

    setTimeout(() => {
        $('#center-error').fadeOut("fast", () => {
            $('#center-error').css('display', 'none');
        })
    }, 5000);
}

function addOpt() {
    var empty = true;
    $('.opt').get().forEach((option) => {
        index++;
        console.log('---');
        console.log(option.value, index);
        if (option.value == "") {
            if (empty) {
                $('#error-message p').text('Please fill in the empty option!');
                displayError();
                $(option).focus();
                empty = false;
                return;
            }
        }
    })

    if (empty) {
        var option = `
                <li>
                    <div class="op-lf">
                        <img src="images/sm-bar.png" alt="" class="sortIcon">
                        <input class="opt" type="text" required>
                        <img src="images/close.png" alt="" onclick="delOpt(this)">
                    </div>
                </li>
            `;

        $('#opt-list').append(option);
        $('.opt').focus();
        $('#opt-list').sortable("refresh");
    }
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
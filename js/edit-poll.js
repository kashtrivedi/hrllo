var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    $("#profile-picture").attr("src", `${user.photoURL}`);

    var form = $('#edit-poll-form');
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pollTitle = url.searchParams.get("title");
    var docID = url.searchParams.get("docID");
    if (docID === null) {
        window.location.href = "/dashboard.html";
    }

    database.collection('polls').doc(`${docID}`).get().then(oldData);

    var currentDate = moment().format('YYYY-MM-DD');

    $('#endDate').attr('min', currentDate);

    form.on('submit', function (e) {
        e.preventDefault();

        var title = $('#poll-title').val();

        var options = [];

        $('.opt').get().map((option) => {
            options.push($(option).val());
        });

        var allOptions = options.reduce((acc, elem) => {
            acc[elem] = [];
            return acc;
        }, {});

        var endDate = $('#endDate').val();
        var endTime = $('#endTime').val();
        var dateTime = `${endDate} ${endTime}`;
        var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        var updatedTitle = form.find('input[name="title"]').val();
        var updatedDescription = form.find('textarea[name="description"]').val();
        var updatedMultipleSelections = form.find('input[name="multipleSelections"]').prop('checked');
        var updatedAddOptions = form.find('input[name="addOptions"]').prop('checked');
        var updatedPublic = form.find('input[name="public"]').prop('checked');

        var createdOptions = $('.newOption').get();
        var newOptions = [];
        createdOptions.map((option) => {
            newOptions.push($(option).val());
        });

        var allOptions = [];

        database.collection('polls').doc(docID).get()
            .then((doc) => {
                var entries = Object.entries(doc.data().options);
                var options = entries.reduce((acc, [option, uids]) => {
                    acc[option] = uids;
                    return acc;
                }, {})

                allOptions = newOptions.reduce((acc, option) => {
                    acc[option] = [];
                    return acc;
                }, options);

                return database.collection('polls').doc(`${docID}`)
                    .update({
                        title: updatedTitle,
                        description: updatedDescription,
                        options: allOptions,
                        endsOn: epochTime,
                        multipleSelections: updatedMultipleSelections,
                        addOptions: updatedAddOptions,
                        public: updatedPublic
                    })

            })
            .then(() => window.location.href = "/dashboard.html")
            .catch((err) => {
                console.log(err);
            })
    })
}

function getOldData(pollTitle) {
    var title = $(`#title${pollTitle[4]}`).text();

    window.location.href = `/edit-poll.html?title=${title}`;
}

function oldData(doc) {

    //Checks whether current user is the creator of the poll
    if (doc.data().uid !== user.uid) {
        window.location.href = '/dashboard.html';
    }

    var title = doc.data().title;
    var desc = doc.data().description;
    var opts = Object.keys(doc.data().options);
    var epochTime = doc.data().endsOn;
    var multipleSelections = doc.data().multipleSelections;
    var addOptions = doc.data().addOptions;
    var public = doc.data().public;

    var dateTime = moment(epochTime).format("YYYY-MM-DD HH:mm");
    var date = dateTime.slice(0, 10);
    var time = dateTime.slice(11, );

    $('#poll-title').val(title);
    $('#poll-desc').val(desc);
    $('#multipleSelections').prop("checked", multipleSelections);
    $('#addOptions').prop("checked", addOptions);
    $('#public').prop("checked", public);
    $('#endDate').val(date);
    $('#endTime').val(time);

    $("#opt-list").sortable({
        containment: "parent",
        tolerance: "pointer",
        handle: ".sortIcon",
        revert: 300,
    }).disableSelection();

    opts.map((option) => {
        loadOptions(option);
    });

}

function displayError() {
    $('#error-message p').text('Please fill in the empty option!');
    $('#center-error').fadeIn(0, () => {
        $('#center-error').css('display', 'flex');
    })

    setTimeout(() => {
        $('#center-error').fadeOut("fast", () => {
            $('#center-error').css('display', 'none');
        })
    }, 5000);
}

function addOptions() {
    var empty = false;
    $('.opt').get().forEach((option) => {
        if (option.value == "") {
            $(option).addClass('optionPlaceholder');
            if (!empty) {
                // $(".create-edit-add-poll").prop("onclick", null).off("click");
                displayError();
                $('#opt-list li:last-child input').focus();
                empty = true;
            }
        }
    })

    $('.opt').on('change', function () {
        $(".create-edit-add-poll").click(addOpt);
    });

    if (!empty) {
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

function loadOptions(option) {
    var opt = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="" value="${option}" disabled>
                <!--<img src="images/close.png" alt="" onclick="delOpt(this)">-->
            </div>
        </li>
    `;

    $('#opt-list').append(opt);
    $('#opt-list').sortable("refresh");
}

function delOpt(opt) {
    opt.parentNode.parentNode.remove();
}
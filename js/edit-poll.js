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

    form.on('submit', function (e) {
        e.preventDefault();

        var title = $('#poll-title').val();

        var opts = [];

        $('.opt').each(function () {
            var option = {};
            option["option"] = $(this).val();
            option["voters"] = [];
            opts.push(option);
        });

        var endDate = $('#endDate').val();
        var endTime = $('#endTime').val();
        var dateTime = `${endDate} ${endTime}`;
        var epochTime = moment(dateTime, "YYYY-MM-DD HH:mm").valueOf();

        var updatedTitle = form.find('input[name="title"]').val();
        var updatedDescription = form.find('textarea[name="description"]').val();
        var updatedMultipleSelections = form.find('input[name="multipleSelections"]').prop('checked');
        var updatedAddOptions = form.find('input[name="addOptions"]').prop('checked');
        var updatedPublic = form.find('input[name="public"]').prop('checked');

        database.collection('polls').doc(`${docID}`)
            .update({
                title: updatedTitle,
                description: updatedDescription,
                options: opts,
                endsOn: epochTime,
                multipleSelections: updatedMultipleSelections,
                addOptions: updatedAddOptions,
                public: updatedPublic
            })
            .then(() => window.location.href = "/dashboard.html")
            .catch((err) => {
                console.log(err);
            })

        // setInterval(function () {
        //     window.location.href = "/dashboard.html";
        // }, 2000)
    })
}

function getOldData(pollTitle) {
    var title = $(`#title${pollTitle[4]}`).text();

    window.location.href = `/edit-poll.html?title=${title}`;
}

function oldData(doc) {
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

function addOptions() {
    var opt = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="" required>
                <img src="images/close.png" alt="" onclick="delOpt(this)">
            </div>
        </li>
    `;

    $('#opt-list').append(opt);
    $('#opt-list').sortable("refresh");
}

function loadOptions(option) {
    var opt = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="" value="${option}" required>
                <img src="images/close.png" alt="" onclick="delOpt(this)">
            </div>
        </li>
    `;

    $('#opt-list').append(opt);
    $('#opt-list').sortable("refresh");
}

function delOpt(opt) {
    opt.parentNode.parentNode.remove();
}
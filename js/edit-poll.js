var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    $("#profile-picture").attr("src", `${user.photoURL}`);

    var form = $('#create-poll-form');
    var url_string = window.location.href;
    var url = new URL(url_string);
    var pollTitle = url.searchParams.get("title");
    var docID = url.searchParams.get("docID");
    if (docID === null) {
        window.location.href = "/dashboard.html";
    }

    database.collection('polls').where("title", "==", pollTitle).get().then((snapshot) => {
        snapshot.docs.forEach(doc => {
            oldData(doc);
        })
    })

    form.on('submit', function (e) {
        e.preventDefault();

        var title = $('#poll-title').val();

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

        database.collection('polls').doc(`${docID}`).update({
            title: form.title.value,
            description: form.desc.value,
            options: opts,
            endsOn: epochTime,
            multipleSelections: form.multipleSelections.checked,
            addOptions: form.addOptions.checked,
            public: form.public.checked
        })

        setInterval(function () {
            window.location.href = "/dashboard.html";
        }, 2000)
    })
}

function getOldData(pollTitle) {
    var title = $(`#title${pollTitle[4]}`).text();

    window.location.href = `/edit-poll.html?title=${title}`;
}

function oldData(doc) {
    var title = doc.data().title;
    var desc = doc.data().description;
    var opts = doc.data().options;
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

    opts.forEach(function (value, i) {
        addOpt(opts[i].option);
    });

}

function addOpt(option) {
    count = count + 1;
    var opt = `
        <li>
            <div class="op-lf">
                <img src="images/sm-bar.png" alt="" class="sortIcon">
                <input class="opt" type="text" placeholder="Type here" id="poll-option${count}" required>
                <img src="images/close.png" alt="" onclick="delOpt(this)">
            </div>
        </li>
    `;

    $('#opt-list').append(opt);
    $(`#poll-option${count}`).val(option);
    $('#opt-list').sortable("refresh");
}

function delOpt(opt) {
    opt.parentNode.parentNode.remove();
}
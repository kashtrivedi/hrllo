var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    $("#profile-picture").attr('src', user.photoURL);
    var url = window.location;
    var urlString = new URL(url);
    var docID = urlString.searchParams.get("docID");

    database.collection('polls').doc(`${docID}`).get()
        .then((doc) => {
            $("#votePollTitle").text(`${doc.data().title}`);
            $("#votePollDescription").text(`${doc.data().description}`);
            var options = doc.data().options;
            options.forEach(function (value, i) {
                // https://www.kirupa.com/html5/dynamically_create_populate_list.htm
                $("#votePollOptions").append([options[i].option].map(t => $(`<li class='votePollOption'>${t}<label class='cus-chek votePollCheckbox'><input type='checkbox' name='multipleSelections' id='multipleSelections'><span class='checkmark'></span></label>`)));
            });
        })
}
var app = window.app;
var database = window.database;
var user = window.user;

function main() {
    $("#profile-picture").attr('src', user.photoURL);
}
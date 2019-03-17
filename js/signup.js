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

var token;
var displayName;
var email;

var signIn = document.getElementById('signIn');
var signUp = document.getElementById('signUp');
var redirect_signup = document.getElementById('redirect_signup');

signIn.addEventListener('click', login);
signUp.addEventListener('click', login);
redirect_signup.addEventListener('click', login);

function login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .then(function (result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        token = result.credential.accessToken;
        // The signed-in user info.
        displayName = result.user.displayName;
        email = result.user.email;
        photo = result.user.photoURL;
        console.log(photo);
        // ...
        
        setCookie('displayName', displayName, 7);
        setCookie('email', email, 7);
        setCookie('token', token, 7);
        setCookie('photo', photo, 7);
        
    })
    .then(function() {
        window.location.href = '../create-poll.html';
    })
    .catch(function (error) {
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



// TODO elsewhere
// function logOut() {
//     firebase.auth().signOut().then(function () {
//         // Sign-out successful.
//         alert('Log out success!');
//     }).catch(function (error) {
//         // An error happened.
//     });
// }













// TODO elsewhere

// var apiBase = '';

// function getPolls() {
//     axios.get(apiBase + '/polls')
//         .then((response) => {
//             console.log(response.data);
//             var polls = response.data.polls;
//             var pollsOutput = '';
//             var options = response.data.polls.options;
//             var optionsOutput = '';

//             $.each(options, (index, option) => {
//                 optionsOutput = `
//                     <li>${option}</li>
//                 `;
//             });

//             $.each(polls, (index, poll) => {
//                 pollsOutput = `
//                     <div class="col-md-6 col-sm-6">
//                         <div class="created-poll">
//                             <div class="cre-pl">
//                                 <h4>${poll.title}</h4>
//                                 <p>${poll.description}</p>
//                                 //TODO polls.options
//                                 <ul>
//                                     ${optionsOutput}
//                                 </ul>
//                             </div>
//                             <div class="poll-act">
//                                 <ul>
//                                     <li><a href="poll-stats.html"><img src="images/ic2.png" alt=""></a></li>
//                                     <li><a href="#"><img src="images/ic3.png" alt=""></a></li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 `;
//             });

//             // Create div id polls to for generation of polls
//             // $('#polls').html(output);
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// }
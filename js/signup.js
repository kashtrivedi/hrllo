function main() {
    $('#signIn').on('click', login);
    $('#signUp').on('click', login);
    $('#redirectSignup').on('click', login);
};

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
                            karma: 0,
                            polls_created: 0,
                            polls_participated: 0
                        });
                    }
                });
        })
        .then(() => window.location.href = '/dashboard.html')
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

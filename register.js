// Your web app's Firebase configuration
const con = {
    apiKey: "AIzaSyCOKOVsauq2Ow-9hX1nh3gBV29LRLprjqk",
    authDomain: "task-manager-javascript.firebaseapp.com",
    projectId: "task-manager-javascript",
    storageBucket: "task-manager-javascript.appspot.com",
    messagingSenderId: "999690352950",
    appId: "1:999690352950:web:a083f5c6fef7bc1e739b97"
  };

// Initialize Firebase
firebase.initializeApp(con);
// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register(){
    // Get all our input fields
    email = document.getElementById('email').value;
    password = document.getElementById('password').value;
    full_name = document.getElementById('full_name').value;
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password are invalid');
      return;
      // Don't continue running the code
    }
    if (validate_field(full_name) == false){
      alert('Full name is invalid');
      return;
    }
   
    // Move on with Auth
    auth.createUserWithEmailAndPassword(email, password)
    .then(function() {
      // Declare user variable
      var user = auth.currentUser;
  
      // Add this user to Firebase Database
      var database_ref = database.ref();
  
      // Create User data
      var user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now()
      };
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);
  
      // DOne
      alert('User Created!');
    })
    .catch(function(error) {
      // Firebase will use this to alert of its errors
      var error_code = error.code;
      var error_message = error.message;
  
      alert(error_message);
    })
  }


// Set up our login function
function login () {
    var getAbsoluteUrl = (function() {
        var a;
        return function(url) {
            if(!a) a = document.createElement('a');
            a.href = url;
            return a.href;
        }
      })();
      window.location = getAbsoluteUrl('./') + "index.html";
}

  // Validate Functions
function validate_email(email) {
    expression = /^[^@]+@\w+(\.\w+)+\w$/;
    if (expression.test(email) == true) {
      // Email is good
      return true;
    } else {
      // Email is not good
      return false;
    }
  }
  
  function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    if (password < 6) {
      return false;
    } else {
      return true;
    }
  }
  
  function validate_field(field) {
    if (field == null) {
      return false;
    }
  
    if (field.length <= 0) {
      return false;
    } else {
      return true;
    }
  }
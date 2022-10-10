"use strict";

let logAsAdmin = false;
let userType = document.getElementById('userType');

// Set up our login function
function login () {
    // Get all our input fields
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      alert('Email or Password is invalid')
      return
      // Don't continue running the code
    }
  
    auth.signInWithEmailAndPassword(email, password).then(function() {
      // Declare user variable
      let user = auth.currentUser

      // Add this user to Firebase Database
      let database_ref = database.ref()
  
      // Create User data
      let user_data = {
        last_login : Date.now()
      }
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).update(user_data)
  
      // Done
      alert('User Logged In!');

      if(logAsAdmin) {
        // TO - DO
        // if user chouse log as admin and has admin privileges allow it
        window.location = "./pages/admin.html";
      } else {
        // Login as normal user
        window.location = "./pages/dashboard.html";
      }

      //window.location = getAbsoluteUrl('./') + "home.html";
  
    }).catch(function(error) {
      // Firebase will use this to alert of its errors
      let error_code = error.code
      let error_message = error.message
  
      alert(error_message);
    });
}

function goToRegister() {
    window.location = "./pages/register.html";
}

function toggleUserType() {
  logAsAdmin = !logAsAdmin;

  if(logAsAdmin) {
    userType.classList.add('active');
  } else {
    userType.classList.remove('active');
  }
}
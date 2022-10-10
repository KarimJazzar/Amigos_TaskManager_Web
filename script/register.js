"use strict";

// Set up our register function
function register(){
    // Get all our input fields
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let full_name = document.getElementById('full_name').value;
  
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
    auth.createUserWithEmailAndPassword(email, password).then(function() {
      // Declare user variable
      let user = auth.currentUser;
  
      // Add this user to Firebase Database
      let database_ref = database.ref();
  
      // Create User data
      let user_data = {
        email : email,
        full_name : full_name,
        last_login : Date.now()
      };
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);
  
      // Done
      alert('User Created!');

    }).catch(function(error) {
      // Firebase will use this to alert of its errors
      let error_code = error.code;
      let error_message = error.message;
  
      alert(error_message);
    })
}

function goToLogin() {
  window.location = "../index.html";
}
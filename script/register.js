"use strict";

// Set up our register function
function register(){
    // Get all our input fields
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;
    let full_name = document.getElementById('full_name').value;
  
    

    if (validate_field(full_name) == false){
      showSnackBar('Full name is empty',"orange");
      return;
    }

    // Validate input fields
    if (validate_email(email) == false) {
      showSnackBar('Email is invalid',"orange");
      return;
      // Don't continue running the code
    }

    // Validate input fields
    if (validate_password(password) == false) {
      showSnackBar('Passwrod must be atleast 6 characters.',"orange");
      return;
      // Don't continue running the code
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
        last_login : Date.now(),
        admin : false
      };
  
      // Push to Firebase Database
      database_ref.child('users/' + user.uid).set(user_data);
  
      // Done
      showSnackBar('User Created!',"green");

    }).catch(function(error) {
      // Firebase will use this to alert of its errors
      let error_code = error.code;
      let error_message = error.message;
  
      showSnackBar(error_message,"red");
    })
}

function goToLogin() {
  window.location = "../index.html";
}

function showSnackBar(msg,colour) {
  // Get the snackbar DIV
  var x = document.getElementById("snackbar");

  // Add the "show" class to DIV
  x.className = "show";
  x.textContent = msg;
  
  if(colour=="green"){
      x.style.backgroundColor="#008f29";
      x.style.color="#fff";
  }
  else if(colour=="orange"){
      x.style.backgroundColor="#FFA500";
      x.style.color="#000";

  }else{
    x.style.backgroundColor="#FF0000";
    x.style.color="#fff";
  }

  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ x.className = x.className.replace("show", msg); }, 3000);
}
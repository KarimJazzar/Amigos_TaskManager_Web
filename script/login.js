"use strict";

let logAsAdmin = false;
let userType = document.getElementById('userType');

// Set up our login function
function login () {
    let isAdmin = false;
    // Get all our input fields
    let email = document.getElementById('email').value
    let password = document.getElementById('password').value
  
    // Validate input fields
    if (validate_email(email) == false || validate_password(password) == false) {
      showSnackBar('Email or Password is invalid',"orange");
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
      
      let firebaseRef = firebase.database().ref("users");
      firebaseRef.once("value", function(snapshot){
        let data = snapshot.val();
        for(let i in data){
          if(i == user.uid){
            isAdmin = data[i].admin;
            //console.log(isAdmin);
            break;
          }
          //console.log(i);
          //console.log(data[i]);
        }

        if(logAsAdmin) {
          if(isAdmin == false){
            
            showSnackBar("Please check that the user is a regular one!","red");

          }else{
            goToPage("admin",user.uid);

          }
        } else {
          goToPage("dashboard",user.uid);
        }
      })

      //window.location = getAbsoluteUrl('./') + "home.html";
  
    }).catch(function(error) {
      // Firebase will use this to alert of its errors
      let error_code = error.code
      let error_message = error.message
  
      showSnackBar(error_message,"red");

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


function goToPage(pageName,user){
          sessionStorage.setItem('userID',user);
          window.location = "./pages/"+pageName+".html";

}
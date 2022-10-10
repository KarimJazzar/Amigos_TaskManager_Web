"use strict";

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

// Validate Functions
function validate_email(email) {
  let expression = /^[^@]+@\w+(\.\w+)+\w$/;
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
  } else if (field.length <= 0) {
    return false;
  } else {
    return true;
  }
}

function validate_string(value) {
  if (value == "") {
    return true
  } else if (value.indexOf(" ") == 0) {
    return true;
  } else {
    return false;
  }
}

function validate_date(date) {
  if(date == "") {
    return true;
  } else {
    return false;
  }
} 

function validate_due_date(dateStart, dateEnd) {
  if(Date.parse(dateStart) > Date.parse(dateEnd)){
    return true;
  }else{
    return false;
  }
}

function validate_user(user) {
  if(user == "none") {
    return true;
  } else {
    return false;
  }
}

function validate_number(value) {
  if(!value) {
    return true;
  } else if(/\D/.test(value)) {
    return true;
  } else {
    return false;
  }
}
"use strict";

// CRUD buttons
const btnCreate = document.getElementById('btnCreate');
const taskContainer = document.getElementById('taskContainer');
const closeSideBar = document.getElementById('closeSideBar');

// Sidebar and Tasks grid
const taskCrud = document.getElementById('taskCrud');
const taskCols = document.querySelectorAll('.task-stack');

// All CRUD inputs
const taskName = document.getElementById('taskName');
const taskDesc = document.getElementById('taskDesc');
const taskStart  = document.getElementById('dateStart');
const taskEnd  = document.getElementById('dateEnd');
const taskUser  = document.getElementById('userList');
const taskRate  = document.getElementById('taskRate');

//  No editable content
let hoursList = document.getElementById('taskHoursList');
let hoursTotal = document.getElementById('taskTotalHour');

// Variables 
let task = null;
let tasks = [];
let users = [];
let taskIndex = 0;
let logedUser = null;
const userLoggedInID = sessionStorage.getItem('userID');
const welcom = document.querySelector('.welcome-msg');
const navbar = document.querySelector('.user-container');
const taskCost = document.getElementById('taskCost');
const taskTotalCost = document.getElementById('taskTotalCost');

// Create task function
function createTask() {
    // Get input values
    let tName = taskName.value;
    let tDesc = taskDesc.value;
    let tStart = taskStart.value.toString();
    let tEnd  = taskEnd.value.toString();
    let tUser = taskUser.value;
    let tRate = taskRate.value;
    
    // Check if all inputs are valid
    let canCreate = checkAllInputs(tName, tDesc, tStart, tEnd, tUser, tRate);

    // If inputs are valid store task
    if(canCreate) {
        // Create DB ref
        let database_ref = database.ref();

        // Create task object
        task = {
            name: tName,
            description: tDesc,
            status: 0,
            start_date: tStart,
            due_date: tEnd,
            user: {
                id: users[tUser].id,
                name: users[tUser].full_name
            },
            pay_rate: tRate,
            time_tracked: "",
            complete_date: "",
            created_by: logedUser
        };
        
        // Store task object
        database_ref.child('taks').push(task);

        // Clear inputs
        clearInputs();

        // Show alert (temporal solution)
        showSnackBar("Task updated.","green");
    }
}

// Update task function
function updateTask() {
    // Get input values
    let tName = taskName.value;
    let tDesc = taskDesc.value;
    let tStart = taskStart.value.toString();
    let tEnd  = taskEnd.value.toString();
    let tUser = taskUser.value;
    let tRate = taskRate.value;
    
    // Check if all inputs are valid
    let canUpdate = checkAllInputs(tName, tDesc, tStart, tEnd, tUser, tRate);

    // If inputs are valid store task
    if(canUpdate) {
        // Create DB ref
        let database_ref = database.ref();

        // Create task object
        task = {
            name: tName,
            description: tDesc,
            status: tasks[taskIndex].status,
            start_date: tStart,
            due_date: tEnd,
            user: {
                id: users[tUser].id,
                name: users[tUser].full_name
            },
            pay_rate: tRate,
            time_tracked: tasks[taskIndex].time_tracked,
            complete_date: tasks[taskIndex].complete_date,
            created_by: tasks[taskIndex].created_by
        };
        
        console.log(task);

        // Store task object
        //database_ref.child('taks/'+task).set(task);
        database_ref.child('taks/'+ tasks[taskIndex].id).set(task);

        // Clear inputs
        //clearInputs();

        // Show alert
        showSnackBar("Task Updated.","green");
    }
}

// Delete task function
function deleteTask() {
    // Create DB ref
    let database_ref = database.ref();

    // Delete task object
    database_ref.child('taks/'+ tasks[taskIndex].id).remove();

    // Remove edit mode
    showSideBard()
    // Clear inputs
    clearInputs();

    // Show alert
    showSnackBar("Task Deleted.","green");
}

// Validate all inputs
function checkAllInputs(tName, tDesc, tStart, tEnd, tUser, tRate) {
    if (validate_string(tName)) {
        showSnackBar("Name can't by empty.","orange");
        return false;
    } else if (validate_string(tDesc)) {
        showSnackBar("Description can't by empty.","orange");
        return false;
    } else if (validate_date(tStart)) {
        showSnackBar("Start date is not valid.","orange");
        return false;
    } else if (validate_date(tEnd) || validate_due_date(tStart, tEnd)) {
        showSnackBar("Due date is not valid.","orange");
        return false;
    } else if (validate_user(tUser)) {
        showSnackBar("Task responsable can't be empty.","orange");
        return false;
    } else if (validate_number(tRate)) {
        showSnackBar("Invalid pay rate.","orange");
        return false;
    } else {
        return true;
    }
}

// Load task data for edit mode
function setInputValues(userIndex) {
    taskIndex = userIndex;
    let tempTask = tasks[userIndex];

    taskName.value = tempTask.name;
    taskDesc.value = tempTask.description;
    taskStart.value = tempTask.start_date;
    taskEnd.value = tempTask.due_date;
    taskUser.value = users.findIndex(x => x.id === tempTask.user.id);
    taskRate.value = tempTask.pay_rate;

    if(tempTask.time_tracked != "") {
        hoursList.innerHTML = "";

        let tempHours = tempTask.time_tracked.split(",");

        let total = 0;
        for (let i = 0; i < tempHours.length; i++) {
            let noHour = document.createElement('li');
            noHour.innerHTML = tempHours[i];

            hoursList.appendChild(noHour);
        
            total += parseFloat(tempHours[i]);
        }

        hoursTotal.innerHTML = total;
        taskCost.innerHTML = "$" + (total * parseFloat(tempTask.pay_rate));
    } else {
        let noHour = document.createElement('li');
        noHour.innerHTML = "No Time Posted";

        hoursList.innerHTML = "";
        hoursList.appendChild(noHour);
        
        hoursTotal.innerHTML = 0;
        taskCost.innerHTML = "$0.00";
    }
}

// Clear all inputs
function clearInputs() {
    taskName.value = "";
    taskDesc.value = "";
    taskStart.value = "";
    taskEnd.value = "";
    taskUser.value = "none";
    taskRate.value = "";
}

// Create task container and load in DOOM
function displayTask() {
    // Clear al task column
    taskCols[0].innerHTML = "";
    taskCols[1].innerHTML = "";
    taskCols[2].innerHTML = "";

    let finalTotal = 0;
    
    // Loop trougth all task
    for(let i = 0; i < tasks.length; i++) {
        // Temp value for current Task
        let tempTask = tasks[i];

        let taskTotal = 0;

        if(tempTask.status == 2 && tempTask.time_tracked != "") {
            let tempHours = tempTask.time_tracked.split(",");
            for (let i = 0; i < tempHours.length; i++) {
                taskTotal += parseFloat(tempHours[i]);
            }
        }

        finalTotal += (tempTask.pay_rate * taskTotal);

        // Create card container
        let tempDad = document.createElement('div');
        tempDad.className = "task-card";

        // Create span for color line status
        let tempLine = document.createElement('span');
        tempLine.className = "task-line";
        tempDad.appendChild(tempLine);

        // Create H1 for task name
        let headH1 = document.createElement('h1');
        headH1.innerHTML = tempTask.name;
        tempDad.appendChild(headH1);

        // Create H4 for task responsable user
        let headH4 = document.createElement('h4');
        headH4.innerHTML = tempTask.user.name;
        tempDad.appendChild(headH4);

        // Create DIV for date container
        let tempDate = document.createElement('div');
        tempDate.classList = "due-date";
        
        // Create span for due date label
        let tempDateSpan = document.createElement('span');
        tempDateSpan.innerHTML = "Due Date:";
        tempDate.appendChild(tempDateSpan);
        
        // Create span for due date value
        let tempDateValue = document.createElement('span');
        tempDateValue.innerHTML = tempTask.due_date;
        tempDate.appendChild(tempDateValue);

        // Append all elements inside card
        tempDad.appendChild(tempDate);

        // Create
        let tempSVG = document.getElementById("svg-temp").cloneNode(true);
        tempSVG.setAttribute('index', i);
        tempSVG.removeAttribute('id');
        tempSVG.addEventListener('click', showEditMode);
        tempDad.appendChild(tempSVG);

        taskCols[tempTask.status].appendChild(tempDad);
    }

    taskTotalCost.textContent = finalTotal;
}

function calculateTotalCost() {

}

function loadUsers() {
    let database_ref = database.ref('users');

    database_ref.on("value", function(snapshot) {
        let i = 0;
        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            childData.id = childSnapshot.key;
            
            let tempOption = document.createElement('option');
            tempOption.value = i;
            tempOption.innerHTML = childData.full_name;
            taskUser.appendChild(tempOption);

            i++;

            users.push(childData);
        });

        console.log(users);
    });
}

function loadTasks() {
    let database_ref = database.ref('taks');    
    

    database_ref.on("value", function(snapshot) {
        tasks = [];
        let i = 0;

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            childData.id = childSnapshot.key;
            
            tasks.push(childData);
        });

        displayTask();
    });
}

function setAdminEvents() {
    btnCreate.addEventListener('click', showSideBard);
    closeSideBar.addEventListener('click', hideSideBard);
}

function showSideBard() {
    clearInputs();
    taskCrud.classList.remove('edit');
    animateSidebar();
}

function showEditMode() {
    setInputValues(this.getAttribute('index'));
    taskCrud.classList.add('edit');
    animateSidebar();
}

function animateSidebar() {
    taskContainer.classList.add('active');
    btnCreate.classList.add('active');
}

function hideSideBard() {
    taskContainer.classList.remove('active');
    btnCreate.classList.remove('active');
}

function signOut() {
    auth.signOut().then(() => {
        window.location = "../index.html";
    });
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

function getLogedUser() {
    let firebaseRef = firebase.database().ref("users");

    firebaseRef.once("value", function(snapshot){
        let userName = "";
        let data = snapshot.val();

        for(let i in data){
            if(i == userLoggedInID){
                userName = data[i].full_name;
                break;
            }
        }

        logedUser = userName;
        document.getElementById('userFullName').textContent = userName;
        document.getElementById('welcomUser').textContent = userName;
        welcom.classList.add('active');

        setInterval(() => {
            navbar.classList.add('active');
            welcom.classList.remove('active');
        }, 500);
    })
}

function initAdmin() {
    getLogedUser();
    setAdminEvents();
    loadUsers();
    loadTasks();
}

initAdmin();
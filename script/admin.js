"use strict";

// CRUD buttons
let btnCreate = document.getElementById('btnCreate');
let taskContainer = document.getElementById('taskContainer');
let closeSideBar = document.getElementById('closeSideBar');

// Sidebar and Tasks grid
let taskCrud = document.getElementById('taskCrud');
let taskCols = document.querySelectorAll('.task-stack');

// All CRUD inputs
let taskName = document.getElementById('taskName');
let taskDesc = document.getElementById('taskDesc');
let taskStart  = document.getElementById('dateStart');
let taskEnd  = document.getElementById('dateEnd');
let taskUser  = document.getElementById('userList');
let taskRate  = document.getElementById('taskRate');

//  No editable content
let hoursList = document.getElementById('taskHoursList');
let hoursTotal = document.getElementById('taskTotalHour');

// Variables 
let task = null;
let tasks = [];
let users = [];
let taskIndex = 0;
let userLoggedInID = sessionStorage.getItem('userID');


(function() {
    
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
        document.getElementById('userFullName').textContent = userName;
      })

})();

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
            time_tracked: [],
            complete_date: "",
            created_by: ""
        };
        
        // Store task object
        database_ref.child('taks').push(task);

        // Clear inputs
        clearInputs();

        // Show alert (temporal solution)
        alert("Task created.");
    }
}

// Update task function
function updateTask() {
    // TO - DO
    // 1 - validate all the fields as the create function
    // 2 - Create db reference
    // 3 - Perform the update, the endpot will be 'tasks/{taskID}'
}

// Delete task function
function deleteTask() {
    // TO - DO
    // IN HOLD FOR NOW
}

// Validate all inputs
function checkAllInputs(tName, tDesc, tStart, tEnd, tUser, tRate) {
    if (validate_string(tName)) {
        alert("Name can't by empty.");
        return false;
    } else if (validate_string(tDesc)) {
        alert("Description can't by empty.");
        return false;
    } else if (validate_date(tStart)) {
        alert("Start date is not valid.");
        return false;
    } else if (validate_date(tEnd) || validate_due_date(tStart, tEnd)) {
        alert("Due date is not valid.");
        return false;
    } else if (validate_user(tUser)) {
        alert("Task responsable can't be empty.");
        return false;
    } else if (validate_number(tRate)) {
        alert("Invalid pai rate.");
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

    if(taskRate.hasOwnProperty('time_tracked')) {
        // TO - DO
        // Wait until user can push time
    } else {
        let noHour = document.createElement('li');
        noHour.innerHTML = "No Time Posted";

        hoursList.innerHTML = "";
        hoursList.appendChild(noHour);
        
        hoursTotal.innerHTML = 0;
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

    // Loop trougth all task
    for(let i = 0; i < tasks.length; i++) {
        // Temp value for current Task
        let tempTask = tasks[i];

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

function initAdmin() {
    setAdminEvents();
    loadUsers();
    loadTasks();
}

initAdmin();
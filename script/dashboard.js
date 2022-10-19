"use strict";

// CRUD buttons
let taskContainer = document.getElementById('taskContainer');
let closeSideBar = document.getElementById('closeSideBar');

// Sidebar and Tasks grid
let taskCrud = document.getElementById('taskCrud');
let taskCols = document.querySelectorAll('.task-stack');

// All task fields
let taskName = document.getElementById('taskName');
let taskDesc = document.getElementById('taskDesc');
let taskStart  = document.getElementById('taskStart');
let taskEnd  = document.getElementById('taskEnd');
let taskUser  = document.getElementById('taskUser');
let taskRate  = document.getElementById('taskRate');
let hoursList = document.getElementById('taskHoursList');
let hoursTotal = document.getElementById('taskTotalHour');
let taskCreator = document.getElementById('taskCreator');
let taskComplete = document.getElementById('taskComplete');

// All inputs
let inputHour = document.getElementById('taskHours');
let inputStatus = document.getElementById('taskStatus');

// Variables 
let task = null;
let tasks = [];
let users = [];
let taskIndex = 0;
let taskID = null;
let taskHoursInput = [];
let userLoggedInID = sessionStorage.getItem('userID');
let welcom = document.querySelector('.welcome-msg');
let navbar = document.querySelector('.user-container');
let btnUpdate = document.getElementById('btnUpdateUser');
let btnAddHours = document.getElementById('btnAddHours');

//add worked hours
function addHours(){
    let tempHour = inputHour.value;

    if (validate_number(tempHour)) {
        showSnackBar("Invalid hour.","orange");
    } else {
        if(taskHoursInput.length <= 0 && tasks[taskIndex].time_tracked == "") {
            hoursList.innerHTML = "";
        }

        taskHoursInput.push(tempHour);
    
        // Create DOM element
        var li = document.createElement('li');
                    
        // Set text of element
        li.textContent = tempHour;
    
        // Append this element to its parent
        hoursList.appendChild(li);
        
        inputHour.value = "";
    }
}

// Update task
function updateTask() {
    // Get input values
    let iStatus = document.getElementById('taskStatus').value;
    iStatus = parseInt(iStatus);

    if (taskHoursInput.length > 0 && iStatus == 0) {
        showSnackBar("Can only add time if task is ongoing.","orange");
    } else {
         // Create DB ref
         let database_ref = database.ref();

         // Create task object
         let task = {
            name: tasks[taskIndex].name,
            description: tasks[taskIndex].description,
            status: iStatus,
            start_date: tasks[taskIndex].start_date,
            due_date: tasks[taskIndex].due_date,
            user: tasks[taskIndex].user,
            pay_rate: tasks[taskIndex].pay_rate,
            time_tracked: tasks[taskIndex].time_tracked,
            complete_date: tasks[taskIndex].complete_date,
            created_by: tasks[taskIndex].created_by,
        };

        if(taskHoursInput.length > 0) {
            if(task.time_tracked != "") {
                task.time_tracked += "," + taskHoursInput.toString();
            } else {
                task.time_tracked = taskHoursInput.toString();
            }
        }

        if(iStatus == 2) {
            task.complete_date = "" + new Date().toISOString().slice(0, 10);
        } else {
            task.complete_date = "";
        }

        console.log(task);
        
        // Update task object
        database_ref.child('taks/'+taskID).set(task);

        taskHoursInput = [];

        // Show alert (temporal solution)
        showSnackBar("Task updated.","green");
    }
}

// Load task data for edit mode
function setInputValues(userIndex) {
    taskIndex = userIndex;
    let tempTask = tasks[userIndex];
    //getting current task id
    taskID = tempTask.id;

    taskName.innerHTML = tempTask.name;
    taskDesc.innerHTML = tempTask.description;
    taskStart.innerHTML = tempTask.start_date;
    taskEnd.innerHTML = tempTask.due_date;
    inputStatus.value = tempTask.status;
    taskUser.innerHTML = tempTask.user.name;
    taskRate.innerHTML = tempTask.pay_rate;
    taskCreator.innerHTML = tempTask.created_by;

    if(userLoggedInID == tempTask.user.id) {
        btnUpdate.style.opacity = 1;
        btnUpdate.style.pointerEvents = "auto";
        btnAddHours.style.opacity = 1;
        btnAddHours.style.pointerEvents = "auto";
    } else {
        btnUpdate.style.opacity = 0.2;
        btnUpdate.style.pointerEvents = "none";
        btnAddHours.style.opacity = 0.2;
        btnAddHours.style.pointerEvents = "none";
    }

    if(tempTask.complete_date != "") {
        taskComplete.innerHTML = tempTask.complete_date;
    } else {
        taskComplete.innerHTML = "YYYY-MM-DD";
    }

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
    } else {
        let noHour = document.createElement('li');
        noHour.innerHTML = "No Time Posted";

        hoursList.innerHTML = "";
        hoursList.appendChild(noHour);
        
        hoursTotal.innerHTML = 0;
    }
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
        tempSVG.addEventListener('click', showSideBard);
        tempDad.appendChild(tempSVG);

        taskCols[tempTask.status].appendChild(tempDad);
    }
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
        setInputValues(taskIndex);
    });
}

function showSideBard() {
    setInputValues(this.getAttribute('index'));
    taskContainer.classList.add('active');
}

function hideSideBard() {
    taskContainer.classList.remove('active');
}

function setDashboardEvents() {
    closeSideBar.addEventListener('click', hideSideBard);
}

function signOut(){
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

        document.getElementById('userFullName').textContent = userName;
        document.getElementById('welcomUser').textContent = userName;
        welcom.classList.add('active');

        setInterval(() => {
            navbar.classList.add('active');
            welcom.classList.remove('active');
        }, 500);
    })
}

function initDashboard() {
    getLogedUser();
    loadTasks();
    setDashboardEvents();
}

initDashboard();
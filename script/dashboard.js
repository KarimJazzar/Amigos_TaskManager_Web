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

//add worked hours

function addHours(){

    hoursList.innerHTML = "";
    taskHoursInput.push(inputHour.value);

        for (var i = 0; i < taskHoursInput.length; i++) {
            // Create DOM element
            var li = document.createElement('li');
                
            // Set text of element
            li.textContent = taskHoursInput[i];
        
            // Append this element to its parent
            hoursList.appendChild(li);
          } 

    inputHour.value = "";
    
}

// Update task
function updateTask() {

    //TODO 
    // check if the user is same

    let tName = document.getElementById('taskName').textContent;
    let tDesc = document.getElementById('taskDesc').textContent;
    let tStart = document.getElementById('taskStart').textContent;
    let tEnd  = document.getElementById('taskEnd').textContent;
    let tUser = document.getElementById('taskUser').textContent;
    let tRate = document.getElementById('taskRate').textContent;
    let iStatus = document.getElementById('taskStatus').value;




    if(iStatus==0){
       
        showSnackBar("Please change the status of the task, if it's started.","orange");

    }
    else {
         // Create DB ref
         let database_ref = database.ref();

         // Create task object
         task = {
            
            name: tName,
            description: tDesc,
            status: iStatus,
            start_date: tStart,
            due_date: tEnd,
            user: {
                id: "",
                name: ""
            },
            pay_rate: tRate,
            time_tracked: taskHoursInput,
            complete_date: "",
            created_by: ""
               };


        
        // Store task object
        database_ref.child('taks/'+taskID).set(task);

        

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
    taskUser.value = users.findIndex(x => x.id === tempTask.user.id);
    taskRate.innerHTML = tempTask.pay_rate;

    if(taskRate.hasOwnProperty('time_tracked')) {
            // for (var i = 0; i < tempTask.time_tracked.length; i++){ 
            //     hoursList.innerHTML = "";
            //     hoursList.appendChild(tempTask.time_tracked);
            // }

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

function initDashboard() {
    loadTasks();
    setDashboardEvents();
}

initDashboard();

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
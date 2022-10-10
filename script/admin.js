"use strict";

let btnCreate = document.getElementById('btnCreate');
let taskContainer = document.getElementById('taskContainer');
let closeSideBar = document.getElementById('closeSideBar');

let taskCrud = document.getElementById('taskCrud');
let taskCols = document.querySelectorAll('.task-stack');

let userOptions = document.getElementById('userList');

let tasks = [];
let users = [];
let taskStruc = {
    name: "Test Task",
    description: "Temp Description..",
    user: "miolan96@gmail.com",
    status: 0,
    pay_rate: 15,
    time_tracked: [],
    start_date: Date.parse("March 21, 2022"),
    due_date: Date.parse("March 24, 2022"),
    complete_date: null
}

function createTask() {
    let database_ref = database.ref();

    //database_ref.push();
    //database_ref.child('taks/').push(taskStruc);

    tasks.push(taskStruc);
    loadTask();
}

function updateTask() {

}

function deleteTask() {

}

function setAdminEvents() {
    btnCreate.addEventListener('click', showSideBard);
    closeSideBar.addEventListener('click', hideSideBard);
}

function showSideBard() {
    taskCrud.classList.remove('edit');
    animateSidebar();
}

function showEditMode() {
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

function loadUsers() {
    let database_ref = database.ref('users');

    database_ref.on("value", function(snapshot) {
        let i = 0;

        snapshot.forEach(function(childSnapshot) {
            var childData = childSnapshot.val();
            var id= childData.id;
            
            let tempOption = document.createElement('option');
            tempOption.value = i;
            tempOption.innerHTML = childData.full_name;
            userOptions.appendChild(tempOption);

            i++;
            console.log(childData);
        });
    });
}

function loadTask() {
    taskCols[0].innerHTML = "";

    for(let i = 0; i < tasks.length; i++) {
        let tempTask = tasks[i];

        let tempDad = document.createElement('div');
        tempDad.className = "task-card";

        let tempLine = document.createElement('span');
        tempLine.className = "task-line";
        tempDad.appendChild(tempLine);

        let headH1 = document.createElement('h1');
        headH1.innerHTML = tempTask.name;
        tempDad.appendChild(headH1);

        let headH4 = document.createElement('h4');
        headH4.innerHTML = tempTask.name;
        tempDad.appendChild(headH4);

        let tempDate = document.createElement('div');
        tempDate.classList = "due-date";
        
        let tempDateSpan = document.createElement('span');
        tempDateSpan.innerHTML = "Due Date:";
        tempDate.appendChild(tempDateSpan);

        let tempDateValue = document.createElement('span');
        tempDateValue.innerHTML = tempTask.due_date;
        tempDate.appendChild(tempDateValue);

        tempDad.appendChild(tempDate);

        let tempSVG = document.getElementById("svg-temp").cloneNode(true);
        tempSVG.removeAttribute('id');
        tempSVG.addEventListener('click', showEditMode);
        tempDad.appendChild(tempSVG);

        taskCols[0].appendChild(tempDad);
    }
}

setAdminEvents();
loadUsers();
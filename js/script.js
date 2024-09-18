const Tasks = document.querySelector("#Task_div") ;
const InsertBtn = document.querySelector("#addinputbtn")
const updatebtn = document.querySelector("#Updatebtn")
const inputtitle = document.querySelector("#tasktitle") ;
const inputdescription = document.querySelector("#taskdesc") ;
const addDiv = document.querySelector("#addDIV")
const newtaskbtn = document.querySelector("#NewTaskbtn")
const updateText = document.querySelector(".updatetext");
const addText = document.querySelector(".addtext");
let tasksContainer = localStorage.getItem("tasks")? JSON.parse(localStorage.getItem("tasks")) : [] ;

renderTask() // Initial render of tasks
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// helper functions for design  purposes
function toggleUI(isUpdate) {
    InsertBtn.style.display = isUpdate ? "none" : "block";
    updatebtn.style.display = isUpdate ? "block" : "none";
    addDiv.style.display = "block";
    addText.style.display = isUpdate ? "none" : "block";
    updateText.style.display = isUpdate ? "block" : "none";
}

// Update local storage and re-render tasks
function Rerender(){
    localStorage.setItem("tasks", JSON.stringify(tasksContainer));    
    renderTask();
}

// Open task creation form with "Add task" mode 
newtaskbtn.addEventListener("click", () => toggleUI(false));

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add a new task
InsertBtn.addEventListener("click", () => {
    if (!inputtitle.value || !inputdescription.value){
        alert("Please fill the title and description");
    }
    else{
        addTask(inputtitle.value, inputdescription.value);
        showAlert("SuccessAlert");
    }
    inputtitle.value = "" ;
    inputdescription.value = "" ;
    addDiv.style.display = "none";
});

function addTask(title , descr){    
    let StartID ;
    if(tasksContainer.length ===0)
        StartID = 0;
    else
        StartID = tasksContainer[tasksContainer.length - 1].id; // getting the id of the last task inserted
    const newTask ={
        id : ++StartID , // it takes the index of the container number of the task + 1 bec it starts with zero 
        title ,
        descr ,
        checked : false 
    } 
    tasksContainer.push(newTask);
    Rerender();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// delete the task 
function getdeletedtask(){
    const trashbtns = document.querySelectorAll(".deletetaskbtn")
    trashbtns.forEach((button) => {
        button.addEventListener("click", ()=> {
            const taskid = +(button.getAttribute("data-id"));    
            console.log(taskid) ;
            removeTask(taskid);
            showAlert("DeletedAlert");
        })
    })
}

//  Remove a task by id 
function removeTask(id){    
    const taskremoved =  document.querySelector(`.deletetaskbtn[data-id="${id}"]`).closest('.task');
    taskremoved.classList.add('removing');
    setTimeout(() => {
        tasksContainer  = tasksContainer.filter((item)=>{ return item.id !== id});
        Rerender();
    }, 500) // the time i have set in the animation to be removed 
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//update task

function getupdatedtask(){
    const updatebtns = document.querySelectorAll(".edittaskbtn")
    updatebtns.forEach((button) => {
        button.addEventListener("click", ()=> {
            const taskid = +(button.getAttribute("data-id"));    
            toggleUI(true)
            updateTask(taskid);
            
        })
    })
}

    // Fill form with selected task data for updating
function updateTask(id) {
    let requiredItem = tasksContainer.find((item) => item.id === id); 
    inputtitle.value = requiredItem.title;
    inputdescription.value = requiredItem.descr;
    console.log( `the id = ${requiredItem.id}`);
    console.log(  " the input title : " + inputtitle.value)
    console.log(  " the requireditem title : " + requiredItem.title)
    // execute the update when the update button is clicked
    updatebtn.addEventListener("click", () => {
        if( inputtitle.value ===  requiredItem.title && inputdescription.value === requiredItem.descr){
            console.log(  " the input title : " + inputtitle.value)
            console.log(  " the requireditem title : " + requiredItem.title)
            alert("No changes made!");
        }
        else if (inputtitle.value  && inputdescription.value ) {
            // map through tasks and replace the old task with the updated task
            tasksContainer = tasksContainer.map(task =>
                task.id === id ? { ...task, title: inputtitle.value, descr: inputdescription.value, checked: false } : task
            );
            Rerender()                       // Update localStorage and re-render the tasks
            showAlert("UpdateAlert")
        }
        inputtitle.value = "";
        inputdescription.value = "";
        addDiv.style.display = "none";
    }, { once: true });                    // Ensure the event listener only runs once per click to prevent double change at the same time
    
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//checked logic 

function getCheckeditem(){
    const checkedbtn = document.querySelectorAll(".checkeditem")
    checkedbtn.forEach((checkitem) => {
        checkitem.addEventListener("change", ()=> {
            const taskid = +(checkitem.getAttribute("data-id"));
            const ischecked =  checkitem.checked   
            checkedTask(taskid , ischecked);
            
        })  
    })
}
// Update checked status of a task
function checkedTask(id, ischecked) {
    tasksContainer = tasksContainer.map(task => task.id === id ? { ...task, checked: ischecked } : task);
    Rerender();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function renderTask() {
    Tasks.innerHTML = ""
    tasksContainer.forEach(item => {
        Tasks.innerHTML += `<div class="task" >
        <div class="checkboxdiv">
            <input class="checkeditem"  data-id="${item.id}" type="checkbox" ${item.checked ? 'checked' : ''}>
    
            <div class="taskcontent">
                <p class="tasktext"> ${item.checked ? `<del> ${item.title} </del>` : item.title } </p>
                <p>${item.checked ? `<del>${item.descr}</del>` : item.descr}</p>
            </div>
        </div>
        <div class="taskbtns">
            <button class="alltaskbtns deletetaskbtn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            <button class="alltaskbtns edittaskbtn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        </div>
    </div>
    <hr>` 
        
    });
    getdeletedtask()
    getupdatedtask()
    getCheckeditem() 
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Show alert message
function showAlert(alertId) {
    const alert = document.getElementById(alertId);
    alert.classList.add("show");
    setTimeout(() => {
        alert.classList.remove("show");
        alert.classList.add("hide");
        setTimeout(() => alert.classList.remove("hide"), 100);
    }, 3000);
}


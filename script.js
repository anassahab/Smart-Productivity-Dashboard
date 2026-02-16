const title = document.getElementById("title");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");


const form = document.getElementById("taskForm");
const tasksContainer =document.getElementById("tasks");
const themeToggle =document.getElementById("themeToggle");
const searchInput =document.getElementById("search");
const filterPriority =document.getElementById("filterPriority");

let tasks =JSON.parse(localStorage.getItem("tasks")) || [];

//Save to localStorage
function saveTasks(){
    localStorage.setItem("tasks" , JSON.stringify(tasks));
}

function renderTasks(){
    tasksContainer.innerHTML ="";

    const searchValue =searchInput.value.toLowerCase();
    const filterValue =filterPriority.value;

    const filtered =tasks.filter(task =>
        task.title.toLowerCase().includes(searchValue)&&
        (filterValue === "All" || task.priority === filterValue)
    );

    filtered.forEach((task, index) => {
        const div =document.createElement("div");
        div.classList.add("task");
        if (task.completed) div.classList.add("completed");

        div.innerHTML =`<span>${task.title} (${task.priority})</span>
        <div>
            <button onclick="toggleTask(${index})">✔</button>
             <button onclick="deleteTask(${index})">✖</button>
      </div>
      `;
        tasksContainer.appendChild(div);
    });
updateStats();
}


//Add Tasks

form.addEventListener("submit" , e=> {
    e.preventDefault();

    const newTask = {
        title: title.value,
        dueDate: dueDate.value,
        priority: priority.value,
        completed: false
    };
     tasks.push(newTask);
  saveTasks();
  renderTasks();
  form.reset();
});


// Delete
function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

// Toggle complete
function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

// Stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total ? (completed / total) * 100 : 0;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("completedTasks").textContent = completed;
  document.getElementById("progressFill").style.width = percent + "%";
}

// Search & filter
searchInput.addEventListener("input", renderTasks);
filterPriority.addEventListener("change", renderTasks);

// Dark Mode
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
});

if (localStorage.getItem("theme") === "true") {
  document.body.classList.add("dark");
}

renderTasks();
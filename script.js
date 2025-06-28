const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const dueTime = document.getElementById("dueTime");
const tagInput = document.getElementById("taskTag");
const addTaskBtn = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const filters = document.querySelectorAll(".filters button");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const timeText = task.time ? ` ⏰ ${task.time}` : "";

    li.innerHTML = `
      <div class="task-top">
        <span>${task.text}</span>
        <div class="task-actions">
          <button onclick="toggleComplete(${index})" title="Complete">✅</button>
          <button onclick="editTask(${index})" title="Edit"><i class="fas fa-pencil-alt"></i></button>
          <button onclick="deleteTask(${index})" title="Delete"><i class="fas fa-times"></i></button>
        </div>
      </div>
      <div class="task-bottom">
        <span class="task-tag">${task.tag || ""}</span>
        <span style="color: ${isOverdue(task.date, task.time) ? "red" : "gray"};">
          ${task.date || ""} ${timeText}
        </span>
      </div>
    `;
    taskList.appendChild(li);
  });

  updateProgress();
}

function addTask() {
  const text = taskInput.value.trim();
  const date = dueDate.value;
  const time = dueTime.value;
  const tag = tagInput.value;

  if (text === "") return;

  tasks.push({ text, completed: false, tag, date, time });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  dueDate.value = "";
  dueTime.value = "";
  tagInput.value = "";
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText) {
    tasks[index].text = newText;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
  }
}

function updateProgress() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  progressBar.value = percent;
  progressText.textContent = `${percent}% Completed`;
}

function isOverdue(date, time) {
  if (!date) return false;
  const now = new Date();
  const due = new Date(`${date}T${time || "23:59"}`);
  return due < now;
}

filters.forEach(btn => {
  btn.addEventListener("click", () => renderTasks(btn.dataset.filter));
});

addTaskBtn.addEventListener("click", addTask);

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

renderTasks();

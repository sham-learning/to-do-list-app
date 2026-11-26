
// Select HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const filterButtons = document.querySelectorAll(".filter-btn");

// Retrieve saved tasks from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);

    taskInput.value = "";
    taskInput.focus();

    saveTasks();
    displayTasks();
}

// Display tasks
function displayTasks() {
    taskList.innerHTML = "";

    let filteredTasks = tasks;

    // Filter pending tasks
    if (currentFilter === "pending") {
        filteredTasks = tasks.filter(task => !task.completed);
    }

    // Filter completed tasks
    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Empty task message
    if (filteredTasks.length === 0) {
        const message = document.createElement("li");

        message.textContent = "No tasks to display.";
        message.style.textAlign = "center";
        message.style.color = "#999";
        message.style.padding = "20px";

        taskList.appendChild(message);
    }

    // Create task elements
    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");
        li.className = "task-item";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Complete checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete " + task.text);

        checkbox.addEventListener("change", function() {
            completeTask(task.id);
        });

        // Task text
        const span = document.createElement("span");

        span.className = "task-text";
        span.textContent = task.text;

        // Edit button
        const editBtn = document.createElement("button");

        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function() {
            editTask(task.id);
        });

        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        // Add elements to task list
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });

    updateStats();
}

// Complete or uncomplete a task
function completeTask(id) {
    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = !task.completed;

        saveTasks();
        displayTasks();
    }
}

// Edit a task
function editTask(id) {
    const task = tasks.find(task => task.id === id);

    if (!task) {
        return;
    }

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    if (newText.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    task.text = newText.trim();

    saveTasks();
    displayTasks();
}

// Delete a task
function deleteTask(id) {
    const confirmation = confirm(
        "Are you sure you want to delete this task?"
    );

    if (confirmation) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();
    }
}

// Update task counters and progress bar
function updateStats() {
    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    const pending = total - completed;

    totalCount.textContent = total;
    completedCount.textContent = completed;
    pendingCount.textContent = pending;

    // Calculate progress percentage
    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    progressText.textContent =
        completed + " of " + total +
        " tasks completed (" + percentage + "%)";

    progressFill.style.width = percentage + "%";
}

// Filter button events
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        displayTasks();
    });
});

// Add task using button
addBtn.addEventListener("click", addTask);

// Add task using Enter key
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Display saved tasks when page loads
displayTasks();

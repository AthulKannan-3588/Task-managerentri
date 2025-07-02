let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let filter = 'all';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';
  const filtered = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
  });

  filtered.forEach((task, index) => {
    const card = document.createElement('div');
    card.className = 'card task-card';
    card.innerHTML = `
          <div class="card-body d-flex justify-content-between align-items-center">
            <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
            <div>
              <button class="btn btn-sm btn-success me-1" onclick="markComplete(${index})">✔️</button>
              <button class="btn btn-sm btn-danger" onclick="deleteTask(${index})">🗑️</button>
            </div>
          </div>
        `;
    taskList.appendChild(card);
  });
}

function addTask() {
  const input = document.getElementById('taskInput');
  const errorMsg = document.getElementById('errorMsg');
  const title = input.value.trim();
  if (!title) {
    input.classList.add('error');
    errorMsg.classList.remove('d-none');
    return;
  }
  input.classList.remove('error');
  errorMsg.classList.add('d-none');
  tasks.push({ title, completed: false });
  saveTasks();
  renderTasks();
  input.value = '';
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function markComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function filterTasks(f) {
  filter = f;
  renderTasks();
}

document.getElementById('addBtn').addEventListener('click', addTask);

fetch('https://jsonplaceholder.typicode.com/todos?_limit=5')
  .then(res => res.json())
  .then(data => {
    if (tasks.length === 0) {
      tasks = data.map(item => ({ title: item.title, completed: item.completed }));
      saveTasks();
      renderTasks();
    } else {
      renderTasks();
    }
  })
  .catch(() => renderTasks());

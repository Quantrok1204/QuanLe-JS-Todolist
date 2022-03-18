const taskInput = document.querySelector(".task-input input"),
    list = document.querySelectorAll(".list span"),
    clearAll = document.querySelector(".clear"),
    taskBox = document.querySelector(".task-box");

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

list.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

function showTodo(list) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (list == todo.status || list == "all") {
                liTag += `<li class="task">
                        <label for="${id}">
                        <input class="checkhour" onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                        <p class="pDesc ${completed} NameToDo">${todo.name}</p>
                        </label>
                        <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h" id="showmenu"></i>
                        <ul class="task-menu">
                        <li onclick='editTask(${id}, "${todo.name}")'><i class="fas fa-pen"></i>Sửa</li><hr>
                        <li onclick='deleteTask(${id}, "${list}")'><i class="fas fa-trash"></i>Xóa</li>
                        </ul>
                        </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>Bạn chưa nhập công việc.</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodo("all");

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.id != "showmenu" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

function selectAll(selectedTask) {
    var checkboxes = document.getElementsByTagName('input');
    var ps = document.getElementsByClassName('pDesc');
    if (selectedTask.checked) {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = true;
            }
            ps[i].classList.add("checked");
        }
        todos.forEach((todo, id) => {
            todo.status = "completed";
        });
    } else {
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = false;
            }
            ps[i].classList.remove("checked");
        }
        todos.forEach((todo, id) => {
            todo.status = "active";
        });
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "active";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos))
}

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

function deleteTask(deleteId, list) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(list);
}

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo()
});

taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = {
                name: userTask,
                status: "active"
            };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});

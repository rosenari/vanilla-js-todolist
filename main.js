console.log("Load - main.js");

let Instance = null;

class TodoList {
    constructor($main, $list) {
        this._main = $main;
        this._list = $list;
        this._todo_list = null;

        this.init($main, $list);
    }

    /* Event Init */
    init($main, $list) {
        this._todo_list = this.getTodoList($list, this.getTodoListFromStorage());

        $main.addEventListener('click', (e) => {
            let target = e.target.id;
            if (target === "todo-register-btn") {
                this.registerHandler();
                this._todo_list = this.getTodoList($list, this.getTodoListFromStorage());
            }

            if (target === "todo-delete-btn") {
                this.deleteHandler(e.target.dataset.id);
                this._todo_list = this.getTodoList($list, this.getTodoListFromStorage());
            }
        });

        $main.addEventListener('keypress', (e) => {
            if (e.key == 'Enter' && e.target.id == "todo-register-content") {
                this.registerHandler();
                this._todo_list = this.getTodoList($list, this.getTodoListFromStorage());
            }
        })
    }

    /* Todo Register Btn ClickHandler */
    registerHandler = () => {
        console.log("[register handler]");
        let content = document.querySelector("#todo-register-content");
        if (content.value == "") {
            alert("내용을 입력해주세요 ^^");
            return;
        }
        this.addTodo(content.value);
        content.value = "";
    }

    /* Todo Delete Btn ClickHandler */
    deleteHandler = (id) => {
        console.log("[delete handler]");
        this.deleteTodo(id);
    }

    addTodo = (content) => {
        console.log("[add Todo]");
        let lastId = this._todo_list[this._todo_list.length - 1]?.id;

        if (!lastId) this._todo_list.push({ id: 0, content: content });
        else this._todo_list.push({ id: lastId + 1, content: content });

        localStorage.setItem('todolist', JSON.stringify(this._todo_list));
    }

    deleteTodo = (id) => {
        console.log("[delete Todo]");
        for (let i = 0; i < this._todo_list.length; i++) {
            let todo = this._todo_list[i];
            console.log(todo.id);
            if (id == todo.id) {
                this._todo_list.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('todolist', JSON.stringify(this._todo_list));
    }

    getTodoList = ($elem, $todo_list) => {
        $elem.innerHTML = "";
        for (let todo of $todo_list) {
            let elem = document.createElement('div');
            elem.classList.add('todo__todo');
            elem.innerHTML = `<div class="todo__todo-content">${todo.content}</div>
            <div class="todo__todo-input">
                <a class="todo__todo-delete-btn" id="todo-delete-btn" data-id="${todo.id}">X</a>
            </div>`;
            $elem.appendChild(elem);
        }

        return $todo_list;
    }

    getTodoListFromStorage = () => {
        console.log("[get TodoList From Storage]");
        let todo_list = localStorage.getItem('todolist');
        if (!todo_list) return [];

        return JSON.parse(todo_list);
    }
}

if (!Instance) {
    Instance = new TodoList(document.getElementById('todo__main')
        , document.getElementById('todo__list'));
    console.log("Created - TodoList Instance")
} else {
    console.log("Already Created Instance");
}
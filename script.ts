// Define a Todo class to represent each todo item
class Todo {
    id: number;
    task: string;
    completed: boolean;

    constructor(id: number, task: string) {
        this.id = id;
        this.task = task;
        this.completed = false;
    }
}

// Define the TodoList class to manage todo items
class TodoList {
    todos: Todo[];

    constructor() {
        // Retrieve todos from local storage or initialize an empty array
        const savedTodos = localStorage.getItem('todos');
        this.todos = savedTodos ? JSON.parse(savedTodos) : [];
    }

    addTodo(task: string) {
        const newTodo = new Todo(Date.now(), task);
        this.todos.push(newTodo);
        this.saveTodos();
    }

    deleteTodo(id: number) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
    }

    toggleTodoStatus(id: number) {
        const todoToUpdate = this.todos.find(todo => todo.id === id);
        if (todoToUpdate) {
            todoToUpdate.completed = !todoToUpdate.completed;
            this.saveTodos();
        }
    }

    private saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize the todo list
const todoList = new TodoList();

// Function to render the todo list
function renderTodoList() {
    const todoListElement = document.getElementById('todo-list');
    todoListElement.innerHTML = '';

    todoList.todos.forEach(todo => {
        const todoItem = document.createElement('li');
        todoItem.textContent = todo.task;
        todoItem.classList.add(todo.completed ? 'completed' : 'incomplete');

        todoItem.addEventListener('click', () => {
            todoList.toggleTodoStatus(todo.id);
            renderTodoList();
        });

        todoItem.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            todoList.deleteTodo(todo.id);
            renderTodoList();
        });

        todoListElement.appendChild(todoItem);
    });
}

// Event listener for adding a new todo
const addTodoForm = document.getElementById('add-todo-form');
addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputElement = <HTMLInputElement>document.getElementById('new-todo');
    const task = inputElement.value.trim();
    if (task !== '') {
        todoList.addTodo(task);
        inputElement.value = '';
        renderTodoList();
    }
});

// Initial rendering of the todo list
renderTodoList();

function initAndStart() {
    chrome.storage.sync.get(null, function(data) {
        var spreadsheetId;
        if (data['spreadsheetId']) {
            spreadsheetId = data['spreadsheetId'];
            SHEET_URL = BASE_URL + '/' + spreadsheetId;
            readSpreadsheet(10, showTodoItems);
        } else {
            notifyUserToCreateSpreadsheet();
            createSpreadsheet(createSpreadsheetCallback);
        }
    });
}

function createSpreadsheetCallback(spreadsheet) {
    var spreadsheetId = spreadsheet.spreadsheetId;
    var data = { 'spreadsheetId': spreadsheetId };
    chrome.storage.sync.set(data);
    SHEET_URL = BASE_URL + '/' + spreadsheetId;
    readSpreadsheet(10, showTodoItems);
}

function notifyUserToCreateSpreadsheet() {
    var notificationOptions = {
        'type': 'basic',
        'iconUrl': 'img/developers-logo.png',
        'title': 'TODO notice',
        'message': 'A new spreadsheet is created in drive for TODO extension',
        'isClickable': false,
    };
    chrome.notifications.create('new-sheet-notification', notificationOptions);
}

/**
 * @param {object} todo
 *    @value {string} date
 *    @value {string} content
 * @param {number} index
 * @return {object} todoItemElement
 */
function buildTodoItemElement(todo, index) {
    // TODO: use jquery to create todo item.
    // var todoItemHtml = "<div class='todo-container' id='todo-'" + index + ">" +
    //     "<div class='todo-content'> " + todo.content + "</div>" +
    //     "<div class='todo-priority'>" + todo.priority + "</div>" +
    //     "<div class='todo-button-container'>" +
    //     "<button class='todo-button' id='todo-done-button-'" + index + ">Done</button>" +
    //     "</div>" +
    //     "</div>";

    //container
    var todoItemElement = document.createElement('div');
    todoItemElement.setAttribute('id', 'todo-' + index);
    todoItemElement.className += 'todo-container';

    //content box
    var todoDivElement = document.createElement('div');
    var todoTextElement = document.createTextNode(todo.content);
    todoDivElement.appendChild(todoTextElement);
    todoDivElement.className += 'todo-content';
    todoItemElement.appendChild(todoDivElement);

    //priority box
    var todoPriorityElement = document.createElement('div');
    todoPriorityElement.appendChild(document.createTextNode(todo.priority));
    todoPriorityElement.className += 'todo-priority';
    todoItemElement.appendChild(todoPriorityElement);

    //done button
    var todoButtonDivElement = document.createElement('div');
    todoButtonDivElement.className += 'todo-button-container';
    var todoDoneButtonElement = document.createElement("button");
    todoDoneButtonElement.addEventListener('click', doneEventHandler, { 'once': true });
    todoDoneButtonElement.setAttribute('id', 'todo-done-button-' + index);
    todoDoneButtonElement.className += 'todo-button';
    todoDoneButtonElement.appendChild(document.createTextNode('Done'));
    todoButtonDivElement.appendChild(todoDoneButtonElement);
    todoItemElement.appendChild(todoButtonDivElement);

    return todoItemElement;
}

/**
 * @param {Array<Todo>}
 *   @value {string} date
 *   @value {string} content
 */
function showTodoItems(todos) {
    if (todos.length == 0 || todos[0].status === 'DONE') {
        $("#list-todos").text('Congratulations! No todo item.');
        return;
    }
    todos.forEach(function(todo, arrayIndex) {
        if (todo.status === 'DONE') {
            return;
        }
        var spreadsheetIndex = arrayIndex + 1;
        var todoItemElement = buildTodoItemElement(todo, spreadsheetIndex);
        $("#list-todos").append(todoItemElement);

    });
}

function doneEventHandler(clickEvent) {
    var todoButtonId = clickEvent.path[0].id;
    var spreadsheetIndex = todoButtonId.split('-').pop();
    markDoneForTodoItemInSpreadsheet(spreadsheetIndex, updateView);
}

function setupSubmitButton() {
    $('#submit').on('click', function() {
        var newTodoItem = createTodoItem();
        appendToSpreadsheet(newTodoItem, updateView);
    });
}

function createTodoItem() {
    var today = new Date();
    var content = $('#new-item-content').val();
    var priority = $('#new-item-priority').val();
    $('#new-item-content').val('');
    $('#new-item-priority').val('P2');
    return {
        'createDate': today.toLocaleDateString(),
        'content': content,
        'priority': priority,
        'status': 'NEW'
    };
}

function updateView() {
    $('#list-todos').empty();
    readSpreadsheet(10, showTodoItems);
}

// Document ready and run.
$(document).ready(function() {
    setupSubmitButton();
    getAuthToken(initAndStart);
});

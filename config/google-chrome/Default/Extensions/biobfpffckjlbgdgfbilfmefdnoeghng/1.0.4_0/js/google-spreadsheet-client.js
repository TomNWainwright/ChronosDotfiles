// This file has functions to handle CRUD of spreadsheet
var BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets'
var SHEET_URL;
var SHEET_NAME = 'Sheet1';
var SHEET_ID = '0';

var TIME_INDEX = 0;
var CONTENT_INDEX = 1;
var PRIORITY_INDEX = 2;
var STATUS_INDEX = 3;


function createSpreadsheet(successCallback) {
    var url = BASE_URL;
    var requestBody = {
        "properties": {
            "title": "Backend of todo extension"
        }
    };
    postXHR_(url, requestBody, successCallback);
}

// Current todo item has 4 column. Position is hardcoded.
function readSpreadsheet(n, successCallback, failureCallback) {
    n = n || 10;
    var ranges = 'A1:D' + n;
    var url = SHEET_URL + '/values/' + ranges;
    getXHR_(url, successCallback, failureCallback);
}

function appendToSpreadsheet(todo, successCallback, failureCallback) {
    var range = SHEET_NAME + '!A1:D1';
    var requestBody = {
        "range": range,
        "majorDimension": 'ROWS',
        "values": [
            [todo.createDate, todo.content, todo.priority, todo.status]
        ],
    };
    var url = SHEET_URL + '/values/' + range + ':append?valueInputOption=USER_ENTERED';
    var sortWrappedCallback = function() { sortSpreadsheet_(successCallback); }
    postXHR_(url, requestBody, sortWrappedCallback, failureCallback);
}

function markDoneForTodoItemInSpreadsheet(rowIndex, successCallback, failureCallback) {
    var range = SHEET_NAME + '!D' + rowIndex + ':D' + rowIndex;
    var url = SHEET_URL + '/values/' + range + '?valueInputOption=USER_ENTERED';
    var requestBody = {
        "range": range,
        "majorDimension": 'ROWS',
        "values": [
            ['DONE']
        ],
    };
    var sortWrappedCallback = function() { sortSpreadsheet_(successCallback); }
    putXHR_(url, requestBody, sortWrappedCallback, failureCallback);
}

function sortSpreadsheet_(successCallback, failureCallback) {
    var url = SHEET_URL + ':batchUpdate';
    var requestBody = {
        "requests": [{
            "sortRange": {
                "range": {
                    "sheetId": SHEET_ID,
                    "startColumnIndex": 0,
                    "endColumnIndex": 4,
                },
                "sortSpecs": [{
                    "dimensionIndex": STATUS_INDEX,
                    "sortOrder": 'DESCENDING'
                }, {
                    "dimensionIndex": PRIORITY_INDEX,
                    "sortOrder": 'ASCENDING'
                }, {
                    "dimensionIndex": TIME_INDEX,
                    "sortOrder": 'DESCENDING'
                }, ],
            }
        }]
    };
    postXHR_(url, requestBody, successCallback, failureCallback);
}


// @private
function getXHR_(url, successCallback, failureCallback) {
    successCallback = successCallback || consoleLogCallback_;
    failureCallback = failureCallback || consoleLogCallback_;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(parseListTodoItemsResponse_(JSON.parse(xhr.responseText)));
        } else {
            failureCallback(xhr.status, xhr.responseText);
        }
    }
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + AUTH_TOKEN);
    xhr.send();
}

// @private
function postXHR_(url, body, successCallback, failureCallback) {
    successCallback = successCallback || consoleLogCallback_;
    failureCallback = failureCallback || consoleLogCallback_;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else {
            failureCallback(xhr.status, xhr.responseText);
        }
    }
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + AUTH_TOKEN);
    xhr.send(JSON.stringify(body));
}

function putXHR_(url, body, successCallback, failureCallback) {
    successCallback = successCallback || consoleLogCallback_;
    failureCallback = failureCallback || consoleLogCallback_;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else {
            failureCallback(xhr.status, xhr.responseText);
        }
    }
    xhr.open('PUT', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + AUTH_TOKEN);
    xhr.send(JSON.stringify(body));
}

function consoleLogCallback_(errorCode, errorText) {
    if (errorCode === 404) {
        notFoundBackendNotification();
    }
}

function notFoundBackendNotification() {
    var notificationOptions = {
        'type': 'basic',
        'iconUrl': 'img/developers-logo.png',
        'title': 'TODO notice',
        'message': 'Cannot find backend todo spreadsheet from drive. Please reinstall extension to initiate spreadsheet.',
        'isClickable': false,
    };
    chrome.notifications.create('not-found-sheet-notification', notificationOptions);
}

function parseListTodoItemsResponse_(listTodoResponse) {
    var todos = [];
    if (listTodoResponse.values) {
        listTodoResponse.values.forEach(function(row) {
            todos.push({
                'date': row[0],
                'content': row[1],
                'priority': row[2],
                'status': row[3]
            });
        });
    }
    return todos;
}

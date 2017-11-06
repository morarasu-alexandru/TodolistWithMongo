console.log('Merge');

document.getElementById('SubmitButton').remove();
document.getElementById('target').insertAdjacentHTML('beforeend', '<button id="SecondSubmitButton" class="SubmitButton">Submit</button>');

var submitButton = document.getElementById('SecondSubmitButton');
var todoList = document.getElementById('todoList');
var taskInput = document.getElementById('todo');
var addedTask;

submitButton.addEventListener('click', submitAjax);
taskInput.addEventListener('keypress', function(e) {
    key = e.which || e.keyCode;
    if (key === 13) {
        e.preventDefault();
        submitAjax();
        this.value = "";
    }
});

function submitAjax() {
    console.log('Clicked');
    var taskInputValue = taskInput.value;
    var http = new XMLHttpRequest();

    http.open('POST', '//localhost:3000/', true);
    http.setRequestHeader('Content-Type', 'application/json');
    http.onreadystatechange = function () {

        if (http.readyState === XMLHttpRequest.DONE && http.status === 200) {
            console.log('request finished. Do processing here');
            addedTask = JSON.parse(http.response);
            console.log(addedTask);
            todoList.insertAdjacentHTML('beforeend',
                '<li>' +
                '<span>' + addedTask.task + '</span>' +
                '<form class="Form Delete" action="/=addedTask._id?_method=DELETE" method="post">' +
                '<button>' + 'Delete' + '</button>' +
                '</form>' +
                '</li>');
            console.log('addedTask: ', addedTask.task);
        }
    };
    http.send(JSON.stringify({task: taskInputValue, ajaxRequest: true}));
    console.log(taskInputValue, '  sent to DB');
    console.log(addedTask);
}

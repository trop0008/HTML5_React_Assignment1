let addForm = React.createClass({
    propTypes: {
        taskListItem: React.PropTypes.object
        , onChange: React.PropTypes.func
        , onClickSaveBtn: React.PropTypes.func
    }
    , onTaskChange: function (itemInput) {
        this.props.onChange(Object.assign({}, this.props.taskListItem, {
            task: itemInput.target.value
        }));
    }
    , onDescriptionChange: function (itemInput) {
        this.props.onChange(Object.assign({}, this.props.taskListItem, {
            description: itemInput.target.value
        }));
    }
    , onDateDueChange: function (itemInput) {
        this.props.onChange(Object.assign({}, this.props.taskListItem, {
            dateDue: itemInput.target.value
        }));
    }
    , onClickSaveBtn: function () {
        this.props.onClickSaveBtn(this.props.taskListItem);
    }
    , render: function () {
        return (React.createElement('div', {}, React.createElement('form', {}, React.createElement('label', {}, 'Task Title :'), React.createElement('input', {
            type: 'text'
            , placeholder: 'enter the task title'
            , value: this.props.taskListItem.task
            , onChange: this.onTaskChange
        }), React.createElement('label', {}, 'Task Description :'), React.createElement('textarea', {
            rows: '4'
            , cols: '150'
            , placeholder: 'enter task description'
            , value: this.props.taskListItem.description
            , onChange: this.onDescriptionChange
        }), React.createElement('label', {}, 'Date Due : '), React.createElement('input', {
            type: 'date'
            , value: this.props.taskListItem.dateDue
            , onChange: this.onDateDueChange
        })), React.createElement('div', {
            className: 'buttonDiv'
        }, React.createElement('a', {
            className: 'buttonclass'
            , href: '#list'
        }, 'Back to List'), React.createElement('a', {
            className: 'buttonclass'
            , onClick: this.onClickSaveBtn
            , href: '#list'
        }, ' Save Task '))));
    }
});
let NewTask = React.createClass({
    propTypes: {
        taskListItem: React.PropTypes.object
    }
    , render: function () {
        return (React.createElement('div', {}, React.createElement(addForm, {
            taskListItem: this.props.taskListItem
            , onChange: updateNewTask
            , onClickSaveBtn: addTask
        })));
    }
});


//adding new task item
function addTask(createdItem) {
    let newArray = state.items;
    let key = 1;
    if (newArray.length>0) {
        key = newArray[newArray.length - 1].key + 1;
    } 
    newArray.push(Object.assign({}, {
        key: key
        , id: key
    }, createdItem));
    setState({
        items: newArray
        , taskListItem: {
            task: ''
            , description: ''
            , dateDue: ''
        }
    });
}

function updateNewTask(selectedItem) {
    setState({
        taskListItem: selectedItem
    });
}
let BackToListBtn = React.createClass({
    propTypes: {}
    , render: function () {
        return (React.createElement('div', {
            className: 'buttonDiv'
        }, React.createElement('a', {
            href: '#list'
            , className: 'buttonclass'
        }, 'Back to List')));
    }
});
let itemTaskInfo = React.createClass({
    propTypes: {
        taskListItem: React.PropTypes.object
    }
    , render: function () {
        return (React.createElement('div', {}, React.createElement('h2', {}, 'Task: ' + this.props.taskListItem.task), React.createElement('div', {
            className: 'taskDetails'
        }, React.createElement('p', {}, 'Description: ' + this.props.taskListItem.description), React.createElement('p', {}, 'Date due: ' + this.props.taskListItem.dateDue))));
    }
});
let TaskDetails = React.createClass({
    propTypes: {
        taskListItem: React.PropTypes.object
    }
    , render: function () {
        return (React.createElement('div', {}, React.createElement(itemTaskInfo, {
            taskListItem: this.props.taskListItem
        }), React.createElement(BackToListBtn)));
    }
});
//Creating Task button
let ListCreateItemBtn = React.createClass({
    propTypes: {
        onClickNewItem: React.PropTypes.func
    }
    , render: function () {
        return (React.createElement('div', {
            className: 'buttonDiv'
        }, React.createElement('a', {
            className: 'buttonclass'
            , href: '#new'
            , onClick: this.props.onClickNewItem
        }, 'Create Task')));
    }
});
//task details
let ListItem = React.createClass({
    propTypes: {
        id: React.PropTypes.number
        , task: React.PropTypes.string
        , description: React.PropTypes.string
        , onDeleteButtonClicked: React.PropTypes.func
    }
    , render: function () {
        return (React.createElement('li', {
            onClick: this.onListItemClicked
        }, React.createElement('a', {
            href: '#item/' + this.props.id
        }, React.createElement('span', {}, this.props.task), React.createElement('span', {}, '( ' + this.props.dateDue + ' )')), React.createElement('button', {
            id: 'deleteBtn-' + this.props.id
            , onClick: this.props.onDeleteButtonClicked
        }, 'X')));
    }
});
//List of tasks
let ListTasks = React.createClass({
    propTypes: {
        items: React.PropTypes.array
    }
    , render: function () {
        return (React.createElement('div', {}, React.createElement('ul', {}, this.props.items.map(function (item) {
            item.onDeleteButtonClicked = deleteItem;
            return React.createElement(ListItem, item);
        })), React.createElement(ListCreateItemBtn, {
            onClickNewItem: newItem
        })));
    }
});
//deleting task
function deleteItem(selectedItem) {
    let id = selectedItem.target.id.split('-')[1];
    let newArray = state.items.filter(item => item.id != id ? true : false);
    setState({
        items: newArray
    });
}
//cleaning taskListItem
function newItem() {
    setState({
        taskListItem: {
            task: ''
            , description: ''
            , dateDue: ''
        }
    });
}
let state = {};
//on hash change
window.addEventListener('hashchange', () => setState({
    location: location.hash
}));

function setState(newtasks) {
    state = Object.assign({}, state, newtasks);
    let page;
    let location = state.location.replace(/^#\/?|\/$/g, '').split('/');
    //page routing
    switch (location[0]) {
    case 'new':
        page = NewTask;
        break;
    case 'item':
        page = TaskDetails;
        state.taskListItem = state.items.find(item => item.key == location[1] ? true : false);
        break;
    default:
        page = ListTasks;
    }
    let MainListView = React.createElement('div', {
        className: 'container'
    }, React.createElement(page, state));
    ReactDOM.render(MainListView, document.getElementById('react-app'));
}
setState({
    taskListItem: {
        task: ''
        , description: ''
        , dateDue: ''
    }
    , items: descriptionData
    , location: location.hash
});
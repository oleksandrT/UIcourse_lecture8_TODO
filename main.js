var planner = document.querySelector(".planner");

var sections, addNewGroupBtn, addNewItemBtn, startBtn, stopBtn, resetBtn, data;

// Constants
var helpTextNotEmpty = "New item can be created only if all fields are set",
    helpTextNotNumber = "Time set as not a number",
    helpTextExceedValue = "Break new task on smaller ones, so duration of each doesn't exceed 8 hours",
    helpTextNoTitle = "You should type a title for new group";

// Templates
var sectionInner = '';
var controlsDivInner = '<span>Timer:</span> <button class="planner_item-button planner_item-button--start js-start">Start</button> <button class="planner_item-button planner_item-button--stop js-stop">Stop</button> <button class="planner_item-button planner_item-button--reset js-reset">Reset</button>';
var addNewDivInner = '<input type="text" placeholder="New Item\'s title" class="planner_input"> <input type="text" placeholder="New Item\'s duration" class="planner_input"> <button class="planner_item-button planner_item-button--add js-new-item">Add new item</button>';

// Initial Data
var initData = {
    "groups": [
        {
            title: "Default",
            content: [
                {
                    title: "Test task",
                    timeEstimation: "8",
                    timeLeft: "6"
                },
                {
                    title: "Test task2",
                    timeEstimation: "8",
                    timeLeft: "4"
                }
            ]
        }
        // {
        //     title: "Private",
        //     content: [
        //         {
        //             title: "Test task 3",
        //             timeEstimation: "5",
        //             timeLeft: "4"
        //         }
        //     ]
        // }
    ]
};


initStorage();
renderUI(data);
addClickHandlers();


function initStorage() {
    if (window.localStorage) {
        var localVal,
            localItem = localStorage.getItem("my-todo");
        if (localItem == null) {
            localVal = initData;
            localStorage.setItem("my-todo",  JSON.stringify(localVal));
        } else {
            localVal = JSON.parse(localItem);
        }

        data = localVal;
    }
}

function renderUI(obj) {
    for (var j = 0, n = obj.groups.length; j < n; j++) {
        //Group title
        var h2El = document.createElement("h2");
        h2El.className = "planner_group-title";
        h2El.innerHTML = obj.groups[j].title;

        //Add new fields
        var addNewDiv = document.createElement("div");
        addNewDiv.className = "planner_add-new";
        addNewDiv.innerHTML = addNewDivInner;

        //Helper maessage
        var pEl = document.createElement("p");
        pEl.className = "text-help";
        pEl.innerHTML = "";

        //Divider
        var dividerEl = document.createElement("hr");
        dividerEl.className = "planner_divider";

        //Task list
        var ulEl = document.createElement("ul");
        ulEl.className = "planner_list";

        //Task list items
        for (var i = 0, m = obj.groups[j].content.length; i < m; i++) {
            var liEl = document.createElement("li");
            liEl.className = "planner_item";

            var titleDiv = document.createElement("div");
            var timeEstimDiv = document.createElement("div");
            var timeLeftDiv = document.createElement("div");
            var controlsDiv = document.createElement("div");
            titleDiv.className = "planner_item-title";
            timeEstimDiv.className = "planner_item-time";
            timeLeftDiv.className = "planner_item-time";
            controlsDiv.className = "planner_item-controls";
            titleDiv.innerHTML = obj.groups[j].content[i].title;
            timeEstimDiv.innerHTML = "Estimated time:" + obj.groups[j].content[i].timeEstimation;
            timeLeftDiv.innerHTML = "Time left:" + obj.groups[j].content[i].timeLeft;
            controlsDiv.innerHTML = controlsDivInner;

            liEl.appendChild(titleDiv);
            liEl.appendChild(timeEstimDiv);
            liEl.appendChild(timeLeftDiv);
            liEl.appendChild(controlsDiv);

            ulEl.appendChild(liEl);
        }

        //Section
        var sectionDiv = document.createElement("section");
        sectionDiv.className = "planner_group";

        sectionDiv.appendChild(h2El);
        sectionDiv.appendChild(addNewDiv);
        sectionDiv.appendChild(pEl);
        sectionDiv.appendChild(dividerEl);
        sectionDiv.appendChild(ulEl);

        planner.appendChild(sectionDiv);
    }
}

function addClickHandlers() {
    sections = document.querySelectorAll(".planner_group");
    addNewGroupBtn = document.querySelector(".js-new-group");

    addNewGroupBtn.addEventListener("click", function(e) {addNewGroup(e.target)});

    for (var i = 0, n = sections.length; i < n; i++) {
        sections[i].addEventListener("click", function(e) {handleClick(e.target)});
    }
}

function handleClick(elem) {
    var elemClass = elem.className;
    if ( elemClass.indexOf("js-new-item") >=0 ) {
        addNewItem(elem);
    } else if ( elemClass.indexOf("js-start") >=0 ) {
        startTimer(elem);
    } else if ( elemClass.indexOf("js-stop") >=0 ) {
        // console.log("stop btn");
    } else if ( elemClass.indexOf("js-reset") >=0 ) {
        resetTimer(elem);
    }
}

function addNewItem(elem) {
    var inputTime = elem.previousElementSibling,
        inputTitle = inputTime.previousElementSibling,
        sectionEl = elem.parentNode.parentNode,
        list = sectionEl.querySelector(".planner_list"),
        textHelp = sectionEl.querySelector(".text-help");

    // Clear help text
    textHelp.innerHTML = "";
    textHelp.className = "text-help";

    if (inputTitle.value != "" && inputTime.value != "") {
        var title = inputTitle.value,
            timeEstimation = parseInt(inputTime.value, 10);
        if (isNaN(timeEstimation)) {
            textHelp.innerHTML = helpTextNotNumber;
            textHelp.className = "text-help show";
        } else if (timeEstimation > 8) {
            textHelp.innerHTML = helpTextExceedValue;
            textHelp.className = "text-help show";
        } else {
            var groupTitle = elem.parentNode.previousElementSibling.innerHTML;
            saveNewItem(inputTitle.value, inputTime.value, groupTitle);
            appendNewItem(inputTitle.value, inputTime.value, list);

            // Clear inputs
            inputTitle.value = "";
            inputTime.value = "";
        }
    } else {
        textHelp.innerHTML = helpTextNotEmpty;
        textHelp.className = "text-help show";
    }
}

function saveNewItem(title, time, groupTitle) {
    for (var i = 0, n = data.groups.length; i < n; i++) {
        if (data.groups[i].title == groupTitle) {
            data.groups[i].content.push({
                title: title,
                timeEstimation: time,
                timeLeft: time
            });
        }
    }

    localStorage.setItem("my-todo",  JSON.stringify(data));
}

function appendNewItem(title, time, parent) {
    var liEl = document.createElement("li");
    liEl.className = "planner_item";

    var titleDiv = document.createElement("div");
    var timeEstimDiv = document.createElement("div");
    var timeLeftDiv = document.createElement("div");
    var controlsDiv = document.createElement("div");
    titleDiv.className = "planner_item-title";
    timeEstimDiv.className = "planner_item-time";
    timeLeftDiv.className = "planner_item-time";
    controlsDiv.className = "planner_item-controls";
    titleDiv.innerHTML = title;
    timeEstimDiv.innerHTML = "Estimated time:" + time;
    timeLeftDiv.innerHTML = "Time left:" + time;
    controlsDiv.innerHTML = controlsDivInner;

    liEl.appendChild(titleDiv);
    liEl.appendChild(timeEstimDiv);
    liEl.appendChild(timeLeftDiv);
    liEl.appendChild(controlsDiv);

    parent.appendChild(liEl);
}

function addNewGroup(elem) {
    var inputTitle = elem.previousElementSibling,
        textHelp = elem.parentNode.nextElementSibling;

    // Clear help text
    textHelp.innerHTML = "";
    textHelp.className = "text-help";

    if (inputTitle.value != "") {
        saveNewGroup(inputTitle.value);
        appendNewGroup(inputTitle.value);

        // Clear input
        inputTitle.value = "";
    } else {
        textHelp.innerHTML = helpTextNoTitle;
        textHelp.className = "text-help show";
    }
}

function saveNewGroup(title) {
    var newGroup = formGroupObject(title);
    data.groups.push(newGroup);
    localStorage.setItem("my-todo",  JSON.stringify(data));
}

function appendNewGroup(title) {
    //Section
    var sectionDiv = document.createElement("section");
    sectionDiv.className = "planner_group";

    //Group title
    var h2El = document.createElement("h2");
    h2El.className = "planner_group-title";
    h2El.innerHTML = title;

    //Add new fields
    var addNewDiv = document.createElement("div");
    addNewDiv.className = "planner_add-new";
    addNewDiv.innerHTML = addNewDivInner;

    //Helper maessage
    var pEl = document.createElement("p");
    pEl.className = "text-help";
    pEl.innerHTML = "";

    //Divider
    var dividerEl = document.createElement("hr");
    dividerEl.className = "planner_divider";

    //Task list
    var ulEl = document.createElement("ul");
    ulEl.className = "planner_list";

    sectionDiv.appendChild(h2El);
    sectionDiv.appendChild(addNewDiv);
    sectionDiv.appendChild(pEl);
    sectionDiv.appendChild(dividerEl);
    sectionDiv.appendChild(ulEl);

    planner.appendChild(sectionDiv);

    addClickHandlers();
}

function formGroupObject(title) {
    return {
        title: title,
        content: []
    }
}

function startTimer(elem) {
    var item = elem.parentNode.parentNode,
        group = item.parentNode.parentNode,
        timeLeftEl = item.querySelectorAll(".planner_item-time")[1],
        timeLeft = timeLeftEl.innerHTML.slice(-1),
        deadline = new Date(Date.parse(new Date()) + timeLeft * 60 * 60 * 1000);

    var groupTitle = group.querySelector(".planner_group-title").innerHTML,
        itemTitle = item.querySelector(".planner_item-title").innerHTML;

    initTimer(timeLeftEl, deadline, groupTitle, itemTitle);
}

function initTimer(el, endtime, groupTitle, itemTitle) {
    function updateTimer() {
        var t = getTimeRemaining(endtime);
        el.innerHTML = "Time left:" + t.hours;
        saveNewTime(t.hours, groupTitle, itemTitle);

        if (t.total <= 0) {
            clearInterval(timerInterval);
        }
    }

    updateTimer();
    var timerInterval = setInterval(updateTimer, 60 * 60 * 1000);  // each hour

    // Set handler on stop button
    var stopBtn = el.nextElementSibling.querySelector(".js-stop");
    stopBtn.addEventListener("click", function () {
        clearInterval(timerInterval);
    })
}

function getTimeRemaining(endtime) {
    var t = Date.parse(endtime) - Date.parse(new Date());
    var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
    return {
        'total': t,
        'hours': hours
    };
}

function saveNewTime(newTime, groupTitle, itemTitle) {
    var localItem = localStorage.getItem("my-todo"),
        arr = JSON.parse(localItem);

    arr.groups.forEach(function(group, i){
        if(group.title === groupTitle) {
            group.content.forEach(function(item, j){
                if(item.title === itemTitle) {
                    item.timeLeft = newTime;
                }
            });
        }
    });

    localStorage.setItem("my-todo",  JSON.stringify(arr));
}

function resetTimer(elem) {
    var item = elem.parentNode.parentNode,
        group = item.parentNode.parentNode,
        timeEstimationEl = item.querySelectorAll(".planner_item-time")[0],
        timeLeftEl = item.querySelectorAll(".planner_item-time")[1];

    timeLeftEl.innerHTML = "Time left:" + timeEstimationEl.innerHTML.slice(-1);

    var groupTitle = group.querySelector(".planner_group-title").innerHTML,
        itemTitle = item.querySelector(".planner_item-title").innerHTML;

    saveNewTime(timeEstimationEl.innerHTML.slice(-1), groupTitle, itemTitle);
}

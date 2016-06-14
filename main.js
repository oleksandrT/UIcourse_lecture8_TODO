// Get all buttons
var sections = document.querySelectorAll(".planner_group");
var addNewGroupBtn = document.querySelectorAll(".js-new-group");
var addNewItemBtn = document.querySelectorAll(".js-new-item");
var startBtn = document.querySelectorAll(".js-start");
var stopBtn = document.querySelectorAll(".js-stop");
var resetBtn = document.querySelectorAll(".js-reset");

addClickHandlers();









function addClickHandlers() {
    for (var i = 0, n = sections.length; i < n; i++) {
        sections[i].addEventListener("click", function(e) {handleClick(e.target)});
    }
}

function handleClick(elem) {
    var elemClass = elem.className;
    if ( elemClass.indexOf("js-new-item") >=0 ) {
        console.log("add new item btn");
    } else if ( elemClass.indexOf("js-start") >=0 ) {
        console.log("start btn");
    } else if ( elemClass.indexOf("js-stop") >=0 ) {
        console.log("stop btn");
    } else if ( elemClass.indexOf("js-reset") >=0 ) {
        console.log("reset btn");
    }
}


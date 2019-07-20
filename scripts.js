let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

showCalendar(currentMonth, currentYear);

function showCalendar(month, year) {
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = 32 - new Date(year, month, 32).getDate();

    let calendarBody = document.getElementById("calendar-body"); // body of the calendar
    let monthAndYear = document.getElementById("monthAndYear");

    // clearing all previous cells
    calendarBody.innerHTML = "";

    // filing data about month and in the page via DOM.
    monthAndYear.innerHTML = months[month] + " " + year;

    // creating all cells
    let date = 1;

    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = document.createElement("tr");

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                let cell = document.createElement("td");
                let cellText = document.createTextNode("");
                cell.appendChild(cellText);
                row.appendChild(cell);
            }
            else if (date > daysInMonth) {
                break;
            }
            else {
                let cell = showTableCells(year, month, date);

                row.appendChild(cell);
                date++;
            }
        }

        calendarBody.appendChild(row); // appending each row into calendar body.
    }

}

function showTableCells(year, month, date) {
    let cell = document.createElement("td");
    let cellText = document.createTextNode(date);

    cell.appendChild(cellText);

    let clickEvent = document.createAttribute("onClick");
    clickEvent.value = 'onCellClick(' + date + ')';
    let dataToggle = document.createAttribute("data-toggle");
    dataToggle.value = "modal";
    let dataTarget = document.createAttribute("data-target");
    dataTarget.value = "#myModal";

    cell.setAttributeNode(dataToggle);
    cell.setAttributeNode(dataTarget);
    cell.setAttributeNode(clickEvent);

    cell = localStorageDataForCell(cell, year, month, date);


    if (
        date === today.getDate() &&
        year === today.getFullYear() &&
        month === today.getMonth()
    ) {
        cell.classList.add("bg-info");
    } // color today's date

    return cell;
}

function localStorageDataForCell(cell, year, month, date) {
    let monthAndYear = months[month] + "-" + year;
    let localStorageData = JSON.parse(localStorage.getItem(date + "-" + monthAndYear));

    if(
        localStorageData &&
        date === Number(localStorageData.date) &&
        year === localStorageData.year &&
        month === localStorageData.month
    ) {
        let eventDiv = document.createElement("div");
        let eventTextDiv =  document.createElement("div");
        let eventText = document.createTextNode(localStorageData.name);
        let startTimeText = document.createTextNode(localStorageData.startTime + ' - ');
        let endTimeText = document.createTextNode(localStorageData.endTime);

        eventDiv.appendChild(startTimeText);
        eventDiv.appendChild(endTimeText);
        cell.appendChild(eventDiv);

        eventTextDiv.appendChild(eventText);
        cell.appendChild(eventTextDiv);
    }

    return cell;
}

function nextCalendar() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    showCalendar(currentMonth, currentYear);
}

function loadMore () {
    nextCalendar()
}

let infiniteList = document.querySelector('#infinite-list');
// Detect when scrolled to bottom.
infiniteList.addEventListener('scroll', function() {
    if (infiniteList.scrollTop + infiniteList.clientHeight >= infiniteList.scrollHeight) {
        loadMore();
        infiniteList.scrollTop = 10;
    }
});


function saveEvent() {
    let inputValues = saveEventInputValues();
    let monthAndYear = months[inputValues.month] + "-" + inputValues.year

    let error = document.getElementById("error");
    error.innerHTML = '';

    if(!inputValues.name || !inputValues.date || !inputValues.startTime || !inputValues.endTime) {
        error.innerHTML = 'All Fields are required!'
        return false;
    }

    let saveEventButton = document.getElementById("save-event-button");
    let dataDismiss = document.createAttribute("data-dismiss");
    dataDismiss.value = "modal";
    saveEventButton.setAttributeNode(dataDismiss);


    localStorage.setItem(inputValues.date + "-" + monthAndYear, JSON.stringify(inputValues))

    showCalendar(inputValues.month, inputValues.year)
}

function saveEventInputValues() {
    let name = document.getElementById("event-name").value;
    let startTime = document.getElementById("start-time").value;
    let endTime = document.getElementById("end-time").value;

    let eventDate = document.getElementById("event-date").value;
    let date = new Date(eventDate).getDate()
    let year = new Date(eventDate).getFullYear()
    let month = new Date(eventDate).getMonth()

    return {
        name,
        date,
        startTime,
        endTime,
        year,
        month
    }
}

function onCellClick(date) {
    let cellDate = document.getElementById("cell-date");
    cellDate.value = date;
}

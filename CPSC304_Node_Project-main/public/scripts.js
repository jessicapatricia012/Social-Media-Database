/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */

// This function initializes tables stated in CREATE_socialMedia.sql
async function initializeTables() {
    const response = await fetch("/initiate-tables", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('initTableResultMsg');
        messageElement.textContent = "table initiated successfully!";
    } else {
        alert("Error initiating table!");
    }
}

//EXAMPLE WILL DELETE LATER
// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
    .then((text) => {
        statusElem.textContent = text;
    })
    .catch((error) => {
        statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
    });
}

//EXAMPLE WILL DELETE LATER
// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the table and displays it.
async function fetchAndDisplayUsers2() {
    const content = [];
    const tableElement = document.getElementById('tables');
    const tableBody = tableElement.querySelector('tbody');

    for (const option of selectedOptions) {
        let sql = "";
        // will need to fix this later
        if (option == 'image') {
            sql = `/table/imagecontainedby1`;
        } else if (option == 'video') {
            sql = `/table/videocontainedby1`;
        } else {
            sql= `/table/${option}`;
        }

        try {
            const response = await fetch(sql, { method: 'GET' });
            const responseData = await response.json();

            if (responseData && responseData.data) {
                content.push(responseData.data);
            }
        } catch (err) {
            console.error('Error fetching table data:', err);
        }
    }

    // Always clear old data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    for (let table of content) {
        // Loop through all keys in the table object (e.g., "Awards", "People")
        for (let tableName in table) {
            if (table.hasOwnProperty(tableName)) {
                const tableData = table[tableName];
                console.log(tableName, tableData); // Logs the table name and its data
                createTable(tableName, tableData); // Dynamically pass the table name and data
            }
        }
    }
}

// Function to dynamically create a table for a given table name and its data
function createTable(tableName, tableData) {
    const tablesContainer = document.getElementById('tablesContainer');

    // Create a heading element for the table name
    const heading = document.createElement('h3');
    heading.innerText = tableName; // Set the text of the heading to the table name

    // Add the heading above the table
    tablesContainer.appendChild(heading);

    // Create the table element
    const table = document.createElement('table');
    table.setAttribute('border', '1');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // If there's data, create table headers based on columns in the table data
    if (tableData.length > 0) {
        Object.keys(tableData[0]).forEach((key) => {
            const th = document.createElement('th');
            th.innerText = key;  // Use the key as the column name (header)
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    } else {
        // If no data, add a header row indicating no data is available
        const th = document.createElement('th');
        th.colSpan = 100;  // Span across all columns
        th.innerText = 'No Available Data';  // Display message in the header row
        headerRow.appendChild(th);
        thead.appendChild(headerRow);
    }
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    // If there is data, create rows
    if (tableData.length > 0) {
        tableData.forEach((row) => {
            const tr = document.createElement('tr');
            Object.values(row).forEach((value) => {
                const td = document.createElement('td');
                td.innerText = value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        // If no data, add a row with a message indicating no data available
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 100;  // Span across all columns
        td.innerText = 'No Data Available';  // Message for empty table
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    // Add the table to the container
    tablesContainer.appendChild(table);
}


// Inserts new records into the demotable.
async function insertDemotable(event) {
    event.preventDefault();

    const idValue = document.getElementById('insertId').value;
    const nameValue = document.getElementById('insertName').value;

    const response = await fetch('/insert-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: idValue,
            name: nameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Data inserted successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error inserting data!";
    }
}

// Updates names in the demotable.
async function updateNameDemotable(event) {
    event.preventDefault();

    const oldNameValue = document.getElementById('updateOldName').value;
    const newNameValue = document.getElementById('updateNewName').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Name updated successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// Counts rows in the demotable.
// Modify the function accordingly if using different aggregate functions or procedures.
async function countDemotable() {
    const response = await fetch("/count-demotable", {
        method: 'GET'
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('countResultMsg');

    if (responseData.success) {
        const tupleCount = responseData.count;
        messageElement.textContent = `The number of tuples in demotable: ${tupleCount}`;
    } else {
        alert("Error in count demotable!");
    }
}


// For dropdown menu
const options = [
    'Awards', 'Chatroom', 'CommentOn', 'Communities', 'EntryCreatedBy',
    'Follows', 'GivenToBy', 'Images', 'JoinsChatRoom', 'JoinsCommunity',
    'MessagesSentByIn', 'PostIn', 'Users', 'Videos', 'Vote'
];

const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const selectedOptionsDisplay = document.getElementById('selectedOptions');

// Array to store selected tables
let selectedOptions = [];

// Populate the dropdown
function populateDropdown(optionsArray) {
    optionsArray.forEach(optionText => {
        const li = document.createElement('li');
        li.textContent = optionText;

        li.addEventListener('click', () => {
            li.classList.toggle('selected');
            if (li.classList.contains('selected')) {
                selectedOptions.push(optionText);
            } else {
                const index = selectedOptions.indexOf(optionText);
                if (index > -1) {
                    selectedOptions.splice(index, 1);
                }
            }

            // Update the dropdown and data tables
            updateSelectedOptions();
            fetchTableData2();

            dropdownMenu.style.display = 'none';
        });

        dropdownMenu.appendChild(li);
    });
}

// Update the displayed selected options
function updateSelectedOptions() {
    if (selectedOptions.length > 0) {
        selectedOptionsDisplay.textContent = selectedOptions.join(', ');
    } else {
        selectedOptionsDisplay.textContent = 'None';
    }
}

// Toggle dropdown visibility on button click
dropdownButton.addEventListener('click', () => {
    dropdownMenu.style.display =
        dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Populate the dropdown on page load
populateDropdown(options);




// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    initializeTables();
    checkDbConnection();
    fetchTableData();
    fetchTableData2();
    document.getElementById("selectButton").addEventListener("click", fetchTableData2);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("initTable").addEventListener("click", initializeTables);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);

};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

function fetchTableData2() {
    fetchAndDisplayUsers2();
}

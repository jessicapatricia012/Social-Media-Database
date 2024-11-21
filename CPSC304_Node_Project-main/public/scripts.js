/* Project Code*/

// Initializes database and inserts starting values
async function initializeAndInsertTables() {
    await initializeTables();
    await insertTables();
}

// This function initializes tables stated in CREATE_tables.sql
async function initializeTables() {

    const response = await fetch("/initiate_create_table", {
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


// This function inserts tables stated in INSERT_tables.sql
async function insertTables() {

    const response = await fetch("/insert_table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('insertTableResultMsg');
        messageElement.textContent = "inserted values successfully!";
    } else {
        alert("Error inserting table!");
    }
}

//TODO: Need to determine if we want to show DB connection status
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

// Fetches data from the table and displays it. (Currently in use and not an example)
async function fetchAndDisplayUsers() {
    console.log("FetchingAndDisplay STARTED");
    const content = [];
    const tablesContainer = document.getElementById('tablesContainer');

    // Clear the entire container before new fetching process
    if (tablesContainer) {
        tablesContainer.innerHTML = '';
    } else {
        console.error("Tables container not found");
        return;
    }

    // Continue with fetching and displaying the data
    for (const option of selectedOptions) {
        let sql = "";
        if (option == 'image') {
            sql = `/table/imagecontainedby1`;
        } else if (option == 'video') {
            sql = `/table/videocontainedby1`;
        } else {
            sql = `/table/${option}`;
        }

        try {
            console.log('SCRIPT-FETCH: fetching all users', sql);
            const response = await fetch(sql, {method: 'GET'});
            const responseData = await response.json();
            console.log(responseData);

            if (responseData && responseData.data) {
                const metaData = responseData.data.metaData;
                const rows = responseData.data.rows;
                content.push({metaData, rows, tableTitle: option});
            }
        } catch (err) {
            console.error('Error fetching table data:', err);
        }
    }

    // After clearing, create new tables with the data fetched
    content.forEach(data => {
        const {metaData, rows, tableTitle} = data;

        // Create the table using your createTable function
        createTable(metaData, rows, tableTitle);
    });
}


// Function to dynamically create a table for a given table name and its data
function createTable(metaData, tableData, tableTitle) {
    console.log("createTable STARTED")
    const tablesContainer = document.getElementById('tablesContainer');

    // Create a header for the table (e.g., a <h3> with the table's title)
    const tableHeader = document.createElement('h3');
    tableHeader.innerText = tableTitle;
    tablesContainer.appendChild(tableHeader);

    // Create the table element
    const table = document.createElement('table');
    table.setAttribute('border', '1');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // Create table headers based on columns in the metaData
    if (Array.isArray(metaData) && metaData.length > 0) {
        metaData.forEach((item) => {
            const th = document.createElement('th');
            th.innerText = item.name;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    } else {
        // If no metaData, add a header row indicating no data
        const th = document.createElement('th');
        th.colSpan = 100;
        th.innerText = 'No Available Data';
        headerRow.appendChild(th);
        thead.appendChild(headerRow);
    }
    table.appendChild(thead);

    // Create the table body
    const tbody = document.createElement('tbody');

    // If there is data, create rows
    if (Array.isArray(tableData) && tableData.length > 0) {
        tableData.forEach((row) => {
            const tr = document.createElement('tr');
            row.forEach((value) => {
                const td = document.createElement('td');
                // Check if value is null or undefined, replace with 'Empty'
                td.innerText = (value === null || value === undefined) ? 'Empty' : value;
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        });
    } else {
        // If no rows, add a row with a message indicating no data available
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = metaData.length;
        td.innerText = 'No Data Available';
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    // Add the table to the container
    tablesContainer.appendChild(table);
}

// For dropdown menu
const options = [
    'Awards', 'Chatroom', 'CommentOn', 'Communities', 'EntryCreatedBy',
    'Follows', 'GivenToBy', 'Images', 'JoinsChatRoom', 'JoinsCommunity',
    'MessagesSentByIn', 'PostIn', 'Users', 'Videos', 'Vote'
];

// Dropdown for viewing table
const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const selectedOptionsDisplay = document.getElementById('selectedOptions');
let selectedOptions = [];

// Dropdown for inserting
const insertDropdownButton = document.getElementById('insertDropdownButton');
const insertDropdownMenu = document.getElementById('insertDropdownMenu');
const insertSelectedOptionsDisplay = document.getElementById('insertSelectedOptions');
let insertSelectedOption = [];

// Populate the dropdown
function populateDropdown(button, menu, optionsArray, selectedArray, displayElement, multiSelect = true) {
    optionsArray.forEach(optionText => {
        const li = document.createElement('li');
        li.textContent = optionText;

        li.addEventListener('click', () => {
            if (multiSelect) {
                console.log("click")
                // multi-select dropdown
                li.classList.toggle('selected');
                if (li.classList.contains('selected')) {
                    selectedArray.push(optionText);
                } else {
                    const index = selectedArray.indexOf(optionText);
                    if (index > -1) {
                        selectedArray.splice(index, 1);
                    }
                }
                fetchTableData();
            } else {
                // Single select dropdown
                const previouslySelected = menu.querySelectorAll('.selected');
                previouslySelected.forEach(item => item.classList.remove('selected'));
                li.classList.toggle('selected');
                if (li.classList.contains('selected')) {
                    selectedArray = [optionText];
                } else {
                    li.classList.toggle('selected');
                    const index = selectedArray.indexOf(optionText);
                    if (index > -1) {
                        selectedArray.splice(index, 1);
                    }
                }
                console.log(selectedArray);
                generateForm(selectedArray[0]);
            }

            // Update the displayed selected options
            updateSelectedOptions(displayElement, selectedArray, multiSelect);
            menu.style.display = 'none';
        });

        menu.appendChild(li);
    });

    // Toggle dropdown visibility on button click
    button.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
}

// Update the displayed selected options based on multiselect
function updateSelectedOptions(displayElement, selectedArray, multiSelect) {
    if (multiSelect) {
        displayElement.textContent = selectedArray.length > 0 ? selectedArray.join(', ') : 'None';
    } else {
        displayElement.textContent = selectedArray.length > 0 ? selectedArray[0] : 'None';
    }
}

// Make forms for inserting tables and their features
// TODO: IMAGES AND VIDEOS HAVE NOT BEEN FIXED YET
const featuresMap = {
    Awards: ['Type', 'Username', 'entryID'],
    Chatroom: ['ID', 'Name'],
    CommentOn: ['Entry ID', 'On Entry ID'],
    Communities: ['Community Name', 'Rules', 'Description'],
    EntryCreatedBy: ['Entry ID', 'Date Created', 'Content', 'Username'],
    Follows: ['Following Username', 'Follower Username'],
    GivenToBy: ['Item', 'Giver', 'Receiver'],
    Images: ['Image URL', 'Upload Date'],
    JoinsChatRoom: ['Chatroom ID', 'Username'],
    JoinsCommunity: ['Username', 'Community Name'],
    MessagesSentByIn: ['ID', 'Date Sent', 'Content', 'Username', 'Chatroom ID'],
    PostIn: ['Entry ID', 'Title', 'Community Name'],
    Users: ['Username', 'Email', 'Join Date', 'Display Name', 'Following Users', 'Followed Users'],
    Videos: ['Video URL', 'Upload Date'],
    Vote: ['Username', 'EntryID', 'Upvote or DownVote']
};

// Generate Insert form
function generateForm(option) {

    // Clear previous form
    const formContainer = document.getElementById('InsertRow');
    formContainer.innerHTML = '';

    // Create a form element
    const features = featuresMap[option] || [];
    const form = document.createElement('form');
    form.id = 'dynamicForm';

    features.forEach(feature => {
        // Create a label and input for each feature
        const label = document.createElement('label');
        label.textContent = feature;
        label.setAttribute('for', feature);

        const input = document.createElement('input');
        input.type = 'text';
        input.id = feature;
        input.name = feature;

        const div = document.createElement('div');
        div.appendChild(label);
        div.appendChild(input);

        form.appendChild(div);
    });
    // Add a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Submit';
    form.appendChild(submitButton);
    formContainer.appendChild(form);

    // Add event listener to handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect all the input values
        const formData = {};
        features.forEach(feature => {
            const input = document.getElementById(feature);
            if (input) {
                formData[feature] = input.value;
            }
        });

        // Print the form data to the console
        console.log(formData);
    });
}

// Populate both dropdowns on page load
populateDropdown(dropdownButton, dropdownMenu, options, selectedOptions, selectedOptionsDisplay, true);
populateDropdown(insertDropdownButton, insertDropdownMenu, options,
    insertSelectedOption, insertSelectedOptionsDisplay, false);



// TODO: RESET button seems to be buggy
// This function resets the database
async function resetDatabase() {
    const response = await fetch("/initiate-table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "Database reset successfully!";
        fetchTableData();
    } else {
        alert("Error restarting table!");
    }
}

/* DEMO/TEMPLATE CODE */


// EXAMPLE WILL DELETE LATER
// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetDatabaseResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableDataDemo();
    } else {
        alert("Error initiating table!");
    }
}

//EXAMPLE WILL DELETE LATER
// Fetches data from the demotable and displays it.
async function fetchAndDisplayUsersDemo() {
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


// EXAMPLE
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

// EXAMPLE
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
        fetchTableDataDemo();
    } else {
        messageElement.textContent = "Error updating name!";
    }
}

// EXAMPLE
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

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    initializeAndInsertTables();
    checkDbConnection();
    fetchTableDataDemo();
    fetchTableData();
    document.getElementById("selectButton").addEventListener("click", fetchTableData);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("resetDatabase").addEventListener("click", resetDatabase);
    document.getElementById("initTable").addEventListener("click", initializeAndInsertTables);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);

};

// EXAMPLE FOR FETCHING DEMOTABLE
// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableDataDemo() {
    fetchAndDisplayUsersDemo();
}

//Currently in use
// Used to fetch and display table data.
function fetchTableData() {
    fetchAndDisplayUsers();
}

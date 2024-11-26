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
            const response = await fetch(sql, { 
                method: 'GET' 
            });
            const responseData = await response.json();

            if (responseData && responseData.data) {
                const metaData = responseData.data.metaData;
                const rows = responseData.data.rows;
                content.push({ metaData, rows, tableTitle: option });
            }
        } catch (err) {
            console.error('Error fetching table data:', err);
        }
    }

    // After clearing, create new tables with the data fetched
    content.forEach(data => {
        const { metaData, rows, tableTitle } = data;

        // Create the table using your createTable function
        createTable(metaData, rows, tableTitle);
    });
}


// Function to dynamically create a table for a given table name and its data
function createTable(metaData, tableData, tableTitle) {
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
            th.innerText = item.name; // Use 'name' property from metaData for column name
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
    } else {
        // If no metaData, add a header row indicating no data
        const th = document.createElement('th');
        th.colSpan = 100;  // Span across all columns
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
        td.colSpan = metaData.length;  // Span across all columns
        td.innerText = 'No Data Available';
        tr.appendChild(td);
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);

    // Add the table to the container
    tablesContainer.appendChild(table);
}

//Inserts new User into Users table
async function insertUser(event){
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const displayName = document.getElementById('displayName').value;
    const dateJoined = new Date();//gives date of now
    
    //For Debugging
    // console.log(JSON.stringify({
    //      username: username,
    //         email: email,  
    //         dateJoined: dateJoined,
    //         name: displayName
    // }));

    const response = await fetch('/insert-user',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: email,  
            dateJoined: dateJoined,
            name: displayName
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertUserMsg');

    if (responseData.success) {
        messageElement.textContent = "Account Created successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error Creating Account!";
    }
}

//Inserts new Post
async function insertPost(event){
    event.preventDefault();

    const user = document.getElementById('user').value;
    const community = document.getElementById('community').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const date = new Date();

    const response = await fetch('/insert-post', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user:user,
            title:title,
            community:community,
            content:content,
            date:date
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('insertPostMsg');

    if (responseData.success) {
        messageElement.textContent = "Posted!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error Posting!";
    }
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
    initializeAndInsertTables();
    checkDbConnection();
    fetchTableData();
    fetchTableData2();
    document.getElementById("selectButton").addEventListener("click", fetchTableData2);
    document.getElementById("resetDemotable").addEventListener("click", resetDemotable);
    document.getElementById("initTable").addEventListener("click", initializeAndInsertTables);
    document.getElementById("insertUser").addEventListener("submit", insertUser);
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("countDemotable").addEventListener("click", countDemotable);
    document.getElementById("insertPost").addEventListener("submit",insertPost);
};

// General function to refresh the displayed table data. 
// You can invoke this after any table-modifying operation to keep consistency.
function fetchTableData() {
    fetchAndDisplayUsers();
}

function fetchTableData2() {
    fetchAndDisplayUsers2();
}















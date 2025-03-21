/* Project Code*/

// checks the connection to database
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
// Initializes database and inserts starting values
async function initializeAndInsertTables() {
    await initializeTables();
    //await insertTables();
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

// Fetches data from the table and displays it.
async function fetchAndDisplayUsers() {
    const content = [];

    // Clear the entire container before new fetching process
    clearTable('showTablesContainer');

    // Continue with fetching and displaying the data
    for (const option of selectedOptions) {
        let sql = `/table/${option}`;

        try {
            const response = await fetch(sql, { 
                method: 'GET' 
            });
            const responseData = await response.json();

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
        createTable(metaData, rows, tableTitle, 'showTablesContainer');
    });
}

// Function to dynamically create a table for a given table name and its data
function createTable(metaData, tableData, tableTitle, tableID) {
    const tablesContainer = document.getElementById(tableID);

    // HTML FORMATTING
    // Create a header for the table
    const tableHeader = document.createElement('h3');
    tableHeader.innerText = tableTitle;
    tablesContainer.appendChild(tableHeader);

    // Create the table element
    const table = document.createElement('table');
    table.setAttribute('border', '1');

    // Create the table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // FORMATTING TABLE HEADERS
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

    // INPUTTING DATA INTO TABLE
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

// --------------------------------------------------------------------------------
// MAKING DROPDOWN
// --------------------------------------------------------------------------------
const options = [
    'Award', 'Chatroom', 'CommentOn', 'Communities', 'EntryCreatedBy',
    'Follows', 'GivenToBy', 'Images', 'JoinsChatRoom', 'JoinsCommunity',
    'MessagesSentByIn', 'PostIn', 'Users', 'Videos', 'Vote'
];

// Dropdown for viewing table
const dropdownButton = document.getElementById('dropdownButton');
const dropdownMenu = document.getElementById('dropdownMenu');
const selectedOptionsDisplay = document.getElementById('selectedOptions');
let selectedOptions = [];

// Dropdown for projection
const projectDropdownButton = document.getElementById('projectDropdownButton');
const projectDropdownMenu = document.getElementById('projectDropdownMenu');
const projectSelectedOptionsDisplay = document.getElementById('projectSelectedOptions');
let projectSelectedOption = [];

// Configure Dropdown list
function configureDropdown(li, optionText, selectedArray, multiSelect) {
    // for multiSelect dropdown list
    if (multiSelect) {
        li.classList.toggle('selected');
        if (li.classList.contains('selected')) {
            selectedArray.push(optionText);
        } else {
            const index = selectedArray.indexOf(optionText);
            if (index > -1) {
                selectedArray.splice(index, 1);
            }
        }
    } else {
        // for single Select dropdown list
        const previouslySelected = document.querySelectorAll('.selected');
        previouslySelected.forEach(item => item.classList.remove('selected'));
        li.classList.toggle('selected');

        if (li.classList.contains('selected')) {
            selectedArray.length = 0;
            selectedArray.push(optionText);
        } else {
            const index = selectedArray.indexOf(optionText);
            if (index > -1) {
                selectedArray.splice(index, 1);
            }
        }
    }
}

// Configure dropdown menu
function configureListActions(sqlAction, li, optionText, selectedArray, multiSelect) {
    let formContainer;
    switch (sqlAction) {
        case 'show':
            // Multi select dropdown
            configureDropdown(li, optionText, selectedArray, multiSelect);
            // Fetch updated tables
            fetchTableData();
            break;
        case 'project':
            // multi-select dropdown
            configureDropdown(li, optionText, selectedArray, multiSelect);

            // Clear previous form
            formContainer = document.getElementById("projectRow");
            formContainer.innerHTML = '';

            for (let table of selectedArray) {
                generateProjectionForm(table, "projectRow", 'project');
            }

            break;

        default:
            console.error(`Unhandled sqlAction: ${sqlAction}`);
    }
}

const projectMsg = document.getElementById('projectMsg');
function generateProjectionForm(option, tableName, sqlCommand) {
    const formContainer = document.getElementById(tableName);
    let submitButton = formContainer.querySelector('.submit-button');

    if (!submitButton) {
        submitButton = makeSubmitButton(tableName);
    }

    // Add a header to the form
    const header = document.createElement('h2');
    header.textContent = `${option}`;
    formContainer.appendChild(header);

    // Create a form element
    const features = featuresMap[option] || [];
    const form = document.createElement('form');
    form.id = `${tableName}Form`;

    features.forEach(feature => {
        // Create a label and input for each feature
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = feature;
        input.name = feature;

        const label = document.createElement('label');
        label.textContent = feature;
        label.setAttribute('for', feature);

        const div = document.createElement('div');
        div.appendChild(input);
        div.appendChild(label);

        form.appendChild(div);
    });

    formContainer.appendChild(form);
    //configure submit button
    switch (sqlCommand) {
        case 'project':
            submitButton.addEventListener('click', async function (event) {
                await performProjection(form, option);
            });
    }
}

// Gathers data in the form, performs projection, and updates html
async function performProjection(form, option) {
    clearTable("projectionTablesContainer");

    // Collect form data into an array
    const formData = [];
    const formElements = form.elements;

    for (let element of formElements) {
        if (element.type == 'checkbox' && element.checked) {
            formData.push({
                name: element.name,
                value: true
            });
        }
    }

    // Generate the query object
    const query = generateProjectQuery(option, formData);

    // Make the request to the server with query
    try {
        const response = await fetch(`/send/${query}`, { method: 'GET' });
        const { data } = await response.json();
        const filteredData = formData.filter(item => item.value !== null);
        filteredData.sort((a, b) => Number(a.value) - Number(b.value));
        const formDataWithoutValue = filteredData.map(({ value, ...rest }) => rest);
        console.log("FORMDATAWITHOUTVALUE: ", formDataWithoutValue);

        // update HTML
        createTable(formDataWithoutValue, data, option, "projectionTablesContainer");
        projectMsg.textContent = "Filter successful!";
    } catch (err) {
        console.error('Error fetching data:', err);
        projectMsg.textContent = "Error fetching data";
    }

}

// Generates query for projection
function generateProjectQuery(tableName, formData) {
    // Filter out items with null values
    const filteredData = formData.filter(item => item.value !== null);

    // Sort the filtered data
    filteredData.sort((a, b) => Number(a.value) - Number(b.value));

    // Build the SQL SELECT query for projection
    const columns = filteredData.map(item => item.name);
    const query = `SELECT ${columns.join(', ')} FROM ${tableName}`;

    console.log(query);

    return query;
}

// Populate the dropdown
function populateDropdown(sqlAction, button, menu, optionsArray, selectedArray, displayElement, multiSelect = true) {
    optionsArray.forEach(optionText => {
        const li = document.createElement('li');
        li.textContent = optionText;
        li.addEventListener('click', () => {
            configureListActions(sqlAction, li, optionText, selectedArray, multiSelect);
            menu.style.display = 'none';
        });

        menu.appendChild(li);
    });

    // Toggle dropdown visibility on button click
    button.addEventListener('click', () => {
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
}

// Populate both dropdowns on page load
populateDropdown('show', dropdownButton, dropdownMenu, options,
    selectedOptions, selectedOptionsDisplay, true);
populateDropdown('project', projectDropdownButton, projectDropdownMenu, options,
    projectSelectedOption, projectSelectedOptionsDisplay, true);

// --------------------------------------------------------------------------------
// END OF DROPDOWN
// --------------------------------------------------------------------------------

// Make forms for inserting tables and their features
const featuresMap = {
    Award: ['AwardType', 'value'],
    Chatroom: ['ChatroomID', 'Name'],
    CommentOn: ['EntryID', 'OnEntryID'],
    Communities: ['CommunityName', 'Rule', 'Description'],
    EntryCreatedBy: ['EntryID', 'DateCreated', 'Content', 'Username'],
    Follows: ['FollowingUsername', 'FollowedUsername'],
    GivenToBy: ['awardType', 'username', 'entryID'],
    Images: ['ImageURL', 'UploadDate'],
    JoinsChatRoom: ['ChatroomID', 'Username'],
    JoinsCommunity: ['Username', 'CommunityName'],
    MessagesSentByIn: ['MessageID', 'DateSent', 'Content', 'Username', 'ChatroomID'],
    PostIn: ['EntryID', 'Title', 'CommunityName'],
    Users: ['Username', 'Email', 'DateJoined', 'DisplayName'],
    UsersAge: ['dateJoined', 'age'],
    Videos: ['VideoURL', 'UploadDate'],
    Vote: ['Username', 'EntryID', 'UpvoteOrDownVote'],
    ImageContainedBy: ['AttachmentID', 'imageFile', 'entryID', 'messageID'],
    VideoContainedBy: ['AttachmentID', 'videoFile', 'entryID', 'messageID']
};

// Makes a submit button
function makeSubmitButton(tableName) {
    const formContainer = document.getElementById(tableName);
    let submitButton= document.createElement('button');
    submitButton.type = 'button';
    submitButton.classList.add('submit-button');
    submitButton.textContent = 'Submit';
    formContainer.appendChild(submitButton);

    return submitButton;
}

// Generate Insert form
function generateForm(option, tableName, sqlCommand) {
    const formContainer = document.getElementById(tableName);
    let submitButton = formContainer.querySelector('.submit-button');

    if (!submitButton) {
        submitButton = makeSubmitButton(tableName);
    }

    // Add a header to the form
    const header = document.createElement('h2');
    header.textContent = `${option}`;
    formContainer.appendChild(header);

    // Create a form element
    const features = featuresMap[option] || [];
    const form = document.createElement('form');
    form.id = `${tableName}Form`;

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

    formContainer.appendChild(form);
    //configure submit button
    switch (sqlCommand) {
        case 'project':
            submitButton.addEventListener('click', async function (event) {
                await performProjection(form, option);
            });
    }

}


const joinResultMsg=document.getElementById('joinResultMsg');
// Makes a query for join and sends it to oracle
async function performJoin() {
    clearTable("joinTablesContainer");
    const selectedAttributes = getSelectedAttributes();
    const metadata = selectedAttributes.split(', ').map(attribute => ({ name: attribute }));

    const query = generateJoinQuery(selectedAttributes);
    if (query == null) {
        document.getElementById('joinResult').value = 'Please select at least one attribute.';
    } else {
        document.getElementById('joinResult').value = query;
    }

    try {
        const response = await fetch(`/send/${query}`, { method: 'GET' });
        const { data } = await response.json();

        createTable(metadata, data,"Entries and User Combined Table",'joinTablesContainer');
        if (metadata.length > 0)
            joinResultMsg.textContent='Join performed!';
    } catch (err) {
        console.error('Error fetching data:', err);
    }
}

// puts all the selected options into a list for join
function getSelectedAttributes() {
    // Select checkboxes based on table source
    const userAttributes = Array.from(document.querySelectorAll('input[name="attributes"]:checked'))
        .filter(input => input.value.startsWith('Users'))
        .map(input => input.value);

    const entryAttributes = Array.from(document.querySelectorAll('input[name="attributes"]:checked'))
        .filter(input => input.value.startsWith('EntryCreatedBy'))
        .map(input => input.value);

    // Combine attributes into a single string
    const selectedAttributes = [...userAttributes, ...entryAttributes].join(', ');
    return selectedAttributes;
}

// Makes submit button for Join
document.getElementById('joinForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    await performJoin();
});



// Generates query for join
function generateJoinQuery(selectedAttributes) {
    // Check if no attributes were selected
    if (!selectedAttributes) {
        return null;
    }

    const selectedUsername = document.getElementById("usernameInput").value;
    let query;
    // Construct the SQL query
    if (selectedUsername) {
        query = `
        SELECT ${selectedAttributes}
        FROM Users
        JOIN EntryCreatedBy
        ON Users.username = EntryCreatedBy.username
        WHERE Users.username = '${selectedUsername}'
    `.trim();
    } else {
        query = `
        SELECT ${selectedAttributes}
        FROM Users
        JOIN EntryCreatedBy
        ON Users.username = EntryCreatedBy.username
    `.trim();
    }
    return query;
}

// This function resets the database
async function resetDatabase() {
    const response = await fetch("/initiate_create_table", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetDatabaseResultMsg');
        messageElement.textContent = "Database reset successfully!";
        fetchTableData();
        console.log("Reset Successful");
    } else {
        alert("Error restarting table!");
    }
}

// Clears all data in table
function clearTable(tableID) {
    const tablesContainer = document.getElementById(tableID);
    if (tablesContainer) {
        tablesContainer.innerHTML = '';
    } else {
        console.error("Tables container not found");
    }
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
        messageElement.textContent = "Error Creating Account! Username or email taken";
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
        messageElement.textContent = "Error Posting! Make sure username or community exists";
    } 
}


// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    //initializeAndInsertTables();
    checkDbConnection();
    fetchTableData();
    document.getElementById("resetDatabaseButton").addEventListener("click", resetDatabase);
    document.getElementById("initTable").addEventListener("click", initializeAndInsertTables);
    document.getElementById("insertUser").addEventListener("submit", insertUser);
    document.getElementById("insertPost").addEventListener("submit",insertPost);
};

//Currently in use
// Used to fetch and display table data.
function fetchTableData() {
    fetchAndDisplayUsers();
}















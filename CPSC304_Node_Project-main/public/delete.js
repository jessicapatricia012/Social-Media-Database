
const selectButton = document.getElementById('selectAccount');
const deleteButton = document.getElementById('deleteButton');
selectButton.addEventListener('click',toggleTable);
deleteButton.addEventListener('click',deleteSelected);


//Display Users from Database
async function displayUsers(){
    const deleteUserTable = document.getElementById('deleteUserTable');
    const tableBody = deleteUserTable.querySelector('tbody');

    const response = await fetch ('/table/Users', {
        method: 'GET',
    });

    const responseData = await response.json();
    console.log(responseData);

    const tableData = responseData.data.rows;
    console.log(tableData);

    tableBody.innerHTML = '';//empty table

    tableData.forEach(user => {
        const row = tableBody.insertRow();
        const cell = row.insertCell();
        cell.textContent = user[0];
        row.addEventListener('click', selectRow);
    });
}

function selectRow(event){
    const table = document.getElementById('deleteUserTable');
    table.querySelectorAll('td').forEach(cell => {cell.classList.remove('selectedDelete')});

    const selectedRow = event.target;
    console.log (selectedRow);
    selectedRow.classList.add('selectedDelete');
}

async function deleteSelected(){
    const deleteUserTable = document.getElementById("deleteUserTable");
    const cells = deleteUserTable.querySelectorAll("td");
    console.log(cells);
    
    let username;
    cells.forEach(cell =>{//Find selected row
        if (cell.classList.contains("selectedDelete")){
            username = cell.textContent;
        }
    })

    console.log(username);

    const response = await fetch ("/delete-user",{
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            username:username
        })
    });

    const responseData = await response.json();
    const deleteUserMsg = document.getElementById("deleteUserMsg");

    if (responseData.success){
        deleteUserMsg.textContent = "Delete Succesful!"
        displayUsers();//Updates the table
    } else{
        deleteUserMsg.textContent = "Delete Failed!";
    }
}

function toggleTable(){
    const deleteUserTable = document.getElementById("deleteUserTable");
    const showTableButton = document.getElementById("selectAccount");
    deleteUserTable.classList.toggle("hide-table");

    if (deleteUserTable.classList.contains("hide-table")){
        showTableButton.textContent = "Show Table";
    } else{
        showTableButton.textContent = "Hide Table";
    }
}

displayUsers();
//This js file contains code for showing number of posts per user feature

//Get HTML elements 
const showTableButton = document.getElementById('showNumPost');
const refreshButton = document.getElementById("refresh");
const numPostTable = document.getElementById("numPostTable");
const refreshMsg = document.getElementById('refreshMsg');

showTableButton.addEventListener('click', toggleTable);
refreshButton.addEventListener("click",displayNumPost);


//Function to show/hide table on click of showNumPost
function toggleTable(){
    numPostTable.classList.toggle("hide-table");
    
    if (numPostTable.classList.contains("hide-table")){
        showTableButton.textContent = "Show Table";
        
    } else{
        showTableButton.textContent = "Hide Table";
    }
}

//fetches number of posts per user from the database
async function displayNumPost(){
    const tableBody = numPostTable.querySelector('tbody');

    const response = await fetch ('/num-post', {
        method: 'GET',
    });

    const responseData = await response.json();
    console.log(responseData);

    const tableData = responseData.data;
    console.log(tableData);

    tableBody.innerHTML = '';//empty table

    //Populates the table
    tableData.forEach(user => {
        const row = tableBody.insertRow();

        user.forEach((field, index) => {
            const cell = row.insertCell();
            cell.textContent = field;
        })
    });
    refreshMsg.textContent="Search successful!";
}

displayNumPost(); //Displays once onload

    
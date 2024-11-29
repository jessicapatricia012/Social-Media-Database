//This file contains code for implementing the Most Popular community (Nested aggregrate with group by)

//Grab HTML elements
const refreshPopButton = document.getElementById("mostPopRefresh");
const mostPopTable = document.getElementById("mostPopTable");

//Register eveny listeners
refreshPopButton.addEventListener("click",displayCommunity);


async function displayCommunity(){
    const tableBody = mostPopTable.querySelector('tbody');

    const response = await fetch ('/most-pop', {
        method: 'GET',
    });

    const responseData = await response.json();
    console.log(responseData);

    const tableData = responseData.data;
    console.log(tableData);

    tableBody.innerHTML = '';//empty table 

    //Populates the table
    tableData.forEach(community => {
        const row = tableBody.insertRow();

        community.forEach((field, index) => {
            const cell = row.insertCell();
            cell.textContent = field;
        })
    });
}

displayCommunity(); //call once onload
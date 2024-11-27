const divisionShowBtn = document.getElementById('divisionShowBtn');
const divisionTable = document.getElementById('divisionTable');
const divisionHideBtn = document.getElementById('divisionHideBtn');
const divisionRefreshBtn = document.getElementById('divisionRefreshBtn');
const divisionResultMsg = document.getElementById('divisionResultMsg');


async function divisionShowUser() {

    const response = await fetch("/division", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();

    if (responseData.success) {
        divisionResultMsg.textContent = "";
        displayTuplesForDivision(responseData);
    } else {
        divisionResultMsg.textContent = "Fail showing users!";
    }
    
}

async function displayTuplesForDivision(responseData) {

    const tableBody = divisionTable.querySelector('tbody');

    // clear old data
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    console.log(responseData.data);

    if( responseData.data.length == 0) {
        divisionResultMsg.textContent= "No users found!"
        return;
    }

    responseData.data.forEach(tuple => {
        const row = tableBody.insertRow();

        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });

        
    });

    divisionTable.style.display='block';
    divisionShowBtn.style.display='none';
    divisionHideBtn.style.display='block';
    divisionRefreshBtn.style.display='block';
    
}

async function HideDivisionTable() {
    divisionTable.style.display='none';
    divisionShowBtn.style.display='block';
    divisionRefreshBtn.style.display='none';
    divisionHideBtn.style.display='none';
}
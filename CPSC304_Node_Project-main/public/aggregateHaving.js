const aHShowTableBtn = document.getElementById('aHShowTableBtn');
const tableElement = document.getElementById('aggregateHavingTable');
const aHHideTableBtn = document.getElementById('aHHideTableBtn');
const aHRefreshTableBtn = document.getElementById('aHRefreshTableBtn');
const aggregateHavingResultMsg = document.getElementById('aggregateHavingResultMsg');


async function generateAgregateHavingTable() {

    const response = await fetch("/aggregate-having", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseData = await response.json();

    if (responseData.success) {
        aggregateHavingResultMsg.textContent = "";
        displayTuplesForAggregateHaving(responseData);
    } else {
        aggregateHavingResultMsg.textContent = "Fail showing users!";
    }

}

async function displayTuplesForAggregateHaving(responseData) {

    const tableBody = tableElement.querySelector('tbody');

    // clear old data
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    console.log(responseData.data);

    if( responseData.data.length == 0) {
        aggregateHavingResultMsg.textContent= "No tuples found!"
        return;
    }

    responseData.data.forEach(tuple => {
        const row = tableBody.insertRow();

        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
        // const usernameCell = row.insertCell(0);
        // const numAwardCell = row.insertCell(1);
        // usernameCell.textContent = tuple[0];
        // numAwardCell.textContent = tuple[1];
        
    });

    tableElement.style.display='block';
    aHShowTableBtn.style.display='none';
    aHHideTableBtn.style.display='block';
    aHRefreshTableBtn.style.display='block';
    
}

async function HideAgregateHavingTable() {
    tableElement.style.display='none';
    aHShowTableBtn.style.display='block';
    aHRefreshTableBtn.style.display='none';
    aHHideTableBtn.style.display='none';
}


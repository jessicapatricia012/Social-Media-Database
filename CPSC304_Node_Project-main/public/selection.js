let numClause = 0; 
const clausesContainer= document.getElementById('clausesContainer');
const selectionTable = document.getElementById('selectionTable');
const selectionResultMsg = document.getElementById('selectionResultMsg');
const selectionSearchBtn = document.getElementById('selectionSearchBtn');
const clearClauseButton = document.getElementById('clearClauseButton');


async function clearClause() {
    const allClauses = document.querySelectorAll('.clause');
    
    allClauses.forEach(clause => {
        clause.remove();
    });
    numClause=0;
    selectionSearchBtn.style.display = 'none';
    clearClauseButton.style.display='none';
    selectionTable.style.display='none';
    selectionResultMsg.style.display='none';
}

async function addClause() {
    selectionSearchBtn.style.display='block';
    numClause++;

    // Create a div for the new clause
    const clauseDiv = document.createElement('div');
    clauseDiv.className = 'clause';

    // Logical Operator Dropdown (AND/OR)
    if (numClause > 1) {
    const andOrDropdown = document.createElement('select');
    andOrDropdown.name = 'andOrDropdown';
    andOrDropdown.innerHTML = 
    `<option value="AND"> AND </option>
    <option value="OR"> OR </option>`;
    clauseDiv.appendChild(andOrDropdown);
    } else
        clearClauseButton.style.display='block';


    const attributeDropdown = document.createElement('select');
    attributeDropdown.name = 'attribute';
    attributeDropdown.innerHTML = 
    `<option value="awardType"> award type </option>
    <option value="value"> value </option>`;
    clauseDiv.appendChild(attributeDropdown);

    const equalSign = document.createElement('span');
    equalSign.textContent= "=";
    clauseDiv.appendChild(equalSign);

    const textInput = document.createElement('input');
    textInput.name = 'textInput';
    textInput.type = 'text';
    textInput.placeholder = 'enter award name';
    textInput.required = true;

    attributeDropdown.addEventListener('change', function() {
        if (attributeDropdown.value === "awardType") {
            textInput.type = 'text';
            textInput.placeholder = 'Enter award name';
        } else if (attributeDropdown.value == "value"){
            textInput.type = 'number';
            textInput.placeholder = 'enter award value';
            textInput.value = 0;
        }
    });
    clauseDiv.appendChild(textInput);

    clausesContainer.appendChild(clauseDiv);
}


async function searchAward(event) {
    event.preventDefault();
    const clauses = [];
    const clauseDivs = clausesContainer.querySelectorAll('.clause');

    clauseDivs.forEach(clauseDiv => {
        const attributeDropdown = clauseDiv.querySelector('select[name="attribute"]');
        const textInput = clauseDiv.querySelector('input[name="textInput"]');
        const andOrDropdown = clauseDiv.querySelector('select[name="andOrDropdown"]');    

        clauses.push({
            attribute: attributeDropdown.value,
            value: textInput.value,
            operator: andOrDropdown ? andOrDropdown.value : null //first clause doesnt have and/or
        });
    });
    console.log(clauses);

    // Call the function to query the database with collected clauses
    const response = await fetch("/select-award", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            clauses: clauses
        })
    });

    const responseData = await response.json();
    console.log(responseData);
    console.log(responseData.data);
    console.log(responseData.data.rows);
    selectionResultMsg.style.display='block';
    if (responseData.success) {
        // console.log("response success selection.js")
        selectionResultMsg.textContent= "";
        showAwardTableForSelection(responseData);
    } else {
        // console.log("response fail selection.js")
        selectionResultMsg.textContent= "Search fail!";
    }
}

async function showAwardTableForSelection(responseData) {
    const tableBody = selectionTable.querySelector('tbody');

    // clear old data
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    

    if( responseData.data.length == 0) {
        selectionResultMsg.textContent= "No matching awards found!"
        selectionTable.style.display='none';
        return;
    }

    responseData.data.forEach(tuple => {
        const row = tableBody.insertRow();

        tuple.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });

        
    });

    selectionResultMsg.textContent= "Search successful!";
    selectionTable.style.display='block';
    // divisionShowBtn.style.display='none';
    // divisionHideBtn.style.display='block';
    // divisionRefreshBtn.style.display='block';
    
}

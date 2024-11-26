let numClause = 0; 
let clausesContainer= document.getElementById('clausesContainer');

async function addClause() {
    numClause++;

    // Create a div for the new clause
    const clauseDiv = document.createElement('div');
    clauseDiv.className = 'clause';

    // Logical Operator Dropdown (AND/OR)
    if (numClause > 1) {
    const andOrDropdown = document.createElement('select');
    andOrDropdown.name = 'andOrDropdown';
    andOrDropdown.innerHTML = `
    <option value="AND"> AND </option>
    <option value="OR"> OR </option>
    `;
    clauseDiv.appendChild(andOrDropdown);
    }


    // Attribute Dropdown
    const attributeDropdown = document.createElement('select');
    attributeDropdown.name = 'attribute';
    attributeDropdown.innerHTML = `
    <option value="awardName"> award name </option>
    <option value="value"> value </option>

    `;
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
        if (attributeDropdown.value === "awardName") {
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

    if (responseData.success) {
        console.log("response success selection.js")
    } else {
        console.log("response fail selection.js")
    }
}
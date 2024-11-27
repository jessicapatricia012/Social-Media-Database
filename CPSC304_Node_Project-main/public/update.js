async function updateUser(event) {
    console.log("clicked");
    event.preventDefault();

    const username =  document.getElementById('updateUsername').textContent;
    const updateEmail = document.getElementById('updateEmail').value;
    const updateDisplayName = document.getElementById('updateDisplayName').value;
    const updateDateJoined = document.getElementById('updateDateJoined').value;

    const response = await fetch("/update-user", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            email: updateEmail,
            displayName: updateDisplayName,
            dateJoined: updateDateJoined
        })
    });

    const responseData = await response.json();
    const updateNameResultMsg = document.getElementById('updateNameResultMsg');

    if (responseData.success) {
        updateNameResultMsg.textContent = "User updated successfully!";
        displayTuplesForUpdate();
    } else {
        updateNameResultMsg.textContent = responseData.message;
    }
}

async function displayTuplesForUpdate() {
    let content=[];
    const updateTuplesTable = document.getElementById('updateTuplesTable');
    const tableBody = updateTuplesTable.querySelector('tbody');

    const response = await fetch('/table/Users', {
        method: 'GET'
    });

    const responseData = await response.json();
    console.log('fetched:', responseData);
    content = responseData.data.rows;

    // clear old data
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    content.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });

        row.addEventListener('click', () => handleRowSelectionForUpdate(user));
    });
}

async function handleRowSelectionForUpdate(user) {
    console.log("date:", user[2]);
    document.getElementById('selectARowMsg').textContent  ="Update attributes of user with username: ";
    document.getElementById('updateUsername').textContent = user[0];
    document.getElementById('updateEmail').value = user[1];  
    document.getElementById('updateDisplayName').value = user[2]; 
    document.getElementById('updateDateJoined').value = new Date(user[3]).toISOString().split('T')[0]; 
    document.getElementById('updateDemotable').style.display = 'block'; 
}


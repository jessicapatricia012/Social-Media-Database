const updateNameResultMsg = document.getElementById('updateNameResultMsg');
const selectARowMsg = document.getElementById('selectARowMsg');
const updateShowBtn = document.getElementById('updateShowBtn');
const updateTuplesTable = document.getElementById('updateTuplesTable');
const updateHideBtn = document.getElementById('updateHideBtn');
const updateRefreshBtn = document.getElementById('updateRefreshBtn');
const updateForm = document.getElementById('updateForm');

async function updateUser(event) {
    console.log("clicked");
    event.preventDefault();

    const username =  document.getElementById('updateUsername').value;
    const updateEmail = document.getElementById('updateEmail').value;
    const updateDisplayName = document.getElementById('updateDisplayName').value;
    const updateDateJoined = document.getElementById('updateDateJoined').value;

    try {
        const response = await fetch("/update-user", {  //error
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

        if (responseData.success) {
            updateNameResultMsg.textContent = "User updated successfully!";
            displayTuplesForUpdate();
        } else {
            updateNameResultMsg.textContent = responseData.message;
        }
    } catch (error) {
        alert("An error has occured");
    }
}

async function displayTuplesForUpdate() {
    let content=[];
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

    updateTuplesTable.style.display="block";
    selectARowMsg.style.display="block";
    updateShowBtn.style.display="none";
    updateHideBtn.style.display="block";
    updateRefreshBtn.style.display="block";
}

async function handleRowSelectionForUpdate(user) {
    console.log("date:", user[2]);
    document.getElementById('selectARowMsg').textContent  ="Update attributes of user with username: ";
    document.getElementById('updateUsername').value = user[0];
    document.getElementById('updateEmail').value = user[1];  
    document.getElementById('updateDisplayName').value = user[2]; 
    document.getElementById('updateDateJoined').value = new Date(user[3]).toISOString().split('T')[0]; 
    updateForm.style.display = 'block'; 
}

async function HideUpdateTable() {
    updateTuplesTable.style.display="none";
    selectARowMsg.style.display="none";
    updateShowBtn.style.display="block";
    updateHideBtn.style.display="none";
    updateRefreshBtn.style.display="none";
    updateForm.style.display="none";
    updateNameResultMsg.style.display="none";
}
async function updateNameDemotable(event) {
    event.preventDefault();

    const username = document.getElementById('updateUsernameField').value;
    const email = document.getElementById('updateEmailField').value;
    const displayName = document.getElementById('udateDisplayNameField').value;

    const response = await fetch('/update-name-demotable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            oldName: oldNameValue,
            newName: newNameValue
        })
    });

    const responseData = await response.json();
    const messageElement = document.getElementById('updateResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Update successfull!";
        fetchTableData()
    } else {
        messageElement.textContent = "Error updating!";
    }
}
document.addEventListener('DOMContentLoaded', () => {

    const closeButtons = document.querySelectorAll('.close-alert');
    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const alertModal = event.target.closest('.alert-modal');
            alertModal.style.display = 'none';

            if (alertModal.id === 'success-alert') {
                window.location.href = "../login-page/login.html";
            }
        });
    });
});

function showAlert(alertId) {
    document.getElementById(alertId).style.display = 'flex';
}

document.getElementById('signupForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert('password-alert');
        return;
    }

    const formData = new FormData(this);
    const formObject = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/api/hotels/admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formObject)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert('success-alert'); 
        } else if (result.error.includes('Account for this ID already created')) {
            showAlert('exists-alert');
        } else if(result.error.includes('Invalid Hotel ID')){
            showAlert('id-alert');
        } else {
            alert(result.error || 'An unknown error occurred. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const userTab = document.getElementById('user-tab');
    const adminTab = document.getElementById('admin-tab');
    const userForm = document.getElementById('user-form');
    const adminForm = document.getElementById('admin-form');
    const userError = document.getElementById('user-error');
    const adminError = document.getElementById('admin-error');

    function switchTab(activeTab, inactiveTab, activeForm, inactiveForm) {
        userTab.classList.remove('active-tab');
        userTab.classList.add('inactive-tab');
        adminTab.classList.remove('active-tab');
        adminTab.classList.add('inactive-tab');

        activeTab.classList.add('active-tab');
        activeTab.classList.remove('inactive-tab');

        activeForm.classList.add('active-form');
        inactiveForm.classList.remove('active-form');
    }

    userTab.addEventListener('click', () => switchTab(userTab, adminTab, userForm, adminForm));
    adminTab.addEventListener('click', () => switchTab(adminTab, userTab, adminForm, userForm));

    // Default active tab
    switchTab(userTab, adminTab, userForm, adminForm);

    window.validateUserLogin = async function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const userError = document.getElementById('user-error');
    
        if (email === "" || password === "") {
            userError.textContent = "Please fill all fields.";
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/users/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
    
            const result = await response.json();
    
            if (response.status === 200) {
                userError.textContent = "";
                window.location.href = `../welcome-page/welcome.html?email=${email}`; 
            } else {
                userError.textContent = result.error;
            }
        } catch (error) {
            userError.textContent = "An error occurred while logging in.";
        }
    };
    

    window.validateAdminLogin =  async function() {
        const hotel_id = document.getElementById('admin-id').value;
        const password = document.getElementById('admin-password').value;
        const userError = document.getElementById('admin-error');
    
        if (hotel_id === "" || password === "") {
            userError.textContent = "Please fill all fields.";
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/api/hotels/admin/login', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hotel_id, password })
            });
    
            const result = await response.json();
    
            if (response.status === 200) {
                userError.textContent = "";
                window.location.href = `../admin-update-page/adminupdate.html?id=${hotel_id}`; 
            } else {
                userError.textContent = result.error;
            }
        } catch (error) {
            userError.textContent = "An error occurred while logging in.";
        }
    };
});

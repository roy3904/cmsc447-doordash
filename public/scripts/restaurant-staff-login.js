document.querySelector('.login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorText = document.querySelector('.incorrect-login-text');

    // Hide previous error
    errorText.classList.add('hidden');

    try {
        const response = await fetch('/api/restaurant-staff/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        if (response.ok) {
            const data = await response.json();

            // Store staff information in localStorage
            localStorage.setItem('restaurant_staff', JSON.stringify(data.staff));

            // Redirect to dashboard
            window.location.href = "restaurant-staff-dashboard.html";
        } else {
            const data = await response.json();
            errorText.textContent = data.error || 'Login failed';
            errorText.classList.remove('hidden');
        }
    } catch (err) {
        console.error("Login request failed:", err);
        errorText.textContent = 'An error occurred. Please try again.';
        errorText.classList.remove('hidden');
    }
});

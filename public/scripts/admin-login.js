document.querySelector('.login-button').addEventListener('click', async () => {
    event.preventDefault(); 

    const email = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try{
        const response = await fetch('/api/login', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        });

        const text = await response.text();
        const status = await response.status;

        if(status === 200){//Correct credentials for testing: email = caseoh@umbc.edu password = ilovebeef1
            sessionStorage.setItem('logged_in', 'true');
            window.location.href = "admin.html";
        }
        else if(status === 401){
            document.querySelector('.incorrect-login-text').classList.remove('hidden');
            document.querySelector('.incorrect-login-text').innerHTML = text;
        }
        else if(status === 400){
            document.querySelector('.incorrect-login-text').classList.remove('hidden');
            document.querySelector('.incorrect-login-text').innerHTML = text;
        }
    } catch(err){
        console.error("REQUEST FAILED: ", err);
    }
});
document.querySelector('.login-button').addEventListener('click', async () => {
    event.preventDefault(); 
    
    console.log("button clicked on front end");

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
        console.log("server response: ", text);
        console.log("server status: ", status);

        if(status === 200){
            window.location.href = "admin.html";
        }
        else if(status === 401){
            document.querySelector('.incorrect-login-text').classList.remove('hidden');
        }
    } catch(err){
        console.error("REQUEST FAILED: ", err);
    }
});
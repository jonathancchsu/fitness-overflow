
window.addEventListener("DOMContentLoaded", (event) => {
    const loginForm = document.getElementById('login-form')
    const emailField = document.getElementById("email-in")
    const passwordField = document.getElementById('password-in')
    const demoButton = document.getElementById("demo-b")

    if (!demoButton) {
        return
    }

    demoButton.addEventListener('click', (e) => {
        e.preventDefault();
        emailField.value = "demo@demo.com"
        passwordField.value = "demoPassword1!"
        loginForm.submit();
    })

})

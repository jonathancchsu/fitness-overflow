
window.addEventListener('DOMContentLoaded', async () => {
    const currentTitle = document.querySelector('.question-title')
    const currentBody = document.querySelector('.question-body')
    const editButton = document.querySelector('.edit-button')
    const titleTextArea = document.querySelector('.hidden-title-ta')
    const bodyTextArea = document.querySelector('.hidden-body-ta')
    const hiddenForm = document.querySelector('.hidden-form')
    const cancelEditButton = document.querySelector('.cancel-edit-button')

    editButton.addEventListener('click', (e) => {
        e.preventDefault()
        titleTextArea.value = currentTitle.innerText
        bodyTextArea.value = currentBody.innerText
        hiddenForm.classList = ""
    })

    cancelEditButton.addEventListener('click', (e) => {
        e.preventDefault()
        hiddenForm.classList = "hidden-form"
    })

})

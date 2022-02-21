
window.addEventListener('DOMContentLoaded', async () => {
    const currentTitle = document.querySelector('.question-title')
    const currentBody = document.querySelector('.question-body')
    const editButton = document.querySelector('.edit-button')
    const deleteButton = document.querySelector('.delete-button')
    const titleTextArea = document.querySelector('.hidden-title-ta')
    const bodyTextArea = document.querySelector('.hidden-body-ta')
    const hiddenForm = document.querySelector('.hidden-form')
    const cancelEditButton = document.querySelector('.cancel-edit-button')

    const deleteAnswersForm = document.querySelector('.delete-answers-form')
    const deleteAnswerButton = document.querySelectorAll('.delete-answer-button')
    const cancelAnswerDelete = document.querySelectorAll('.cancel-button-2')
    const deleteButton2 = document.querySelector('.delete-button-2')


    if (editButton) {
        editButton.addEventListener('click', (e) => {
            e.preventDefault()
            titleTextArea.value = currentTitle.innerText
            bodyTextArea.value = currentBody.innerText
            hiddenForm.classList = ''
            editButton.classList = 'hidden-form'
            deleteButton.classList = 'hidden-form'
        })
    }

    cancelEditButton.addEventListener('click', (e) => {
        e.preventDefault()
        hiddenForm.classList = 'hidden-form'
        editButton.classList = 'edit-button'
        deleteButton.classList = 'delete-button'
    })

    for (let deleteButton of deleteAnswerButton) {
        deleteButton.addEventListener('click', (e) => {
            console.log(`this button works`)
            deleteAnswersForm.classList = ''
        })
    }

    for (let cancelButton of cancelAnswerDelete) {
        cancelButton.addEventListener('click', (e) => {
            deleteAnswersForm.classList = 'delete-answers-form'
        })
    }


})


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
    const deleteAnswerButton = document.querySelector('.delete-answer-button')
    const cancelAnswerDelete = document.querySelector('.cancel-button-2')
    const deleteButton2 = document.querySelector('.delete-button-2')



    editButton.addEventListener('click', (e) => {
        e.preventDefault()
        titleTextArea.value = currentTitle.innerText
        bodyTextArea.value = currentBody.innerText
        hiddenForm.classList = ''
        editButton.classList = 'hidden-form'
        deleteButton.classList = 'hidden-form'
    })

    cancelEditButton.addEventListener('click', (e) => {
        e.preventDefault()
        hiddenForm.classList = 'hidden-form'
        editButton.classList = 'edit-button'
        deleteButton.classList = 'delete-button'
    })

    deleteAnswerButton.addEventListener('click', (e) => {
        console.log(`this button works`)
        e.stopPropagation()
        deleteAnswersForm.classList = ''
    })

    cancelAnswerDelete.addEventListener('click', (e) => {
        deleteAnswersForm.classList = 'delete-answers-form'
    })

})

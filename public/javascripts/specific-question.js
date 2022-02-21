

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

    const currentAnswerBodys = document.querySelectorAll('[id^="cur-ta"]')
    const editAnswerButtons = document.querySelectorAll('[id^="edit"]')
    const answerBodyTextAreas = document.querySelectorAll('[id^="ta2"]')
    const hiddenAnswerForms = document.querySelectorAll('[id^="haf"]')
    const cancelAnswerEditButtons = document.querySelectorAll('[id^="cancel"]')
    const answerDeleteButtons = document.querySelectorAll('[id^="delete3"]')
    console.log(answerDeleteButtons)

    editAnswerButtons.forEach(editAnswerButton => {
        editAnswerButton.addEventListener('click', (e) => {

            const answerBodyText = document.getElementById(`cur-ta`)

            editAnswerButton.classList = 'hidden-answer-edit-form'

            const answerDeleteButton = document.getElementById(`delete3-${e.target.value}`)
            answerDeleteButton.classList = 'hidden-answer-edit-form'

            const hiddenAnswerForm = document.getElementById(`update-answer-field haf-${e.target.value}`)
            console.log(hiddenAnswerForm)
            hiddenAnswerForm.classList = ''

            const cancelAnswerEditButton = document.getElementById(`cancel-${e.target.value}`)
            cancelAnswerEditButton.addEventListener('click', (e) => {
                hiddenAnswerForm.classList = 'hidden-answer-edit-form'
                editAnswerButton.classList = 'edit-answer-button'
                answerDeleteButton.classList = 'delete-answer-button'
            });

            const answerBodyTextArea = document.getElementById(`ta2-${e.target.value}`)
            const currentAnswerBody = document.getElementById(`cur-ta-${e.target.value}`)
            currentAnswerBody.classList = 'hidden-answer-edit-form'
            answerBodyTextArea.value = currentAnswerBody.innerText
        })
    })





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


    const deleteButton3 = document.querySelectorAll('[id^="delete3"]')

    deleteButton3.forEach(deleteButton3one => {
        deleteButton3one.addEventListener('click', (e) => {
            const form = document.getElementById('haf-form')
            form.action = `/questions/answers/${e.target.value}/delete`
        })
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

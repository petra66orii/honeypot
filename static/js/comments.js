// Handle inline editing
document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form');
    const commentText = document.getElementById('id_content');
    const submitButton = document.getElementById('submit-btn');

    const editButtons = document.querySelectorAll('.edit-btn');
    const deleteButtons = document.querySelectorAll('.delete-btn');

    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    const deleteConfirm = document.getElementById("deleteConfirm");

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            let commentId = button.getAttribute('data-comment-id');
            let commentContent = document.getElementById(`comment-${commentId}`).innerText;
            commentText.value = commentContent; // Populate the form with the comment content
            submitButton.innerText = 'Update'; // Change button text
            commentForm.setAttribute("action", `edit_comment/${commentId}`); // Update form action
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            let commentId = e.target.getAttribute("data-comment-id");
            deleteConfirm.href = `delete_comment/${commentId}`;
            deleteModal.show();
        });
    });
});
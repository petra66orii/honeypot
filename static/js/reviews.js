// Handle inline editing
document.addEventListener('DOMContentLoaded', () => {
    const reviewForm = document.getElementById('review-form');
    const reviewText = document.getElementById('id_review_text');
    const submitButton = document.getElementById('submit-btn');

    const editButtons = document.querySelectorAll('.btn-warning');
    const deleteButtons = document.querySelectorAll('.btn-danger');

    const deleteModal = new bootstrap.Modal(document.getElementById("deleteModal"));
    const deleteConfirm = document.getElementById("deleteConfirm");

    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            let reviewId = button.getAttribute('data-review-id');
            let reviewContent = document.getElementById(`review-${reviewId}`).innerText;
            reviewText.value = reviewContent; // Populate the form with the review content
            submitButton.innerText = 'Update'; // Change button text
            reviewForm.action = `/edit_review/${reviewId}/`;
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            let reviewId = e.target.getAttribute("data-review-id");
            deleteConfirm.href = `/delete_review/${reviewId}/`;
            deleteModal.show();
        });
    });
});
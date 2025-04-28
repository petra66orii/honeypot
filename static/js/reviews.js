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
            let editUrl = button.getAttribute('data-edit-url');
    
            reviewText.value = reviewContent;
            submitButton.innerText = 'Update';
            reviewForm.setAttribute("action", editUrl);
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const deleteUrl = button.getAttribute("data-delete-url");
            console.log(deleteUrl);

            if (deleteUrl) {
                deleteConfirm.setAttribute('href', deleteUrl);
                deleteModal.show();
            } else {
                console.error("Delete URL is not set correctly.");
            }
        });
    });
});
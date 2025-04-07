document.addEventListener('DOMContentLoaded', function () {
    function fadeAndRemove(element) {
        element.classList.add('fade-out');
        setTimeout(() => {
            element.remove();
        }, 500);
    }

    document.addEventListener('click', function (event) {
        const alertBox = event.target.closest('.feedback-msg');

        // If the close button was clicked
        if (event.target.classList.contains('btn-close')) {
            if (alertBox) {
                fadeAndRemove(alertBox);
            }
            return;
        }

        // If click was outside any feedback message
        if (!alertBox) {
            document.querySelectorAll('.feedback-msg').forEach(alert => {
                fadeAndRemove(alert);
            });
        }
    });

    // Prevent dismiss when clicking inside the alert itself
    document.querySelectorAll('.feedback-msg').forEach(alert => {
        alert.addEventListener('click', event => {
            event.stopPropagation();
        });
    });
});

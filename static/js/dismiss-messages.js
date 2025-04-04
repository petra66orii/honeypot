document.addEventListener('DOMContentLoaded', function() {
    const messageElement = document.getElementById('msg');

    function fadeAndRemove(element) {
        element.classList.add('fade-out');
        setTimeout(() => {
            element.remove();
        }, 500);
    }

    document.addEventListener('click', function(event) {
        if (!messageElement) return;

        if (event.target.closest('.btn-close')) {
            if (messageElement) {
                fadeAndRemove(messageElement);
            }
            return;
        }

        if (!event.target.closest('.alert')) {
            fadeAndRemove(messageElement);
        }
    });

    if (messageElement) {
        messageElement.addEventListener('click', (event) => {
            event.stopPropagation();
        });
    }
});

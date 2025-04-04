document.addEventListener("DOMContentLoaded", function () {
    const bees = document.querySelectorAll(".rating-system i");
    let selectedRating = 0;

    bees.forEach((bee, index) => {
        bee.addEventListener("mouseenter", () => {
            highlightBees(index + 1, "hover");
        });

        bee.addEventListener("mouseleave", () => {
            highlightBees(selectedRating, "leave");
        });

        bee.addEventListener("click", () => {
            selectedRating = index + 1;
            document.getElementById("rating-input").value = selectedRating;
            highlightBees(selectedRating, "click");
        });
    });

    function highlightBees(count, type) {
        bees.forEach((bee, i) => {
            const img = bee.querySelector("img");
            const emptyIcon = bee.dataset.emptyIcon;
            const activeIcon = bee.dataset.activeIcon;
            const fullIcon = bee.dataset.fullIcon;
    
            if (i < count) {
                img.src = (type === "click" || i < selectedRating) ? fullIcon : activeIcon;
            } else {
                img.src = emptyIcon;
            }
        });
    }  
});

document.addEventListener("DOMContentLoaded", function () {
    const ratingInput = document.getElementById("rating-input");
    const bees = document.querySelectorAll(".rating-system i");
    let selectedRating = 0;

    bees.forEach((bee, index) => {
        bee.addEventListener("click", function () {
            ratingInput.value = index + 1;
        });
    });

    bees.forEach((bee, index) => {
        bee.addEventListener("mouseenter", () => {
            highlightBees(index + 1, "hover");
        });

        bee.addEventListener("mouseleave", () => {
            if (selectedRating === 0) {
                highlightBees(0, "leave");
            }
        });

        bee.addEventListener("click", () => {
            selectedRating = index + 1;
            ratingInput.value = selectedRating;
            highlightBees(selectedRating, "click");
        });
    });

    // Function to highlight bees based on the rating
    function highlightBees(count, type) {
        bees.forEach((bee, i) => {
            const img = bee.querySelector("img");
            if (i < count) {
                img.src = "/static/images/icons/active-bee.ico"; 
                if (type === "click") {
                    img.src = "/static/images/icons/full-bee.ico"; 
                }
            } else {
                img.src = "/static/images/icons/empty-bee.ico"; 
            }
        });
    }
});

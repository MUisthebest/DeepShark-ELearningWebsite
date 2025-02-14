document.addEventListener("DOMContentLoaded", function () {
    const items = document.querySelectorAll('.item');
    const showMoreButton = document.querySelector('.show-more');

    showMoreButton.addEventListener('click', function () {
        items.forEach((item, index) => {
            if (index >= 3) {
                item.style.display = 'block';
            }
        });
        showMoreButton.style.display = 'none';
    });
});
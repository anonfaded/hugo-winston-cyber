document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    const lightboxImg = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.lightbox-close');
    let isAnimating = false;

    // Handle all blog post images and title images
    const blogImages = document.querySelectorAll('.content p img, .intro img');

    function openLightbox(e) {
        if (isAnimating) return;
        isAnimating = true;
        
        const clickedImg = e.target;
        lightboxImg.src = clickedImg.src;
        document.body.style.overflow = 'hidden';
        lightbox.classList.add('active');
        
        setTimeout(() => {
            isAnimating = false;
        }, 400);
    }

    function closeLightbox() {
        if (isAnimating) return;
        isAnimating = true;
        
        lightbox.classList.remove('active');
        
        setTimeout(() => {
            document.body.style.overflow = '';
            lightboxImg.src = '';
            isAnimating = false;
        }, 400);
    }

    // Add click handlers to all images
    blogImages.forEach(img => {
        img.addEventListener('click', openLightbox);
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Handle clicks on lightbox background
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxContent) {
            closeLightbox();
        }
    });

    // Handle close button click
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
});

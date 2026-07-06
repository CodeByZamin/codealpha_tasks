// Get DOM elements
const imageGrid = document.getElementById('imageGrid');
const imageItems = document.querySelectorAll('.image-item');
const filterBtns = document.querySelectorAll('.filter-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const prevLightbox = document.getElementById('prevLightbox');
const nextLightbox = document.getElementById('nextLightbox');

// State variables
let currentIndex = 0;
let visibleImages = [];

// Update visible images based on filter
function updateVisibleImages() {
    visibleImages = Array.from(imageItems).filter(item => !item.classList.contains('hide'));
}

// Filter functionality
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        // Filter images
        imageItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.classList.remove('hide');
            } else {
                item.classList.add('hide');
            }
        });

        // Update visible images and reset index
        updateVisibleImages();
        currentIndex = 0;
    });
});

// Open lightbox
function openLightbox(index) {
    currentIndex = index;
    const img = visibleImages[currentIndex];
    const imgElement = img.querySelector('img');
    
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxCaption.textContent = imgElement.alt;
    
    lightbox.classList.add('show');
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('show');
}

// Next image in lightbox
function nextImage() {
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex + 1) % visibleImages.length;
    const img = visibleImages[currentIndex];
    const imgElement = img.querySelector('img');
    
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxCaption.textContent = imgElement.alt;
}

// Previous image in lightbox
function prevImage() {
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentIndex];
    const imgElement = img.querySelector('img');
    
    lightboxImg.src = imgElement.src;
    lightboxImg.alt = imgElement.alt;
    lightboxCaption.textContent = imgElement.alt;
}

// Add click event to all image items
imageItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        updateVisibleImages();
        const filteredIndex = visibleImages.indexOf(item);
        if (filteredIndex !== -1) {
            openLightbox(filteredIndex);
        }
    });
});

// Navigation button events
prevBtn.addEventListener('click', () => {
    updateVisibleImages();
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
    const img = visibleImages[currentIndex];
    const imgElement = img.querySelector('img');
    
    // Scroll to the image
    img.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

nextBtn.addEventListener('click', () => {
    updateVisibleImages();
    if (visibleImages.length === 0) return;
    
    currentIndex = (currentIndex + 1) % visibleImages.length;
    const img = visibleImages[currentIndex];
    const imgElement = img.querySelector('img');
    
    // Scroll to the image
    img.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

// Lightbox events
lightboxClose.addEventListener('click', closeLightbox);
prevLightbox.addEventListener('click', prevImage);
nextLightbox.addEventListener('click', nextImage);

// Close lightbox on background click
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    
    if (e.key === 'Escape') {
        closeLightbox();
    } else if (e.key === 'ArrowLeft') {
        prevImage();
    } else if (e.key === 'ArrowRight') {
        nextImage();
    }
});

// Initialize
updateVisibleImages();

// Add smooth transition for all images
imageItems.forEach(item => {
    item.style.transition = 'all 0.4s ease';
});
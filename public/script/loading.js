window.addEventListener('load', function() {
    const overlay = document.getElementById('loading-overlay');
    
    if (overlay) {
        // Minimal wait time 1s to show the animation properly
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 1000);
    }
});
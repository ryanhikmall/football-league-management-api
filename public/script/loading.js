window.addEventListener('load', function() {
    const overlay = document.getElementById('loading-overlay');
    
    if (overlay) {
        // Tunggu minimal 1 detik agar animasi terlihat (smooth UX)
        setTimeout(() => {
            overlay.classList.add('hidden');
            
            // Opsional: Hapus elemen dari DOM setelah transisi selesai (0.6s) untuk performa
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 600);
            
        }, 1000);
    }
});
// ===== QR CODE GENERATOR - Enhanced Version =====
// Made by ShifoSan

// ===== DOM ELEMENTS =====
const qrInput = document.getElementById('qrInput');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const qrResult = document.getElementById('qrResult');
const qrSizeSelect = document.getElementById('qrSize');
const qrColorInput = document.getElementById('qrColor');
const qrBgColorInput = document.getElementById('qrBgColor');
const qrCountDisplay = document.getElementById('qrCount');
const charCountDisplay = document.getElementById('charCount');

// ===== STATE MANAGEMENT =====
let qrCount = parseInt(localStorage.getItem('qrCount')) || 0;
let currentQRUrl = '';

// Initialize displays
qrCountDisplay.textContent = qrCount;

// ===== UTILITY FUNCTIONS =====

// Convert hex color to RGB format for API
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Format RGB for API (removes spaces and formats correctly)
function formatRgbForApi(rgb) {
    return `${rgb.r}-${rgb.g}-${rgb.b}`;
}

// Update character count in real-time
function updateCharCount() {
    const count = qrInput.value.length;
    charCountDisplay.textContent = count;
    
    // Add pulse animation on change
    charCountDisplay.style.transform = 'scale(1.2)';
    setTimeout(() => {
        charCountDisplay.style.transform = 'scale(1)';
    }, 200);
}

// Show notification message
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        background: ${type === 'error' ? 'rgba(204, 0, 0, 0.9)' : 'rgba(107, 115, 242, 0.9)'};
        color: white;
        font-weight: 600;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== MAIN FUNCTIONALITY =====

// Generate QR Code
function generateQRCode() {
    const text = qrInput.value.trim();
    
    // Validation
    if (text.length === 0) {
        qrResult.innerHTML = `
            <div class="placeholder" style="color: #CC0000;">
                <div class="placeholder-icon">⚠️</div>
                <p>Please enter text or a URL!</p>
            </div>
        `;
        qrResult.classList.remove('active');
        downloadBtn.classList.add('hidden');
        showNotification('Please enter some text!', 'error');
        return;
    }
    
    // Get customization options
    const size = qrSizeSelect.value;
    const qrColor = hexToRgb(qrColorInput.value);
    const bgColor = hexToRgb(qrBgColorInput.value);
    
    // Format colors for API
    const qrColorFormatted = formatRgbForApi(qrColor);
    const bgColorFormatted = formatRgbForApi(bgColor);
    
    // Show loading state
    qrResult.innerHTML = `
        <div class="placeholder">
            <div class="placeholder-icon" style="animation: rotate 1s linear infinite;">⚙️</div>
            <p>Generating your QR code...</p>
        </div>
    `;
    
    // Generate QR code URL
    currentQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=${qrColorFormatted}&bgcolor=${bgColorFormatted}&data=${encodeURIComponent(text)}`;
    
    // Create image element
    const img = document.createElement('img');
    img.src = currentQRUrl;
    img.alt = 'Generated QR Code';
    img.style.cssText = `
        box-shadow: 0 5px 30px rgba(0, 0, 0, 0.5);
        border-radius: 16px;
        max-width: 100%;
        cursor: pointer;
    `;
    
    // Handle image load
    img.onload = () => {
        qrResult.innerHTML = '';
        qrResult.appendChild(img);
        qrResult.classList.add('active');
        downloadBtn.classList.remove('hidden');
        
        // Update stats
        qrCount++;
        localStorage.setItem('qrCount', qrCount);
        qrCountDisplay.textContent = qrCount;
        
        // Pulse animation for count
        qrCountDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => {
            qrCountDisplay.style.transform = 'scale(1)';
        }, 300);
        
        showNotification('QR Code generated successfully! ✨');
    };
    
    // Handle image error
    img.onerror = () => {
        qrResult.innerHTML = `
            <div class="placeholder" style="color: #CC0000;">
                <div class="placeholder-icon">❌</div>
                <p>Failed to generate QR code. Please try again.</p>
            </div>
        `;
        qrResult.classList.remove('active');
        downloadBtn.classList.add('hidden');
        showNotification('Failed to generate QR code', 'error');
    };
}

// Download QR Code
function downloadQRCode() {
    if (!currentQRUrl) {
        showNotification('No QR code to download!', 'error');
        return;
    }
    
    // Create temporary link to trigger download
    const link = document.createElement('a');
    link.href = currentQRUrl;
    link.download = `qr-code-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('QR Code downloaded! 📥');
}

// ===== EVENT LISTENERS =====

// Generate button click
generateBtn.addEventListener('click', generateQRCode);

// Download button click
downloadBtn.addEventListener('click', downloadQRCode);

// Enter key to generate
qrInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        generateQRCode();
    }
});

// Real-time character count
qrInput.addEventListener('input', updateCharCount);

// Add focus effects
qrInput.addEventListener('focus', () => {
    qrInput.parentElement.style.transform = 'translateY(-2px)';
});

qrInput.addEventListener('blur', () => {
    qrInput.parentElement.style.transform = 'translateY(0)';
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to generate
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateQRCode();
    }
    
    // Ctrl/Cmd + D to download
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (!downloadBtn.classList.contains('hidden')) {
            downloadQRCode();
        }
    }
});

// ===== ANIMATIONS =====

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
console.log('%c🚀 QR Code Generator Loaded!', 'color: #6b73f2; font-size: 16px; font-weight: bold;');
console.log('%cMade with 💜 by ShifoSan', 'color: #b189ff; font-size: 12px;');
console.log('%cKeyboard Shortcuts:', 'color: #F4E6CD; font-size: 14px; font-weight: bold;');
console.log('%c  Ctrl/Cmd + Enter: Generate QR Code', 'color: #eaeaea; font-size: 12px;');
console.log('%c  Ctrl/Cmd + D: Download QR Code', 'color: #eaeaea; font-size: 12px;');
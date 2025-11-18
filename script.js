// QR Code Generation Logic
// Basic feature: use free QR API for now

document.getElementById('generateBtn').onclick = function() {
    let text = document.getElementById('qrInput').value.trim();
    let qrResult = document.getElementById('qrResult');
    qrResult.innerHTML = '';
    if(text.length === 0) {
        qrResult.innerHTML = '<p>Please enter text or a URL!</p>';
        return;
    }
    // Use quick chart API for now
    let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=43-39-97&bgcolor=232-39-81&data=${encodeURIComponent(text)}`;
    let img = document.createElement('img');
    img.src = qrUrl;
    img.alt = 'QR Code';
    img.style = 'box-shadow:0 2px 12px #0a0a2350; border-radius:10px;';
    qrResult.appendChild(img);
};
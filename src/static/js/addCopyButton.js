document.addEventListener('DOMContentLoaded', function() {
    // Xử lý tất cả thẻ pre
    document.querySelectorAll('pre').forEach(pre => {
        // Lấy ngôn ngữ từ data-language hoặc class
        const language = pre.getAttribute('data-language') || 
                        Array.from(pre.classList).find(cls => cls.startsWith('language-')) || 
                        'plaintext';
        
        // Chuẩn bị nội dung code (loại bỏ button nếu có)
        let codeContent = pre.innerHTML;
        const existingButton = pre.querySelector('._pre-clip');
        if (existingButton) {
            codeContent = codeContent.replace(existingButton.outerHTML, '');
        }
        
        // Tạo thẻ code nếu chưa có
        if (!pre.querySelector('code')) {
            const code = document.createElement('code');
            code.className = `language-${language.replace('language-', '')}`;
            code.innerHTML = codeContent.trim();
            pre.innerHTML = '';
            pre.appendChild(code);
        }
        
        // Thêm nút copy nếu chưa có
        if (!existingButton) {
            const copyButton = document.createElement("button");
            copyButton.innerHTML = '<svg><use xlink:href="#icon-copy"></use></svg>';
            copyButton.type = "button";
            copyButton.className = "_pre-clip";
            copyButton.title = "Copy to clipboard";
            copyButton.setAttribute("aria-label", "Copy to clipboard");
            
            copyButton.addEventListener('click', function() {
                const codeElement = pre.querySelector('code') || pre;
                const textToCopy = codeElement.textContent.trim();
                
                navigator.clipboard.writeText(textToCopy).then(() => {
                    this.classList.add('copied');
                    const originalHTML = this.innerHTML;
                    this.innerHTML = '<svg><use xlink:href="#icon-copy"></use></svg> Copied!';
                    setTimeout(() => {
                        this.classList.remove('copied');
                        this.innerHTML = originalHTML;
                    }, 2000);
                });
            });
            
            pre.appendChild(copyButton);
        }
    });
    
    // Áp dụng highlight sau khi đã xử lý DOM
    hljs.highlightAll();
});
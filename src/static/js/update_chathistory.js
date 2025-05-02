document.addEventListener('DOMContentLoaded', function() {
    // Lấy tất cả các mục lịch sử
    const historyItems = document.querySelectorAll('.history-item');
    
    // Kiểm tra cookie hoặc URL để highlight item hiện tại khi tải trang
    const currentChatId = getChatIdFromCookieOrUrl();
    if (currentChatId) {
        highlightItem(currentChatId);
    }

    // Xử lý sự kiện click
    document.addEventListener('click', function(e) {
        const item = e.target.closest('.history-item');
        if (item) {
            const chatId = item.getAttribute('data-chat-id');
            
            // 1. Cập nhật cookie
            document.cookie = `history_chat_id=${chatId}; path=/`;
            
            // 2. Highlight item được click
            highlightItem(chatId);
            
            // 3. Chuyển trang
            window.location.href = `/chat?chat_history_id=${chatId}`;
        }
    });

    // Hàm lấy chat_id từ cookie hoặc URL
    function getChatIdFromCookieOrUrl() {
        // Kiểm tra từ URL trước
        const urlParams = new URLSearchParams(window.location.search);
        const urlChatId = urlParams.get('chat_history_id');
        
        if (urlChatId) return urlChatId;
        
        // Nếu không có trong URL, kiểm tra cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('history_chat_id='))
            ?.split('=')[1];
        
        return cookieValue || null;
    }

    // Hàm highlight item
    function highlightItem(chatId) {
        historyItems.forEach(item => {
            if (item.getAttribute('data-chat-id') === chatId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
});
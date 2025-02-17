document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', function() {
        const chatId = this.getAttribute('data-chat-id'); 
        document.cookie = `history_chat_id=${chatId}; path=/`; 

        window.location.href = `/chat?chat_history_id=${chatId}`;
    });
});

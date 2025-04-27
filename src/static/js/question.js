document.addEventListener('DOMContentLoaded', function() {
    const tabs = document.querySelectorAll('.tab');
    const resultTitles = document.querySelectorAll('.result-title');
    const searchResultsPanel = document.querySelector('.search-results-panel');
    const backButton = document.createElement('button'); // Tạo nút "Quay lại"
    
    backButton.textContent = 'Quay lại';
    backButton.style.display = 'none'; // Ban đầu ẩn nút
    backButton.style.padding = '10px 20px';
    backButton.style.margin = '10px 0';
    backButton.style.backgroundColor = '#5d6dea';
    backButton.style.color = 'white';
    backButton.style.border = 'none';
    backButton.style.borderRadius = '5px';
    backButton.style.cursor = 'pointer';
    
    searchResultsPanel.appendChild(backButton); // Thêm nút vào search-results-panel

    // Lưu lại danh sách các kết quả tìm kiếm để khôi phục lại khi nhấn "Quay lại"
    const originalResults = searchResultsPanel.innerHTML;

    // Xử lý tab
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            backButton.style.display = 'none'; // Ẩn nút "Quay lại" khi chuyển tab
        });
    });

    // Xử lý click vào tiêu đề kết quả
    resultTitles.forEach(title => {
        title.addEventListener('click', function(e) {
            e.preventDefault();

            // Lấy nội dung chi tiết từ data-content
            const content = this.getAttribute('data-content');
            const titleText = this.textContent;

            // Tạo một phần tử mới để hiển thị chi tiết câu hỏi
            const resultDetail = document.createElement('div');
            resultDetail.classList.add('result-detail');
            resultDetail.innerHTML = `
                <h4>${titleText}</h4>
                <p>${content}</p>
            `;

            // Ẩn danh sách kết quả và chỉ hiển thị nội dung chi tiết
            searchResultsPanel.innerHTML = ''; // Xóa các kết quả cũ
            searchResultsPanel.appendChild(backButton); // Thêm lại nút quay lại
            searchResultsPanel.appendChild(resultDetail); // Thêm nội dung chi tiết vào panel

            // Hiển thị nút "Quay lại"
            backButton.style.display = 'inline-block';
        });
    });

    // Quay lại danh sách kết quả
    backButton.addEventListener('click', function() {
        // Phục hồi lại danh sách kết quả tìm kiếm ban đầu
        searchResultsPanel.innerHTML = originalResults; // Khôi phục lại kết quả ban đầu

        // Ẩn nút "Quay lại"
        backButton.style.display = 'none';
    });
});

document.addEventListener('DOMContentLoaded', function(){
  // DOM cache
  const arxivTab     = document.getElementById('arxiv-tab');
  const soTab        = document.getElementById('so-tab');
  const arxivForm    = document.getElementById('arxiv-form');
  const soForm       = document.getElementById('so-form');
  const arxivResults = document.getElementById('arxiv-results');
  const soResults    = document.getElementById('so-results');
  
  // Tạo loading elements
  const arxivLoading = createLoadingElement('Đang tìm kiếm arXiv...');
  const soLoading = createLoadingElement('Đang tìm kiếm StackOverflow...');
  arxivResults.appendChild(arxivLoading);
  soResults.appendChild(soLoading);
  
  function createLoadingElement(text) {
      const container = document.createElement('div');
      container.className = 'loading-container';
      container.style.display = 'none';
      
      container.innerHTML = `
          <div class="loading-spinner"></div>
          <div class="loading-text">${text}</div>
      `;
      return container;
  }

  // 1) Chuyển tab
  [arxivTab, soTab].forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.tab;
      arxivTab.classList.toggle('active', mode === 'arxiv');
      soTab.classList.toggle('active', mode === 'stackoverflow');
      arxivForm.style.display    = mode === 'arxiv' ? 'flex' : 'none';
      soForm.style.display       = mode === 'stackoverflow' ? 'flex' : 'none';
      arxivResults.style.display = mode === 'arxiv' ? 'block' : 'none';
      soResults.style.display    = mode === 'stackoverflow' ? 'block' : 'none';
    });
  });

  // 2) Render kết quả arXiv
  function renderArxiv(papers) {
    arxivLoading.style.display = 'none'; // Ẩn loading khi có kết quả
    arxivResults.innerHTML = '';
    if (!papers || papers.length === 0) {
      arxivResults.innerHTML = '<p>No results found.</p>';
      return;
    }
    
    // Tạo fragment để tối ưu performance
    const fragment = document.createDocumentFragment();
    
    papers.forEach(p => {
      const d = document.createElement('div');
      d.className = 'result-item';
      d.innerHTML = `
        <h3><a href="${p.link}" target="_blank">${p.title}</a></h3>
        <div class="arxiv-abstract markdown-body">
          ${marked.parse(p.abstract || '')}
        </div>
      `;
      fragment.appendChild(d);
    });
    
    arxivResults.appendChild(fragment);
    
    // Typeset MathJax nếu có
    if (window.MathJax) {
      MathJax.typesetPromise();
    }
  }

  function enrichAnswerContent(html) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
  
    wrapper.querySelectorAll('a').forEach(a => {
      const img = a.querySelector('img');
      if (!img) return;
  
      const href = a.href;
      const altText = img.alt.trim() || 'View Image';
  
      const logo = document.createElement('img');
      logo.src = '/static/image/default-logo-image.png';  
      logo.alt = 'Logo';
      logo.className = 'answer-logo-inline mb-2';
  
      const linkText = document.createElement('a');
      linkText.href = href;
      linkText.rel = 'noreferrer';
      linkText.textContent = altText;
      linkText.className = 'ml-2 text-blue-600 underline';
  
      a.replaceWith(logo, linkText);
    });
  
    return wrapper.innerHTML;
  }
  
  // 3) Render kết quả StackOverflow
  function renderSO(papers) {
    soLoading.style.display = 'none'; // Ẩn loading khi có kết quả
    soResults.innerHTML = '';
    
    if (!papers || papers.length === 0) {
      soResults.innerHTML = '<p>The server is stucked. Please Try Again</p>';
      return;
    }
    
    const fragment = document.createDocumentFragment();
    
    papers.forEach(p => {
      const card = document.createElement('div');
      card.className = 'question-card bg-white rounded-lg shadow-sm overflow-hidden';

      // build answers HTML
      let answersHTML = '';
      for (let i = 1; i <= 5; i++) {
        const txt   = p[`answer_${i}`];
        const score = p[`answer_${i}_score`];
        if (txt && txt.trim().length > 5) {
          answersHTML += `
            <div class="answer-item p-4 rounded-lg mb-4">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center">
                  <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full mr-2">
                    Answer ${i}
                  </span>
                  <span class="text-sm text-gray-500">
                    <i class="fas fa-thumbs-up text-blue-500 mr-1"></i>${score} upvotes
                  </span>
                </div>
              </div>
              <div class="answer-content text-gray-700">
                ${enrichAnswerContent(txt)}
              </div>
            </div>
          `;
        }
      }

      card.innerHTML = `
        <div class="p-6">
          <div class="flex items-center mb-4">
            <h2 class="text-2xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer">
              ${p.title}
            </h2>
            <span class="ml-auto text-sm text-gray-500">Asked: ${p.date}</span>
          </div>
          <div class="mt-4">
            ${answersHTML}
          </div>
        </div>
      `;

      fragment.appendChild(card);
    });
    
    soResults.appendChild(fragment);
    hljs.highlightAll(); // Re-highlight code blocks
  }
// 4) Gửi form arXiv
arxivForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('arxiv-query').value.trim();
  if (!q) return;
  
  // Hiển thị loading và xóa kết quả cũ
  arxivLoading.style.display = 'flex';
  arxivResults.innerHTML = '';
  arxivResults.appendChild(arxivLoading);
  
  // Thay URL bằng địa chỉ server thực tế của bạn
  fetch('https://5f50-14-169-195-228.ngrok-free.app/search/arxiv', {
    method: 'POST',
    body: new URLSearchParams({ query: q }),
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'ngrok-skip-browser-warning': 'true' // Bỏ qua cảnh báo từ ngrok
    }
  })
    .then(r => r.json())
    .then(data => renderArxiv(data.papers || []))
    .catch((error) => {
      console.error('Error:', error);
      arxivLoading.style.display = 'none';
      renderArxiv([]);
    });
});

// 5) Gửi form StackOverflow
soForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = document.getElementById('so-query').value.trim();
  if (!q) return;
  
  // Hiển thị loading và xóa kết quả cũ
  soLoading.style.display = 'flex';
  soResults.innerHTML = '';
  soResults.appendChild(soLoading);
  
  // Thay URL bằng địa chỉ server thực tế của bạn
  fetch('https://5f50-14-169-195-228.ngrok-free.app/search/stackoverflow', {
    method: 'POST',
    body: new URLSearchParams({ query: q }),
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
      'ngrok-skip-browser-warning': 'true' // Bỏ qua cảnh báo từ ngrok
    }
  })
    .then(r => r.json())
    .then(data => renderSO(data.papers || []))
    .catch((error) => {
      console.error('Error:', error);
      soLoading.style.display = 'none';
      renderSO([]);
    });
});
});
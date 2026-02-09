let todos = [];

// DOM 요소
const todoList = document.getElementById('todo-list');
const fabBtn = document.getElementById('fab-btn');
const modalOverlay = document.getElementById('modal-overlay');
const closeModalBtn = document.getElementById('close-modal-btn');
const addBtn = document.getElementById('add-btn');

// 입력 필드들
const todoInput = document.getElementById('todo-input');
const categorySelect = document.getElementById('category-select');
const deadlineInput = document.getElementById('deadline-input');
const urgentCheck = document.getElementById('urgent-check');
const importantCheck = document.getElementById('important-check');
const descInput = document.getElementById('desc-input');

// 1. 초기화 및 실행
function init() {
    const saved = localStorage.getItem('memopipoTodos');
    if (saved) {
        todos = JSON.parse(saved);
    }
    render();
}

// 2. 모달 열기/닫기
fabBtn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    todoInput.focus();
});

function closeModal() {
    modalOverlay.classList.add('hidden');
    resetInputs();
}

closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// 3. 할 일 추가하기
addBtn.addEventListener('click', () => {
    const title = todoInput.value.trim();
    if (!title) {
        alert("할 일을 적어주세요!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        category: categorySelect.value, // Me, School 등
        deadline: deadlineInput.value,
        isUrgent: urgentCheck.checked,
        isImportant: importantCheck.checked,
        description: descInput.value,
        isCompleted: false,
        createdAt: Date.now()
    };

    todos.push(newTodo);
    saveAndRender();
    closeModal(); // 입력 후 닫기
});

function resetInputs() {
    todoInput.value = '';
    descInput.value = '';
    urgentCheck.checked = false;
    importantCheck.checked = false;
    deadlineInput.value = '';
    categorySelect.selectedIndex = 0;
}

// 4. 우선순위 점수 계산 (정렬용)
function getScore(todo) {
    if (todo.isCompleted) return -1; // 완료된 건 맨 뒤로

    let score = 0;
    if (todo.isUrgent) score += 30;
    if (todo.isImportant) score += 20;

    if (todo.deadline) {
        const today = new Date().setHours(0,0,0,0);
        const dDay = new Date(todo.deadline).setHours(0,0,0,0);
        const diff = (dDay - today) / (1000 * 60 * 60 * 24);

        if (diff < 0) score += 50; // 지남
        else if (diff <= 1) score += 40; // 오늘/내일
        else if (diff <= 3) score += 10;
    }
    return score;
}

// 5. 화면 그리기 (렌더링)
function render() {
    todoList.innerHTML = '';

    // 정렬 로직: 1. 점수 높은순, 2. 점수 같으면 최신순(ID 내림차순)
    todos.sort((a, b) => {
        const scoreA = getScore(a);
        const scoreB = getScore(b);
        if (scoreA !== scoreB) return scoreB - scoreA;
        return b.id - a.id; // 최신 등록이 위로
    });

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;

        // 우선순위 점 색상
        let dotClass = 'dot-gray';
        const score = getScore(todo);
        if (score >= 40) dotClass = 'dot-red';
        else if (score >= 20) dotClass = 'dot-blue';

        li.innerHTML = `
            <div class="todo-main">
                <input type="checkbox" class="circle-check" 
                    ${todo.isCompleted ? 'checked' : ''} 
                    onchange="toggleComplete(${todo.id})">
                
                <div class="todo-content">
                    <span class="todo-title" onclick="toggleDesc(${todo.id})">${todo.title}</span>
                    <div class="todo-info">
                        <span class="todo-tag">${todo.category}</span>
                        ${todo.deadline ? `<span>🗓 ${todo.deadline}</span>` : ''}
                    </div>
                </div>

                <div class="priority-dot ${dotClass}"></div>
            </div>

            <div id="desc-${todo.id}" class="todo-desc">
                <p>${todo.description || '메모 없음'}</p>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">삭제</button>
            </div>
        `;
        todoList.appendChild(li);
    });
}

// 6. 데이터 저장
function saveAndRender() {
    localStorage.setItem('memopipoTodos', JSON.stringify(todos));
    render();
}

// 7. 글로벌 함수 (HTML에서 호출)
window.toggleComplete = function(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isCompleted = !todo.isCompleted;
        saveAndRender();
    }
};

window.toggleDesc = function(id) {
    const el = document.getElementById(`desc-${id}`);
    if (el) el.classList.toggle('show');
};

window.deleteTodo = function(id) {
    if (confirm('이 기억을 지울까요?')) {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
    }
};

init();

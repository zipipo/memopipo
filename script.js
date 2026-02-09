// 상태 관리 (할 일 목록)
let todos = [];

// DOM 요소 가져오기
const todoInput = document.getElementById('todo-input');
const descInput = document.getElementById('desc-input');
const categorySelect = document.getElementById('category-select');
const deadlineInput = document.getElementById('deadline-input');
const urgentCheck = document.getElementById('urgent-check');
const importantCheck = document.getElementById('important-check');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const completedList = document.getElementById('completed-list');
const toggleCompletedBtn = document.getElementById('toggle-completed-btn');
const completedSection = document.getElementById('completed-section');

// 초기화: 로컬 스토리지에서 데이터 불러오기
function init() {
    const savedTodos = localStorage.getItem('pixelTodos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    render();
}

// 할 일 추가 함수
function addTodo() {
    const title = todoInput.value.trim();
    if (!title) {
        alert("할 일을 입력해주세요!");
        return;
    }

    const newTodo = {
        id: Date.now(),
        title: title,
        description: descInput.value,
        category: categorySelect.value,
        categoryText: categorySelect.options[categorySelect.selectedIndex].text,
        deadline: deadlineInput.value,
        isUrgent: urgentCheck.checked,
        isImportant: importantCheck.checked,
        isCompleted: false,
        createdAt: new Date().toISOString()
    };

    todos.push(newTodo);
    saveAndRender();
    resetInputs();
}

// 입력창 초기화
function resetInputs() {
    todoInput.value = '';
    descInput.value = '';
    urgentCheck.checked = false;
    importantCheck.checked = false;
    deadlineInput.value = '';
}

// 우선순위 점수 계산기 (알고리즘)
function calculatePriority(todo) {
    let score = 0;
    
    // 1. 긴급도 (가중치 30점)
    if (todo.isUrgent) score += 30;
    
    // 2. 중요도 (가중치 20점)
    if (todo.isImportant) score += 20;
    
    // 3. 마감일 임박 점수
    if (todo.deadline) {
        const today = new Date();
        today.setHours(0,0,0,0);
        const deadlineDate = new Date(todo.deadline);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) score += 100; // 마감 지남 (최우선)
        else if (diffDays === 0) score += 50; // 오늘 마감
        else if (diffDays <= 3) score += 10; // 3일 내 마감
    }

    return score;
}

// 화면 그리기 (Render)
function render() {
    // 1. 목록 비우기
    todoList.innerHTML = '';
    completedList.innerHTML = '';

    // 2. 미완료 항목 정렬 (우선순위 높은 순)
    const activeTodos = todos.filter(t => !t.isCompleted);
    activeTodos.sort((a, b) => calculatePriority(b) - calculatePriority(a));

    // 3. 완료 항목
    const doneTodos = todos.filter(t => t.isCompleted);
    // 완료된 건 최신순 정렬
    doneTodos.sort((a, b) => b.id - a.id); 

    // 4. HTML 생성
    activeTodos.forEach(todo => {
        const item = createTodoElement(todo);
        todoList.appendChild(item);
    });

    doneTodos.forEach(todo => {
        const item = createTodoElement(todo);
        completedList.appendChild(item);
    });
}

// 개별 할 일 HTML 요소 만들기
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.isCompleted ? 'completed' : ''}`;
    
    // 우선순위 시각화 (빨/주/초)
    let priorityClass = 'p-low';
    const score = calculatePriority(todo);
    if (score >= 50) priorityClass = 'p-high'; // 빨강
    else if (score >= 20) priorityClass = 'p-mid'; // 주황

    // 마감일 텍스트
    let deadlineText = '';
    if (todo.deadline) {
        deadlineText = `📅 ${todo.deadline}`;
    }

    li.innerHTML = `
        <div class="todo-header">
            <input type="checkbox" ${todo.isCompleted ? 'checked' : ''} onchange="toggleComplete(${todo.id})">
            <span class="todo-title" onclick="toggleDesc(${todo.id})">${todo.title}</span>
            <span class="priority-badge ${priorityClass}"></span>
        </div>
        <div class="todo-meta">
            <span>${todo.categoryText}</span>
            <span>${deadlineText}</span>
            ${todo.description ? '<span style="color:#888; font-size:10px;">💬</span>' : ''}
        </div>
        <div id="desc-${todo.id}" class="todo-desc">
            ${todo.description || '설명 없음'}
            <div class="todo-actions">
                <button class="action-btn" onclick="deleteTodo(${todo.id})">삭제</button>
            </div>
        </div>
    `;
    return li;
}

// 기능 함수들
window.toggleComplete = function(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.isCompleted = !todo.isCompleted;
        saveAndRender();
    }
};

window.toggleDesc = function(id) {
    const descEl = document.getElementById(`desc-${id}`);
    if (descEl) {
        descEl.classList.toggle('show');
    }
};

window.deleteTodo = function(id) {
    if(confirm('정말 삭제할까요?')) {
        todos = todos.filter(t => t.id !== id);
        saveAndRender();
    }
};

function saveAndRender() {
    localStorage.setItem('pixelTodos', JSON.stringify(todos));
    render();
}

// 이벤트 리스너 연결
addBtn.addEventListener('click', addTodo);
toggleCompletedBtn.addEventListener('click', () => {
    completedSection.classList.toggle('hidden');
});

// 앱 실행
init();
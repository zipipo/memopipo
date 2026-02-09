/* 1. 폰트 로드 (모두 통일) */
@font-face {
    font-family: 'LeeSeoyun';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2202-2@1.0/LeeSeoyun.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

:root {
    --bg-color: #FDFBF7; /* 아주 연한 미색 (종이 느낌) */
    --text-color: #4A4A4A;
    --leaf-color: #78C2AD; /* 부드러운 초록색 */
    --accent-red: #FF6B6B;
    --modal-bg: #FFFFFF;
    --line-color: #E0E0E0;
}

* {
    box-sizing: border-box; /* 크기 계산 오류 방지 */
}

body {
    background-color: var(--bg-color);
    font-family: 'LeeSeoyun', sans-serif !important; /* 강제 적용 */
    margin: 0;
    padding: 20px;
    color: var(--text-color);
    overflow-x: hidden; /* 가로 스크롤 방지 */
}

input, button, select, textarea {
    font-family: 'LeeSeoyun', sans-serif !important;
}

.app-container {
    max-width: 500px;
    margin: 0 auto;
    padding-bottom: 80px; /* 버튼 공간 확보 */
}

/* 헤더 */
header {
    margin-top: 20px;
    margin-bottom: 40px;
}

h1 {
    font-size: 3rem;
    margin: 0;
    color: #2C3E50;
    letter-spacing: -1px;
}

.subtitle {
    color: #888;
    font-size: 1.2rem;
    margin-top: 5px;
}

/* 리스트 스타일 (심플 & 모던) */
ul {
    list-style: none;
    padding: 0;
}

.todo-item {
    display: flex;
    flex-direction: column;
    padding: 15px 0;
    border-bottom: 1px dashed var(--line-color);
    position: relative;
    transition: all 0.3s ease;
}

.todo-main {
    display: flex;
    align-items: center;
    gap: 12px;
}

/* 커스텀 원형 체크박스 */
.circle-check {
    appearance: none;
    width: 24px;
    height: 24px;
    border: 2px solid #ccc;
    border-radius: 50%;
    cursor: pointer;
    flex-shrink: 0;
    position: relative;
    transition: all 0.2s;
}

.circle-check:checked {
    background-color: var(--leaf-color);
    border-color: var(--leaf-color);
}

.circle-check:checked::after {
    content: '✔';
    color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
}

.todo-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.todo-title {
    font-size: 1.4rem;
    cursor: pointer;
}

.todo-info {
    font-size: 0.9rem;
    color: #999;
    margin-top: 4px;
}

.todo-tag {
    background: #eee;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.8rem;
    margin-right: 5px;
}

/* 우선순위 점 (오른쪽 표시) */
.priority-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-left: auto;
}
.dot-red { background-color: #FF6B6B; box-shadow: 0 0 5px #FF6B6B; }
.dot-blue { background-color: #4D96FF; }
.dot-gray { background-color: #ddd; }

/* 완료된 상태 */
.completed .todo-title {
    text-decoration: line-through;
    color: #ccc;
}
.completed {
    opacity: 0.6;
}

/* 설명창 (토글) */
.todo-desc {
    font-size: 1rem;
    color: #666;
    background: #f4f4f4;
    padding: 10px;
    margin-top: 10px;
    border-radius: 8px;
    display: none;
    line-height: 1.5;
}
.todo-desc.show { display: block; }
.delete-btn {
    margin-top: 10px;
    background: #FF6B6B;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    float: right;
    cursor: pointer;
}

/* 나뭇잎 버튼 (FAB) */
.leaf-btn {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    background-color: var(--leaf-color);
    border: 2px solid #2C3E50;
    border-radius: 50% 50% 0 50%; /* 나뭇잎 모양 */
    box-shadow: 4px 4px 0px #2C3E50;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
    transition: transform 0.1s;
}

.leaf-btn:active {
    transform: scale(0.95);
    box-shadow: 2px 2px 0px #2C3E50;
}

.leaf-icon {
    font-size: 30px;
    transform: rotate(45deg); /* 아이콘 각도 조절 */
}

/* 모달 (팝업) 스타일 */
.hidden { display: none !important; }

.modal-overlay {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 200;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.modal-box {
    background: var(--modal-bg);
    width: 100%;
    max-width: 400px;
    border: 3px solid #2C3E50;
    box-shadow: 6px 6px 0px #2C3E50;
    border-radius: 12px;
    padding: 20px;
    animation: popUp 0.3s ease-out;
}

@keyframes popUp {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.modal-header h2 { margin: 0; font-size: 1.5rem; }
.close-btn { background: none; border: none; font-size: 2rem; cursor: pointer; }

/* 입력 필드 스타일 수정 (깨짐 방지) */
.modal-body input[type="text"],
.modal-body textarea,
.modal-body select,
.modal-body input[type="date"] {
    width: 100%;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    margin-bottom: 15px;
    font-size: 1.1rem;
    background: #FAFAFA;
}

.modal-body input:focus, .modal-body textarea:focus {
    border-color: var(--leaf-color);
    outline: none;
}

.toggle-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
}

.toggle-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-size: 1.1rem;
}

/* 체크박스 커스텀 */
.toggle-label input { display: none; }
.pixel-checkbox {
    width: 20px; height: 20px;
    border: 2px solid #2C3E50;
    background: white;
    display: inline-block;
}
.toggle-label input:checked + .pixel-checkbox {
    background: var(--leaf-color);
    box-shadow: inset 2px 2px 0 rgba(0,0,0,0.2);
}

.confirm-btn {
    width: 100%;
    background: var(--leaf-color);
    color: white;
    border: 2px solid #2C3E50;
    padding: 15px;
    font-size: 1.3rem;
    box-shadow: 3px 3px 0px #2C3E50;
    cursor: pointer;
}
.confirm-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 #2C3E50; }

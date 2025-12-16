// ===== Получаем элементы =====
const nameInput = document.getElementById('nameInput');
const namePreview = document.getElementById('namePreview');

const form = document.getElementById('sumForm');
const input1 = document.getElementById('num1');
const input2 = document.getElementById('num2');
const btn = document.getElementById('sumBtn');
const result = document.getElementById('result');

const cardContainer = document.querySelector('.card-container'); // для делегирования

// ===== Live preview имени =====
if (nameInput && namePreview) {
  nameInput.addEventListener('input', (e) => {
    const value = e.target.value.trim();
    namePreview.textContent = value === '' ? '' : value;
  });
}

// ===== Функции для числовых полей =====
// Блокировка ввода букв при keydown
function blockLetters(event) {
  const allowed = /[0-9.\-]/; // разрешаем цифры, точку и минус
  // разрешим Backspace, Delete, Arrow keys, Tab
  const allowedSpecial = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab','Home','End'];
  if (!allowed.test(event.key) && !allowedSpecial.includes(event.key)) {
    event.preventDefault();
  }
}

// Санитизация значения (на случай вставки)
function sanitizeValue(value) {
  // Оставляем только цифры, одну точку и один минус в начале
  // Удаляем все символы кроме 0-9 . -
  let v = value.replace(/[^0-9.\-]/g, '');
  // если больше одной точки — оставляем только первую
  const parts = v.split('.');
  if (parts.length > 1) {
    v = parts.shift() + '.' + parts.join('');
  }
  // если минусов больше одного — оставляем только первый и только в начале
  v = v.replace(/(?!^-)-/g, '');
  if (v.indexOf('-') > 0) {
    v = v.replace('-', '');
    v = '-' + v; // переместим минус в начало если случайно вставили
  }
  return v;
}

// Вешаем события на поля
if (input1 && input2) {
  input1.addEventListener('keydown', blockLetters);
  input2.addEventListener('keydown', blockLetters);

  // Защита от paste
  input1.addEventListener('input', (e) => {
    e.target.value = sanitizeValue(e.target.value);
    toggleBtn();
  });
  input2.addEventListener('input', (e) => {
    e.target.value = sanitizeValue(e.target.value);
    toggleBtn();
  });
}

// ===== Управление доступностью кнопки (если пустые — отключаем) =====
function toggleBtn() {
  if (!btn) return;
  // считаем поле пустым, если value.trim() === ''
  const empty = !input1.value.trim() || !input2.value.trim();
  btn.disabled = empty;
}
toggleBtn(); // инициализация

// ===== Суммирование: обработка submit формы =====
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault(); // не перезагружаем страницу

    const a = Number(input1.value);
    const b = Number(input2.value);

    if (Number.isNaN(a) || Number.isNaN(b)) {
      result.textContent = 'Введите оба числа';
      return;
    }

    result.textContent = 'Результат: ' + (a + b);
  });
}

// ===== Плавная прокрутка для внутренних ссылок (как было) =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const id = this.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Делегирование кликов по карточкам =====
if (cardContainer) {
  cardContainer.addEventListener('click', (e) => {
    // найдём ближайший .card (если клик был внутри одной карточки)
    const card = e.target.closest('.card');
    if (!card || !cardContainer.contains(card)) return;

    // Найдём заголовок внутри карточки (h3) — и покажем alert с его текстом
    const title = card.querySelector('h3') ? card.querySelector('h3').textContent.trim() : 'Карточка';
    alert('Клик по карточке: ' + title);
  });
}

// ===== Гарантируем сабмит по Enter в полях сумматора =====
if (input1 && input2 && form) {
  // обработчик клавиш — если Enter, запустить submit безопасно
  function submitOnEnter(e) {
    if (e.key === 'Enter') {
      // requestSubmit — современный безопасный метод (вызывает submit event)
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        // fallback: вызываем click по кнопке или submit формы
        if (!btn.disabled) {
          btn.click();
        } else {
          form.submit(); // менее предпочтительный fallback
        }
      }
    }
  }

  input1.addEventListener('keydown', submitOnEnter);
  input2.addEventListener('keydown', submitOnEnter);
}


// ===== ToDo Lite =====
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

addTodoBtn.addEventListener('click', function () {
  const text = todoInput.value.trim();
  if (text === "") return;
  
  const li = document.createElement('li');
  li.textContent = text;

  // Удаление при клике
  li.addEventListener('click', function () {
      li.remove();
  });

  todoList.appendChild(li);
  todoInput.value = "";
});
// ===== Telegram Mini App =====
const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();

  try {
    tg.setHeaderColor("#0e0f14");
    tg.setBackgroundColor("#0e0f14");
  } catch (_) {}
}

// Токен/подпись для запросов к бэкенду (понадобится позже).
const initData = tg?.initData || "";

// ===== Toast =====
const toast = document.getElementById("toast");
let toastTimer;

function notify(message) {
  if (!toast) {
    console.log(message);
    return;
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// ===== Страницы =====
const pages = {
  home: {
    html: `
      <section class="content-page">
        <div class="section-heading">
          <span class="eyebrow">ТВОЁ ПРОСТРАНСТВО</span>
          <h2>Интернет.<br>Без лишнего.</h2>
          <p>Управляй подпиской и устройствами в одном месте.</p>
        </div>

        <div class="panel">
          <div class="panel-top">
            <span class="status-dot"></span>
            <span>Статус соединения</span>
          </div>
          <h3 id="connection-status">Пока не подключено</h3>
          <p>Это демонстрационный интерфейс. Подключение появится после настройки сервера.</p>
          <button class="primary-button" id="connect-button">Как подключиться</button>
        </div>

        <div class="panel">
          <span class="eyebrow">ТЕКУЩИЙ СТАТУС</span>
          <h3>Бесплатный просмотр</h3>
          <p>Тестовый режим — оплата ещё не подключена.</p>
          <button class="secondary-button" data-go="plans">Посмотреть тарифы <span>↗</span></button>
        </div>

        <div class="quick-grid">
          <button class="quick-card" data-go="devices">
            <span>▣</span><strong>Устройства</strong><small>Управление доступом</small>
          </button>
          <button class="quick-card" data-go="help">
            <span>?</span><strong>Помощь</strong><small>Ответы и поддержка</small>
          </button>
        </div>
      </section>
    `,
  },

  plans: {
    html: `
      <section class="content-page">
        <div class="section-heading">
          <span class="eyebrow">ПОДПИСКА</span>
          <h2>Выбери свой тариф</h2>
          <p>Демонстрационные цены — оплата ещё не подключена.</p>
        </div>

        <div class="plan-card">
          <span class="plan-period">1 месяц</span>
          <h3>Start</h3>
          <div class="plan-price">199 ₽ <small>/ месяц</small></div>
          <ul>
            <li>Защищённое соединение</li>
            <li>До 2 устройств</li>
            <li>Поддержка пользователей</li>
          </ul>
          <button class="primary-button" data-buy="start">Выбрать тариф</button>
        </div>

        <div class="plan-card featured">
          <span class="plan-badge">Популярный</span>
          <span class="plan-period">3 месяца</span>
          <h3>Plus</h3>
          <div class="plan-price">499 ₽ <small>/ 3 месяца</small></div>
          <ul>
            <li>Защищённое соединение</li>
            <li>До 5 устройств</li>
            <li>Приоритетная поддержка</li>
          </ul>
          <button class="primary-button" data-buy="plus">Выбрать тариф</button>
        </div>

        <p class="fine-print">
          Цены и ограничения приведены для макета и не являются действующим предложением.
        </p>
      </section>
    `,
  },

  devices: {
    html: `
      <section class="content-page">
        <div class="section-heading">
          <span class="eyebrow">ПОДКЛЮЧЕНИЯ</span>
          <h2>Твои устройства</h2>
          <p>Здесь будут отображаться устройства твоего аккаунта.</p>
        </div>

        <div class="empty-state">
          <div class="empty-icon">▣</div>
          <h3>Пока нет устройств</h3>
          <p>Когда сервер будет настроен, здесь появится управление подключениями.</p>
          <button class="secondary-button" data-go="help">Как это работает</button>
        </div>
      </section>
    `,
  },

  profile: {
    html: `
      <section class="content-page">
        <div class="section-heading">
          <span class="eyebrow">АККАУНТ</span>
          <h2>Твой профиль</h2>
          <p>Данные аккаунта появятся после запуска Mini App в Telegram.</p>
        </div>

        <div class="panel">
          <div class="profile-row">
            <div class="avatar">V</div>
            <div>
              <h3 id="profile-name">Гость</h3>
              <p id="profile-id">Telegram пока не подключён</p>
            </div>
          </div>
        </div>

        <div class="panel">
          <span class="eyebrow">ПОДПИСКА</span>
          <h3>Нет активного тарифа</h3>
          <p>Выбери тариф, чтобы посмотреть доступные варианты.</p>
          <button class="secondary-button" data-go="plans">Посмотреть тарифы</button>
        </div>
      </section>
    `,
  },

  help: {
    html: `
      <section class="content-page">
        <div class="section-heading">
          <span class="eyebrow">ПОМОЩЬ</span>
          <h2>Чем помочь?</h2>
          <p>Ответы на частые вопросы.</p>
        </div>

        <details class="faq-item">
          <summary>Как подключить VPN?</summary>
          <p>Сначала нужно настроить сервер и систему выдачи конфигураций. Сейчас приложение работает в демо-режиме.</p>
        </details>

        <details class="faq-item">
          <summary>Как купить подписку?</summary>
          <p>Оплата пока отключена. Позже подключим платёжную систему и проверку платежей на сервере.</p>
        </details>

        <details class="faq-item">
          <summary>Где мои устройства?</summary>
          <p>Открой раздел «Устройства». Реальные данные появятся после подключения backend.</p>
        </details>

        <div class="panel">
          <h3>Нужна помощь?</h3>
          <p>Канал поддержки можно добавить после создания отдельного аккаунта поддержки.</p>
          <button class="secondary-button" id="support-button">Связаться с поддержкой</button>
        </div>
      </section>
    `,
  },
};

let currentPage = "home";

function renderPage(page) {
  if (!pages[page]) {
    notify("Этот раздел пока не готов.");
    return;
  }

  currentPage = page;
  const container = document.getElementById("page-content");
  container.innerHTML = pages[page].html;

  document.querySelectorAll(".nav-item[data-page]").forEach((item) => {
    const active = item.dataset.page === page;
    item.classList.toggle("active", active);
    if (active) {
      item.setAttribute("aria-current", "page");
    } else {
      item.removeAttribute("aria-current");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  // Имя пользователя в профиле, если открыто внутри Telegram.
  if (page === "profile" && tg?.initDataUnsafe?.user) {
    const user = tg.initDataUnsafe.user;
    const name = [user.first_name, user.last_name].filter(Boolean).join(" ");

    const nameEl = document.getElementById("profile-name");
    const idEl = document.getElementById("profile-id");

    if (nameEl) nameEl.textContent = name || "Пользователь";
    if (idEl) idEl.textContent = user.username ? `@${user.username}` : `ID: ${user.id}`;
  }
}

// ===== Обработка кликов =====
document.addEventListener("click", (event) => {
  const navItem = event.target.closest("[data-page]");
  const goButton = event.target.closest("[data-go]");
  const buyButton = event.target.closest("[data-buy]");
  const connectButton = event.target.closest("#connect-button");
  const supportButton = event.target.closest("#support-button");

  if (navItem) {
    event.preventDefault();
    renderPage(navItem.dataset.page);
    return;
  }

  if (goButton) {
    renderPage(goButton.dataset.go);
    return;
  }

  if (buyButton) {
    // TODO: здесь будет вызов бэкенда (создать заказ) с передачей tg.initData.
    const plan = buyButton.dataset.buy;
    notify(plan === "plus" ? "Тариф Plus выбран. Оплата пока не подключена." : "Тариф Start выбран. Оплата пока не подключена.");
    return;
  }

  if (connectButton) {
    notify("VPN-сервер ещё не подключён — сейчас это демо.");
    return;
  }

  if (supportButton) {
    notify("Канал поддержки добавим на следующем этапе.");
  }
});

// Отображаем главную при загрузке.
renderPage("home");

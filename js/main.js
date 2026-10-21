/* ===== Уютный Климат 56 — общие скрипты ===== */

// Контакты компании — меняйте здесь, обновится на всех страницах
const SITE = {
  phone: '+7 (3532) 00-00-00',
  phoneHref: 'tel:+73532000000',
  whatsapp: 'https://wa.me/73532000000',
  telegram: 'https://t.me/username',
  address: 'г. Оренбург, ул. Примерная, 1',
  hours: 'Ежедневно 8:00–20:00',
  email: 'info@klimat56.ru',
};

const NAV = [
  ['index.html', 'Главная'],
  ['konditsionery.html', 'Кондиционеры'],
  ['otoplenie.html', 'Отопление'],
  ['ventilyatsiya.html', 'Вентиляция'],
  ['vodosnabzhenie.html', 'Водоснабжение'],
  ['elektrika.html', 'Электрика'],
  ['santehnika.html', 'Сантехника'],
  ['aktsii.html', 'Акционные товары', 'nav__link--promo'],
];

const SERVICES = ['Кондиционеры', 'Отопление', 'Вентиляция', 'Водоснабжение', 'Электрика', 'Сантехника', 'Акционный товар', 'Другое'];

const currentPage = location.pathname.split('/').pop() || 'index.html';

const logoHTML = `
  <a href="index.html" class="logo">
    <span class="logo__mark"><i data-lucide="wind"></i></span>
    <span>Уютный Климат <b>56</b><small>Климат и инженерные системы в Оренбурге</small></span>
  </a>`;

function renderHeader() {
  const el = document.getElementById('site-header');
  if (!el) return;
  el.outerHTML = `
  <header class="header">
    <div class="container header__top">
      ${logoHTML}
      <div class="header__contacts">
        <a href="${SITE.phoneHref}" class="header__phone">${SITE.phone}<small>${SITE.hours}</small></a>
        <button class="btn btn--accent" data-open-modal>Оставить заявку</button>
        <button class="burger" aria-label="Меню" aria-expanded="false"><i data-lucide="menu"></i></button>
      </div>
    </div>
    <nav class="nav">
      <div class="container">
        <ul class="nav__list">
          ${NAV.map(([href, title, cls]) => `<li><a href="${href}" class="nav__link${cls ? ' ' + cls : ''}${href === currentPage ? ' is-active' : ''}">${title}</a></li>`).join('')}
        </ul>
      </div>
    </nav>
  </header>`;
}

function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.outerHTML = `
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div>
          ${logoHTML}
          <p>Продажа, монтаж и обслуживание кондиционеров и систем отопления в Оренбурге. Вентиляция, водоснабжение, электрика и сантехника. Работаем с гарантией.</p>
        </div>
        <div>
          <h4>Услуги</h4>
          <ul>${NAV.slice(1).map(([href, title]) => `<li><a href="${href}">${title}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Контакты</h4>
          <ul>
            <li class="footer__contact"><i data-lucide="phone"></i><a href="${SITE.phoneHref}">${SITE.phone}</a></li>
            <li class="footer__contact"><i data-lucide="message-circle"></i><span><a href="${SITE.whatsapp}" target="_blank" rel="noopener">WhatsApp</a> · <a href="${SITE.telegram}" target="_blank" rel="noopener">Telegram</a></span></li>
            <li class="footer__contact"><i data-lucide="mail"></i><a href="mailto:${SITE.email}">${SITE.email}</a></li>
            <li class="footer__contact"><i data-lucide="map-pin"></i><span>${SITE.address}</span></li>
            <li class="footer__contact"><i data-lucide="clock"></i><span>${SITE.hours}</span></li>
          </ul>
        </div>
      </div>
      <div class="footer__bottom">
        <span>© ${new Date().getFullYear()} Уютный Климат 56. Все права защищены.</span>
        <span>Информация на сайте не является публичной офертой.</span>
      </div>
    </div>
  </footer>
  <a href="${SITE.phoneHref}" class="fab-call" aria-label="Позвонить"><i data-lucide="phone"></i></a>`;
}

function leadFormHTML({ button = 'Отправить заявку', service = '' } = {}) {
  return `
    <form class="form lead-form">
      <input type="text" name="name" placeholder="Ваше имя" required autocomplete="name">
      <input type="tel" name="phone" placeholder="+7 (___) ___-__-__" required autocomplete="tel">
      <select name="service">
        ${SERVICES.map(s => `<option${s === service ? ' selected' : ''}>${s}</option>`).join('')}
      </select>
      <textarea name="comment" placeholder="Комментарий (необязательно)"></textarea>
      <button type="submit" class="btn btn--accent btn--block">${button}</button>
      <p class="form__agree">Нажимая кнопку, вы соглашаетесь на обработку персональных данных.</p>
      <div class="form__ok">Спасибо! Заявка принята — мы перезвоним в течение 15 минут в рабочее время.</div>
    </form>`;
}

function renderModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal__box" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal__close" aria-label="Закрыть"><i data-lucide="x"></i></button>
      <h3 id="modal-title">Оставить заявку</h3>
      <p>Перезвоним, ответим на вопросы и подскажем стоимость.</p>
      ${leadFormHTML()}
    </div>`;
  document.body.appendChild(modal);
  return modal;
}

// Отправка заявки. Сейчас заявка только выводится в консоль.
// Чтобы получать заявки, подключите сюда Telegram-бота, почту или CRM.
async function sendLead(data) {
  console.log('Новая заявка:', data);
  return true;
}

function phoneMask(input) {
  input.addEventListener('input', () => {
    let d = input.value.replace(/\D/g, '');
    if (d.startsWith('8')) d = '7' + d.slice(1);
    if (!d.startsWith('7')) d = '7' + d;
    d = d.slice(0, 11);
    let r = '+7';
    if (d.length > 1) r += ' (' + d.slice(1, 4);
    if (d.length >= 4) r += ') ' + d.slice(4, 7);
    if (d.length >= 7) r += '-' + d.slice(7, 9);
    if (d.length >= 9) r += '-' + d.slice(9, 11);
    input.value = r;
  });
}

function initForms(root = document) {
  root.querySelectorAll('[data-lead-form]').forEach(el => {
    el.outerHTML = leadFormHTML({ button: el.dataset.button, service: el.dataset.service });
  });
  root.querySelectorAll('.lead-form').forEach(form => {
    if (form.dataset.ready) return;
    form.dataset.ready = '1';
    form.querySelectorAll('input[type=tel]').forEach(phoneMask);
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const tel = form.querySelector('input[type=tel]');
      if (tel.value.replace(/\D/g, '').length < 11) {
        tel.setCustomValidity('Введите номер полностью');
        tel.reportValidity();
        tel.addEventListener('input', () => tel.setCustomValidity(''), { once: true });
        return;
      }
      const data = Object.fromEntries(new FormData(form));
      data.page = document.title;
      await sendLead(data);
      form.classList.add('is-sent');
    });
  });
}

function initModal() {
  const modal = renderModal();
  initForms(modal);
  const close = () => { modal.classList.remove('is-open'); document.body.style.overflow = ''; };
  window.openLeadModal = ({ service, comment } = {}) => {
    const form = modal.querySelector('.lead-form');
    const f = form.elements;
    form.classList.remove('is-sent');
    if (service) f.service.value = service;
    if (comment) f.comment.value = comment;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    f.name.focus();
  };
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-open-modal]');
    if (btn) { e.preventDefault(); openLeadModal({ service: btn.dataset.service, comment: btn.dataset.comment }); }
  });
  modal.addEventListener('click', e => { if (e.target === modal || e.target.closest('.modal__close')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

function initBurger() {
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  if (!burger) return;
  burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
}

function initGallery() {
  const items = document.querySelectorAll('.gallery__item img');
  if (!items.length) return;
  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<button class="lightbox__close" aria-label="Закрыть"><i data-lucide="x"></i></button><img alt="">';
  document.body.appendChild(box);
  items.forEach(img => img.parentElement.addEventListener('click', () => {
    if (!img.isConnected) return; // фото ещё не загружено — показывается заглушка
    box.querySelector('img').src = img.src;
    box.classList.add('is-open');
  }));
  box.addEventListener('click', () => box.classList.remove('is-open'));
}

// Бейдж скидки «−N%» на товарах, где указана старая цена
function initDiscounts() {
  const num = el => +el.textContent.replace(/\D/g, '');
  document.querySelectorAll('.product').forEach(p => {
    const price = p.querySelector('.product__price b');
    const old = p.querySelector('.product__price s');
    if (!price || !old) return;
    const pct = Math.round((1 - num(price) / num(old)) * 100);
    if (pct > 0) p.querySelector('.product__img')?.insertAdjacentHTML('beforeend', `<span class="tag tag--discount">−${pct}%</span>`);
  });
}

// Фильтр товаров по направлению (страница акций)
function initFilter() {
  const list = document.querySelector('[data-filter-list]');
  if (!list) return;
  const empty = document.querySelector('.filters__empty');
  document.querySelectorAll('.filter').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(b => b.classList.toggle('is-active', b === btn));
    const cat = btn.dataset.filter;
    let shown = 0;
    list.querySelectorAll('[data-cat]').forEach(item => {
      item.hidden = cat !== 'all' && item.dataset.cat !== cat;
      if (!item.hidden) shown++;
    });
    empty.hidden = shown > 0;
  }));
}

// Подставляет телефон из SITE во все элементы с data-phone
function fillContacts() {
  document.querySelectorAll('[data-phone]').forEach(a => {
    a.href = SITE.phoneHref;
    if (!a.children.length) a.textContent = SITE.phone;
  });
}

renderHeader();
renderFooter();
initForms();
initModal();
initBurger();
initGallery();
initDiscounts();
initFilter();
fillContacts();
renderIcons();

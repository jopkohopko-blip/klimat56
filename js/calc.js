/* ===== Калькулятор стоимости кондиционера =====
   Все цены ниже — примерные. Поменяйте их на свои. */

const CALC_PRICES = {
  // площадь до (м²) → модель и цена оборудования [обычный, инвертор]
  units: [
    { upTo: 20, model: '07', price: [25000, 32000] },
    { upTo: 25, model: '09', price: [28000, 36000] },
    { upTo: 35, model: '12', price: [34000, 44000] },
    { upTo: 50, model: '18', price: [52000, 65000] },
    { upTo: 70, model: '24', price: [68000, 85000] },
  ],
  install: 9000,         // стандартный монтаж (трасса до 3 м)
  extraMeter: 1200,      // каждый метр трассы сверх 3 м
  dismantle: 2500,       // демонтаж старого кондиционера
  chase: 800,            // штробление, за метр
  height: 4000,          // монтаж выше 3 этажа (автовышка/альпинист)
  service: 3500,         // чистка и обслуживание
};

const rub = n => n.toLocaleString('ru-RU') + ' ₽';

function renderCalc(el) {
  el.innerHTML = `
  <div class="calc">
    <div class="calc__fields">
      <div class="field">
        <span class="field__label">Что нужно?</span>
        <div class="chips">
          <label class="chip"><input type="radio" name="mode" value="full" checked><span>Кондиционер + монтаж</span></label>
          <label class="chip"><input type="radio" name="mode" value="install"><span>Только монтаж</span></label>
          <label class="chip"><input type="radio" name="mode" value="service"><span>Обслуживание</span></label>
        </div>
      </div>
      <div class="field" data-for="full install">
        <label for="calc-area">Площадь помещения</label>
        <div class="range-row">
          <input type="range" id="calc-area" name="area" min="10" max="80" value="20" step="1">
          <output>20 м²</output>
        </div>
        <p class="field__hint">Подберём мощность под вашу комнату</p>
      </div>
      <div class="field" data-for="full">
        <span class="field__label">Тип кондиционера</span>
        <div class="chips">
          <label class="chip"><input type="radio" name="type" value="0" checked><span>Обычный (on/off)</span></label>
          <label class="chip"><input type="radio" name="type" value="1"><span>Инверторный</span></label>
        </div>
        <p class="field__hint">Инвертор тише, экономичнее и может греть зимой</p>
      </div>
      <div class="field" data-for="full install">
        <label for="calc-route">Длина трассы</label>
        <div class="range-row">
          <input type="range" id="calc-route" name="route" min="3" max="15" value="3" step="1">
          <output>3 м</output>
        </div>
        <p class="field__hint">Расстояние между внутренним и наружным блоком. 3 м входят в стандартный монтаж</p>
      </div>
      <div class="field" data-for="full install">
        <span class="field__label">Дополнительно</span>
        <label class="check"><input type="checkbox" name="dismantle"> Демонтаж старого кондиционера <em>+${rub(CALC_PRICES.dismantle)}</em></label>
        <label class="check"><input type="checkbox" name="chase"> Скрыть трассу в стене (штроба) <em>+${rub(CALC_PRICES.chase)}/м</em></label>
        <label class="check"><input type="checkbox" name="height"> Выше 3 этажа <em>+${rub(CALC_PRICES.height)}</em></label>
      </div>
      <div class="field" data-for="service">
        <label for="calc-count">Сколько кондиционеров?</label>
        <div class="range-row">
          <input type="range" id="calc-count" name="count" min="1" max="10" value="1" step="1">
          <output>1 шт.</output>
        </div>
        <p class="field__hint">Чистка фильтров и теплообменников, дозаправка фреоном, проверка работы</p>
      </div>
    </div>
    <div class="calc__result">
      <h3>Предварительный расчёт</h3>
      <ul class="calc__lines"></ul>
      <div class="calc__total"></div>
      <button class="btn btn--accent btn--block" type="button" data-calc-send>Получить точный расчёт</button>
      <a class="btn btn--ghost btn--block" data-phone><i data-lucide="phone"></i> Позвонить</a>
      <p class="calc__note">Расчёт примерный. Точную стоимость назовёт мастер после выезда на объект.</p>
    </div>
  </div>`;

  const form = el.querySelector('.calc');
  const val = name => form.querySelector(`[name=${name}]:checked`)?.value ?? form.querySelector(`[name=${name}]`).value;
  const checked = name => form.querySelector(`[name=${name}]`).checked;
  let summary = '';

  function update() {
    const mode = val('mode');
    form.querySelectorAll('[data-for]').forEach(f => { f.hidden = !f.dataset.for.split(' ').includes(mode); });

    const area = +val('area');
    const route = +val('route');
    const count = +val('count');
    form.querySelector('#calc-area + output').textContent = area + ' м²';
    form.querySelector('#calc-route + output').textContent = route + ' м';
    form.querySelector('#calc-count + output').textContent = count + ' шт.';

    const lines = [];
    let total = 0;
    let fromOnly = false;
    const add = (name, sum) => { lines.push([name, sum]); total += sum; };

    if (mode === 'service') {
      add(`Обслуживание × ${count}`, CALC_PRICES.service * count);
    } else {
      const unit = CALC_PRICES.units.find(u => area <= u.upTo);
      if (mode === 'full') {
        if (unit) {
          const type = +val('type');
          add(`Кондиционер ${unit.model} (${type ? 'инвертор' : 'on/off'})`, unit.price[type]);
        } else {
          fromOnly = true;
          lines.push(['Нужна мощная или мульти-сплит система', null]);
        }
      }
      add('Стандартный монтаж', CALC_PRICES.install);
      if (route > 3) add(`Доп. трасса ${route - 3} м`, (route - 3) * CALC_PRICES.extraMeter);
      if (checked('dismantle')) add('Демонтаж старого', CALC_PRICES.dismantle);
      if (checked('chase')) add(`Штроба ${route} м`, route * CALC_PRICES.chase);
      if (checked('height')) add('Работа на высоте', CALC_PRICES.height);
    }

    form.querySelector('.calc__lines').innerHTML = lines
      .map(([n, s]) => `<li><span>${n}</span><b>${s == null ? 'по запросу' : rub(s)}</b></li>`).join('');
    form.querySelector('.calc__total').innerHTML = `<small>Итого${fromOnly ? ' (без оборудования)' : ''}</small>${fromOnly ? 'от ' : ''}${rub(total)}`;
    summary = lines.map(([n, s]) => `${n}: ${s == null ? 'по запросу' : rub(s)}`).join('; ') + `. Итого: ${rub(total)}`;
  }

  form.addEventListener('input', update);
  form.querySelector('[data-calc-send]').addEventListener('click', () => {
    window.openLeadModal?.({ service: 'Кондиционеры', comment: 'Расчёт с сайта — ' + summary });
  });
  update();
}

document.querySelectorAll('[data-ac-calc]').forEach(renderCalc);

const translations = {
  ka: {
    label: 'ქა',
    title: 'ვაკო ლაგვილავა | ციფრული სააგენტო — itomdev.com Interactive 3D Sketch',
    brandTagline: 'ციფრული სააგენტო',
    backToCorridor: '← კორიდორში დაბრუნება',
    backToCorridorShort: 'კორიდორში დაბრუნება',
    entranceHint: 'მიიტანეთ მაუსი კართან • დააკლიკეთ შესასვლელად',
    corridorHint: 'დაასქროლეთ კორიდორის დასათვალიერებლად ↕',
    mapTag: 'ინტერაქტიული რუკა',
    mapTitle: 'სააგენტოს სივრცე (Floor Plan)',
    mapDescription: 'დააჭირეთ ოთახს კორიდორში გადასაადგილებლად ან შესასვლელად',
    aboutRoom: 'ჩვენ შესახებ',
    servicesRoom: 'სერვისები',
    workRoom: 'ნამუშევრები',
    contactRoom: 'კონტაქტი',
    mapInstruction: '📍 დააკლიკეთ ნებისმიერ ზონაზე',
    languageLabel: 'ენის არჩევა',
    mapLabel: 'მენიუ და რუკა',
    audioLabel: 'ხმა',
    notesLabel: 'მიღწევები'
  },
  en: {
    label: 'EN',
    title: 'Vako Lagvilava | Digital Agency — Interactive 3D Sketch',
    brandTagline: 'Digital agency',
    backToCorridor: '← Back to corridor',
    backToCorridorShort: 'Back to corridor',
    entranceHint: 'Move over a door • click to enter',
    corridorHint: 'Scroll to explore the corridor ↕',
    mapTag: 'INTERACTIVE MAP',
    mapTitle: 'Agency space (Floor plan)',
    mapDescription: 'Select a room to move through the corridor or enter it',
    aboutRoom: 'About',
    servicesRoom: 'Services',
    workRoom: 'Portfolio',
    contactRoom: 'Contact',
    mapInstruction: '📍 Select any area',
    languageLabel: 'Choose language',
    mapLabel: 'Menu and map',
    audioLabel: 'Sound',
    notesLabel: 'Achievements'
  },
  ru: {
    label: 'RU',
    title: 'Вако Лагвилава | Цифровое агентство — интерактивный 3D-скетч',
    brandTagline: 'Цифровое агентство',
    backToCorridor: '← Вернуться в коридор',
    backToCorridorShort: 'Вернуться в коридор',
    entranceHint: 'Наведите на дверь • нажмите, чтобы войти',
    corridorHint: 'Прокрутите, чтобы пройти по коридору ↕',
    mapTag: 'ИНТЕРАКТИВНАЯ КАРТА',
    mapTitle: 'Пространство агентства (план)',
    mapDescription: 'Выберите комнату, чтобы пройти по коридору или войти',
    aboutRoom: 'О нас',
    servicesRoom: 'Услуги',
    workRoom: 'Портфолио',
    contactRoom: 'Контакты',
    mapInstruction: '📍 Выберите любую зону',
    languageLabel: 'Выбрать язык',
    mapLabel: 'Меню и карта',
    audioLabel: 'Звук',
    notesLabel: 'Достижения'
  }
};

let currentLanguage = 'ka';
let corridorState = 'entrance';

function applyLanguage(language) {
  const dictionary = translations[language] || translations.ka;
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = dictionary.title;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });

  const toggle = document.getElementById('currentLanguage');
  if (toggle) toggle.textContent = dictionary.label;
  document.getElementById('languageToggle')?.setAttribute('aria-label', dictionary.languageLabel);
  document.getElementById('mapBtn')?.setAttribute('aria-label', dictionary.mapLabel);
  document.getElementById('audioBtn')?.setAttribute('aria-label', dictionary.audioLabel);
  document.getElementById('notesBtn')?.setAttribute('aria-label', dictionary.notesLabel);
  document.querySelectorAll('[data-language]').forEach((button) => {
    button.classList.toggle('active', button.dataset.language === language);
  });

  updateCorridorHint(corridorState);
  localStorage.setItem('profile-language', language);
}

function updateCorridorHint(state) {
  corridorState = state;
  const hint = document.getElementById('corridorHintText');
  if (!hint) return;
  const dictionary = translations[currentLanguage] || translations.ka;
  hint.textContent = state === 'corridor' ? dictionary.corridorHint : dictionary.entranceHint;
}

export function initLanguageSwitcher() {
  const menu = document.getElementById('languageMenu');
  const toggle = document.getElementById('languageToggle');
  if (!menu || !toggle) return;

  const savedLanguage = localStorage.getItem('profile-language');
  applyLanguage(translations[savedLanguage] ? savedLanguage : 'ka');

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    toggle.setAttribute('aria-expanded', String(willOpen));
  });

  menu.addEventListener('click', (event) => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    applyLanguage(button.dataset.language);
    menu.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.language-switcher')) {
      menu.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  window.setLocalizedCorridorHint = updateCorridorHint;
}

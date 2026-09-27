import { staticTranslations } from './staticTranslations.js?v=20260927_06';

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
const originalText = new WeakMap();
const pageTranslations = {
  en: {
    'ვაკო ლაგვილავა და გუნდი': 'Vako Lagvilava and team',
    'ჩვენი 6 ძირითადი სერვისი': 'Our six core services',
    'შედეგზე ორიენტირებული პორტფოლიო': 'Results-driven portfolio',
    'ინტერაქტიული AI ავტომატიზაციის სიმულატორი': 'Interactive AI automation simulator',
    'დაიწყეთ თქვენი პროექტი': 'Start your project',
    'ყველა ნამუშევარი': 'All work',
    'ვებ & აპლიკაციები': 'Web & apps',
    'დიზაინი & ბრენდინგი': 'Design & branding',
    'AI ავტომატიზაცია': 'AI automation',
    'ვიდეო & Motion': 'Video & motion',
    'თარგმნა': 'Translation',
    '24/7 კლიენტთა მხარდაჭერა': '24/7 customer support',
    'ინვოისების & რეპორტების დამუშავება': 'Invoice & report processing',
    'კონკურენტების AI კვლევა': 'AI competitor research',
    'AI აგენტის გაშვება ⚡': 'Run AI agent ⚡',
    'აირჩიეთ საჭირო სერვის(ებ)ი:': 'Choose the service(s) you need:',
    'თქვენი სახელი / კომპანია:': 'Your name / company:',
    'ელექტრონული ფოსტა:': 'Email address:',
    'პროექტის მოკლე აღწერა:': 'Short project description:',
    'მოთხოვნის გაგზავნა & შეფასების მიღება ⚡': 'Send request & get an estimate ⚡',
    'რას ვაკეთებთ:': 'What we do:',
    'ვის სჭირდება:': 'Who needs it:',
    'რატომ არის სასარგებლო:': 'Why it is useful:',
    'რას მიიღებთ (Deliverables):': 'What you receive (deliverables):',
    'პროექტის დაწყება →': 'Start a project →',
    'ჩატვირთვის დრო: 0.4s': 'Load time: 0.4s',
    'გაყიდვების ზრდა: 3.8x': 'Sales growth: 3.8x',
    'პასუხის სიჩქარე: 1.2s': 'Response time: 1.2s',
    'ორგანული ნახვები: 2.4M': 'Organic views: 2.4M',
    'ლოკალიზებული ენები: 4 ენა': 'Localized languages: 4',
    'ორგანული ზრდა: +410%': 'Organic growth: +410%',
    'Case Study-ს ნახვა →': 'View case study →'
  },
  ru: {
    'ვაკო ლაგვილავა და გუნდი': 'Вако Лагвилава и команда',
    'ჩვენი 6 ძირითადი სერვისი': 'Шесть ключевых услуг',
    'შედეგზე ორიენტირებული პორტფოლიო': 'Портфолио с фокусом на результат',
    'ინტერაქტიული AI ავტომატიზაციის სიმულატორი': 'Интерактивный симулятор AI-автоматизации',
    'დაიწყეთ თქვენი პროექტი': 'Начните свой проект',
    'ყველა ნამუშევარი': 'Все работы',
    'ვებ & აპლიკაციები': 'Сайты и приложения',
    'დიზაინი & ბრენდინგი': 'Дизайн и брендинг',
    'AI ავტომატიზაცია': 'AI-автоматизация',
    'ვიდეო & Motion': 'Видео и motion',
    'თარგმნა': 'Перевод',
    '24/7 კლიენტთა მხარდაჭერა': 'Поддержка клиентов 24/7',
    'ინვოისების & რეპორტების დამუშავება': 'Обработка счетов и отчётов',
    'კონკურენტების AI კვლევა': 'AI-анализ конкурентов',
    'AI აგენტის გაშვება ⚡': 'Запустить AI-агента ⚡',
    'აირჩიეთ საჭირო სერვის(ებ)ი:': 'Выберите нужные услуги:',
    'თქვენი სახელი / კომპანია:': 'Ваше имя / компания:',
    'ელექტრონული ფოსტა:': 'Электронная почта:',
    'პროექტის მოკლე აღწერა:': 'Краткое описание проекта:',
    'მოთხოვნის გაგზავნა & შეფასების მიღება ⚡': 'Отправить запрос и получить оценку ⚡',
    'რას ვაკეთებთ:': 'Что мы делаем:',
    'ვის სჭირდება:': 'Кому это нужно:',
    'რატომ არის სასარგებლო:': 'Почему это полезно:',
    'რას მიიღებთ (Deliverables):': 'Что вы получите:',
    'პროექტის დაწყება →': 'Начать проект →',
    'ჩატვირთვის დრო: 0.4s': 'Время загрузки: 0,4 с',
    'გაყიდვების ზრდა: 3.8x': 'Рост продаж: 3,8x',
    'პასუხის სიჩქარე: 1.2s': 'Скорость ответа: 1,2 с',
    'ორგანული ნახვები: 2.4M': 'Органические просмотры: 2,4 млн',
    'ლოკალიზებული ენები: 4 ენა': 'Локализованные языки: 4',
    'ორგანული ზრდა: +410%': 'Органический рост: +410%',
    'Case Study-ს ნახვა →': 'Посмотреть кейс →'
  }
};

function translateVisiblePage(language) {
  const catalog = { ...staticTranslations[language], ...pageTranslations[language] };
  document.querySelectorAll('body *').forEach((element) => {
    if (element.children.length || element.closest('.language-switcher') || ['SCRIPT', 'STYLE'].includes(element.tagName)) return;
    const source = originalText.get(element) || element.textContent.trim();
    if (!source) return;
    originalText.set(element, source);
    const translated = catalog[source] || source;
    if (element.textContent.trim() !== translated) element.textContent = translated;
  });
}

function applyLanguage(language) {
  const dictionary = translations[language] || translations.ka;
  currentLanguage = language;
  document.documentElement.lang = language;
  document.title = dictionary.title;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = dictionary[element.dataset.i18n];
    if (value) element.textContent = value;
  });
  translateVisiblePage(language);

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
  window.dispatchEvent(new CustomEvent('profilelanguagechange', { detail: { language } }));
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
  let pendingRefresh = null;
  const observer = new MutationObserver(() => {
    if (currentLanguage === 'ka' || pendingRefresh) return;
    pendingRefresh = window.setTimeout(() => {
      pendingRefresh = null;
      translateVisiblePage(currentLanguage);
    }, 0);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

export function localizeService(service) {
  if (currentLanguage === 'ka') return service;
  const russian = currentLanguage === 'ru';
  return {
    ...service,
    title: russian ? 'Услуга ' + service.number : 'Service ' + service.number,
    tagline: russian ? 'Индивидуальное цифровое решение для роста бизнеса.' : 'A tailored digital solution for business growth.',
    whatWeDo: russian ? 'Мы проектируем и запускаем надёжные цифровые продукты.' : 'We design and launch reliable digital products.',
    whoNeedsIt: russian ? 'Командам, которым нужен современный цифровой продукт.' : 'For teams that need a modern digital product.',
    whyUseful: russian ? 'Помогает работать быстрее и получать измеримый результат.' : 'It helps teams work faster and achieve measurable results.',
    deliverables: russian ? ['Стратегия', 'Дизайн и разработка', 'Запуск и поддержка'] : ['Strategy', 'Design and development', 'Launch and support']
  };
}

export function localizeProject(project) {
  if (currentLanguage === 'ka') return project;
  const russian = currentLanguage === 'ru';
  return {
    ...project,
    categoryName: russian ? 'КЕЙС' : 'CASE STUDY',
    summary: russian ? 'Реализованный цифровой проект с измеримым результатом.' : 'A completed digital project with measurable results.',
    challenge: russian ? 'Клиенту требовалось современное цифровое решение.' : 'The client needed a modern digital solution.',
    solution: russian ? 'Мы создали индивидуальный продукт с понятным опытом использования.' : 'We built a tailored product with a clear user experience.',
    result: russian ? 'Измеримый рост эффективности и качества цифрового опыта.' : 'Measurable gains in efficiency and digital experience.',
    deliverables: russian ? ['Исследование', 'Дизайн', 'Разработка'] : ['Research', 'Design', 'Development'],
    metrics: (project.metrics || []).map((metric) => ({ ...metric, label: russian ? 'Результат' : 'Result' }))
  };
}

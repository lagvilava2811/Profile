// js/components/aiDemo.js
// ინტერაქტიული AI ავტომატიზაციის სიმულატორი (Agency Lab Demo)

import { soundEngine } from './audioManager.js';

const aiScenarios = {
  support: {
    prompt: "კლიენტმა მოგვწერა: 'გამარჯობა, სად არის ჩემი შეკვეთა #4892 და როდის ჩამომივა?'",
    steps: [
      { type: "info", text: "⚡ [AGENT_TRIGGER] შემოსულია ახალი მომხმარებლის მოთხოვნა (შეტყობინების ენის იდენტიფიკაცია: ქართული)" },
      { type: "reasoning", text: "🔍 [INTENT_DETECT] მიზანი: შეკვეთის სტატუსის გარკვევა. ამოღებული ID: #4892" },
      { type: "tool", text: "⚙️ [TOOL_CALL] CRM & საწყობის მონაცემთა ბაზის უსაფრთხო შემოწმება (Order API query: #4892)..." },
      { type: "success", text: "✅ [DATA_MATCH] შეკვეთა გაგზავნილია კურიერით. სავარაუდო ჩაბარება: დღეს, 16:30 საათამდე." },
      { type: "final", text: "💬 [AI_RESPONSE] 'მოგესალმებით! თქვენი შეკვეთა #4892 უკვე კურიერს გადაეცა და დღეს 16:30-მდე ჩაგბარდებათ. კურიერის ნომერი: +995 599 00-XX-XX. მადლობა რომ ჩვენთან ხართ!'" }
    ]
  },
  finance: {
    prompt: "ავტომატურად დაამუშავე 50 ახალი ინვოისი (PDF), ამოიღე თანხები, დღგ და გააგზავნე ბუღალტერიაში.",
    steps: [
      { type: "info", text: "⚡ [BATCH_INGEST] მიღებულია 50 PDF ინვოისის ფაილი (სკანირებული და ციფრული დოკუმენტები)" },
      { type: "reasoning", text: "🔍 [DOCUMENT_PARSER] OCR და ტექსტური მოდელი ასკანირებს რეკვიზიტებს, IBAN-ს, კომპანიის კოდებსა და ჯამურ თანხებს..." },
      { type: "tool", text: "⚙️ [AUTO_VALIDATION] საგადასახადო ბაზასთან შედარება და დღგ-ს (18%) ავტომატური გადამოწმება..." },
      { type: "success", text: "✅ [RECONCILED] 50-ვე ინვოისი უშეცდომოდ გადამოწმდა. 0 დუბლიკატი, 0 ადამიანური შეცდომა." },
      { type: "final", text: "📊 [OUTPUT] ექსპორტირებულია 1C / BDO ERP ფორმატში. ბუღალტერიის ხელმძღვანელს გაეგზავნა შეჯამება Telegram/Slack-ში (დაზოგილი დრო: 6.5 საათი)." }
    ]
  },
  research: {
    prompt: "გააკეთე ბაზრის 5 მთავარი კონკურენტის ფასების, ტექნოლოგიური სტეკისა და SEO რეიტინგების შედარება.",
    steps: [
      { type: "info", text: "⚡ [RESEARCH_TASK] მიზნობრივი ნიშა: ელექტრონული კომერცია და ციფრული სერვისები" },
      { type: "reasoning", text: "🔍 [WEB_INTELLIGENCE] კონკურენტების საიტების სტრუქტურის, ფასწარმოქმნის მოდელებისა და ტექნოლოგიების სკანირება..." },
      { type: "tool", text: "⚙️ [SERP_API] Google-ის ორგანული პოზიციების, Core Web Vitals-ისა და Backlink პროფილების ამოღება..." },
      { type: "success", text: "✅ [SYNTHESIS] მონაცემები დამუშავდა. გამოვლენილია კონკურენტების 3 სუსტი წერტილი SEO-ში." },
      { type: "final", text: "📑 [EXECUTIVE_REPORT] გენერირებულია 12-გვერდიანი ინტერაქტიული ანგარიში რეკომენდაციებითა და ROI პროგნოზით." }
    ]
  }
};

export function initAIDemo() {
  const terminal = document.getElementById('aiTerminal');
  const inputField = document.getElementById('aiInput');
  const runBtn = document.getElementById('aiRunBtn');
  const presetBtns = document.querySelectorAll('.preset-btn');
  if (!terminal || !runBtn) return;

  let currentKey = 'support';

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      soundEngine.playClick();
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentKey = btn.getAttribute('data-preset') || 'support';
      const scenario = aiScenarios[currentKey];
      if (scenario && inputField) {
        inputField.value = scenario.prompt;
      }
    });
  });

  runBtn.addEventListener('click', () => {
    soundEngine.playClick();
    executeAISimulation(currentKey);
  });
}

function executeAISimulation(key) {
  const terminal = document.getElementById('aiTerminal');
  const runBtn = document.getElementById('aiRunBtn');
  const scenario = aiScenarios[key] || aiScenarios.support;

  runBtn.disabled = true;
  runBtn.textContent = "AI მუშაობს...";
  terminal.innerHTML = `<div class="ai-terminal-step terminal-accent">🚀 დაწყებულია ავტონომიური პროცესი: ${scenario.prompt}</div>`;

  let delay = 350;

  scenario.steps.forEach((step, index) => {
    setTimeout(() => {
      soundEngine.playPencilScratch();
      const stepDiv = document.createElement('div');
      stepDiv.className = 'ai-terminal-step';

      if (step.type === 'success' || step.type === 'final') {
        stepDiv.classList.add('terminal-success');
      } else if (step.type === 'tool') {
        stepDiv.classList.add('terminal-accent');
      }

      stepDiv.textContent = step.text;
      terminal.appendChild(stepDiv);
      terminal.scrollTop = terminal.scrollHeight;

      if (index === scenario.steps.length - 1) {
        runBtn.disabled = false;
        runBtn.textContent = "AI აგენტის ხელახლა გაშვება ⚡";
        soundEngine.playClick();
      }
    }, delay);

    delay += (index === 0 ? 500 : 750);
  });
}

// js/components/textRotator.js
// Hero ტექსტის დინამიური როტატორი (fade/slide ანიმაციით)

export function initTextRotator(elementId, words, interval = 2800) {
  const container = document.getElementById(elementId);
  if (!container || !words || words.length === 0) return;

  let currentIndex = 0;

  function updateText() {
    container.classList.add('sliding-out');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % words.length;
      container.textContent = words[currentIndex];
      container.classList.remove('sliding-out');
      container.classList.add('sliding-in');

      setTimeout(() => {
        container.classList.remove('sliding-in');
      }, 50);
    }, 350);
  }

  const timer = setInterval(updateText, interval);
  return () => clearInterval(timer);
}

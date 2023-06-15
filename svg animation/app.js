/**
 * Adjusts the size of an element to fit its parent, with optional padding.
 * @param {HTMLElement} el - The element to resize.
 * @param {number} padding - The optional padding value.
 */
function fitElementToParent(el, padding) {
  let timeout = null;

  /**
   * Handles the resize event and resizes the element accordingly.
   */
  function resize() {
    if (timeout) clearTimeout(timeout);
    anime.set(el, { scale: 1 });
    const pad = padding || 0;
    const parentEl = el.parentNode;
    const elOffsetWidth = el.offsetWidth - pad;
    const parentOffsetWidth = parentEl.offsetWidth;
    const ratio = parentOffsetWidth / elOffsetWidth;
    timeout = setTimeout(() => {
      anime.set(el, { scale: ratio });
    }, 10);
  }

  // Initial resize
  resize();

  // Add event listener for window resize
  window.addEventListener('resize', resize);
}


// Self-invoking function for sphere animation
const sphereAnimation = (() => {
  // Select the sphere animation element and its path elements
  const sphereEl = document.querySelector('.sphere-animation');
  const spherePathEls = sphereEl.querySelectorAll('.sphere path');
  const pathLength = spherePathEls.length;
  let hasStarted = false;
  const animations = [];

  // Fit the sphere element to its parent initially
  fitElementToParent(sphereEl);

  // Animation for sphere breath effect
  const breathAnimation = anime({
    begin() {
      for (let i = 0; i < pathLength; i++) {
        animations.push(
          anime({
            targets: spherePathEls[i],
            stroke: {
              value: ['rgba(255,75,75,1)', 'rgba(80,80,80,.35)'],
              duration: 500,
            },
            translateX: [2, -4],
            translateY: [2, -4],
            easing: 'easeOutQuad',
            autoplay: false,
          })
        );
      }
    },
    update(ins) {
      animations.forEach((animation, i) => {
        const percent =
          (1 - Math.sin(i * 0.35 + 0.0022 * ins.currentTime)) / 2;
        animation.seek(animation.duration * percent);
      });
    },
    duration: Infinity,
    autoplay: false,
  });

  // Animation for sphere intro
  const introAnimation = anime.timeline({
    autoplay: false,
  }).add(
    {
      targets: spherePathEls,
      strokeDashoffset: {
        value: [anime.setDashoffset, 0],
        duration: 3900,
        easing: 'easeInOutCirc',
        delay: anime.stagger(190, { direction: 'reverse' }),
      },
      duration: 2000,
      delay: anime.stagger(60, { direction: 'reverse' }),
      easing: 'linear',
    },
    0
  );

  // Animation for sphere shadow
  const shadowAnimation = anime({
    targets: '#sphereGradient',
    x1: '25%',
    x2: '25%',
    y1: '0%',
    y2: '75%',
    duration: 30000,
    easing: 'easeOutQuint',
    autoplay: false,
  });

  /**
   * Initializes the sphere animation.
   */
  function init() {
    introAnimation.play();
    breathAnimation.play();
    shadowAnimation.play();
  }

  // Call the initialization function
  init();
})();




  // Intersection Observer for link-section animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animate-in class to trigger animation
        if (entry.target.classList.contains('thumb-icon')) {
          entry.target.classList.add('animate-in');
        } else if (entry.target.classList.contains('link-section') && entry.target.querySelector('h1')) {
          // Animate the h1 within link-section
          const h1 = entry.target.querySelector('h1');
          h1.classList.add('animate-in');
          // Also animate the thumb-icon if it exists
          const icon = entry.target.querySelector('.thumb-icon');
          if (icon) {
            icon.classList.add('animate-in');
          }
        }
        // Unobserve after animation triggers (runs only once)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe the link-section
  const linkSection = document.querySelector('.link-section');
  if (linkSection) {
    observer.observe(linkSection);
  }



 gsap.registerPlugin(Draggable);

const squeegee = document.getElementById("squeegee");
const frame = document.querySelector(".window-frame");
const reveal = document.getElementById("cleanReveal");
const glow = document.getElementById("wipeGlow");

const bladeOffset = 20;
let hintPlayed = false;
let isUserDragging = false;
let hintTween = null;

function getBounds() {
  const visualAdjust = 15;

  return {
    minX: -bladeOffset,
    maxX: frame.offsetWidth - bladeOffset - visualAdjust
  };
}

function updateCleanState() {
  const frameRect = frame.getBoundingClientRect();
  const squeegeeRect = squeegee.getBoundingClientRect();

  let wipeX = (squeegeeRect.left + bladeOffset) - frameRect.left;
  wipeX = Math.max(0, Math.min(frameRect.width, wipeX));

  const hiddenRight = frameRect.width - wipeX;
  reveal.style.clipPath = `inset(0 ${hiddenRight}px 0 0)`;

  glow.style.opacity = "1";
  glow.style.transform = `translateX(${wipeX - 9}px)`;
}

function hideGlow() {
  glow.style.opacity = "0";
}

function playAutoWipe() {
  if (hintPlayed || isUserDragging) return;

  hintPlayed = true;

  const bounds = getBounds();
  const endX = bounds.maxX - 5;

  hintTween = gsap.timeline();

  hintTween.to(squeegee, {
    x: endX,
    duration: 1.8,
    ease: "power1.inOut",
    onUpdate: updateCleanState,
    onComplete: () => {
      hideGlow();
    }
  });
}

// Start dirty on load, then auto-wipe when visible
gsap.set(squeegee, { x: -bladeOffset });
requestAnimationFrame(updateCleanState);
hideGlow();

const dragger = Draggable.create(squeegee, {
  type: "x",
  bounds: getBounds(),
  onPress() {
    isUserDragging = true;

    if (hintTween) {
      hintTween.kill();
      hintTween = null;
    }
  },
  onDrag: updateCleanState,
  onRelease() {
    isUserDragging = false;
    hideGlow();
  }
})[0];

// Auto-play when the window comes into view
const windowObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      playAutoWipe();
      windowObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.45
});

if (frame) {
  windowObserver.observe(frame);
}

window.addEventListener("resize", () => {
  const bounds = getBounds();
  dragger.applyBounds(bounds);

  let currentX = gsap.getProperty(squeegee, "x");

  if (currentX < bounds.minX) currentX = bounds.minX;
  if (currentX > bounds.maxX) currentX = bounds.maxX;

  gsap.set(squeegee, { x: currentX });
  updateCleanState();
  hideGlow();
});

gsap.from(".magic-clean-card", {
  y: 30,
  opacity: 0,
  duration: 0.9,
  ease: "power2.out"
});

gsap.from(squeegee, {
  opacity: 0,
  duration: 0.8,
  ease: "power2.out",
  delay: 0.2
});
  window.addEventListener("load", () => {
    const headline = document.querySelector(".headline-sweep");
    if (!headline) return;

    setTimeout(() => {
      headline.classList.add("shine-active");
    }, 400);

    headline.addEventListener("animationend", (event) => {
      if (event.animationName === "textColorSweep") {
        headline.classList.remove("shine-active");
        headline.classList.add("shine-done");
      }
    }, { once: true });
  });

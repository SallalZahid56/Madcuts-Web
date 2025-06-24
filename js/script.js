function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  navLinks.classList.toggle('active');
}
 
// For videos section
const videoTrack = document.querySelector('.video-track');
const videoWrappers = document.querySelectorAll('.video-wrapper');
const videoWidth = videoWrappers[0].offsetWidth + 24; // 24px = spacing
const visibleItems = 4;

// Clone logic for infinite scroll
for (let i = 0; i < visibleItems; i++) {
  const cloneStart = videoWrappers[i].cloneNode(true);
  const cloneEnd = videoWrappers[videoWrappers.length - 1 - i].cloneNode(true);
  videoTrack.appendChild(cloneStart);
  videoTrack.insertBefore(cloneEnd, videoTrack.firstChild);
} 

let index = visibleItems;
const maxIndex = videoWrappers.length + visibleItems;

window.addEventListener("load", () => {
  videoTrack.scrollLeft = videoWidth * index;
});

function scrollCarousel(direction) {
  if (direction === 'right') {
    index++;
  } else {
    index--;
  }

  videoTrack.scrollTo({
    left: index * videoWidth,
    behavior: "smooth"
  });

  setTimeout(() => {
    if (index >= maxIndex) {
      index = visibleItems;
      videoTrack.scrollLeft = videoWidth * index;
    } else if (index < visibleItems) {
      index = videoWrappers.length;
      videoTrack.scrollLeft = videoWidth * index;
    }
  }, 400);
}



  // For progress bar
  document.querySelectorAll('.video-wrapper').forEach(wrapper => {
  const video = wrapper.querySelector('video');
  const progressBar = wrapper.querySelector('.progress-bar');

  video.addEventListener('timeupdate', () => {
    const percentage = (video.currentTime / video.duration) * 100;
    progressBar.value = percentage || 0;
  });

  progressBar.addEventListener('input', () => {
    video.currentTime = (progressBar.value / 100) * video.duration;
  });
});


// For settings and full screen width icons 
document.querySelectorAll('.video-wrapper').forEach(wrapper => {
  const video = wrapper.querySelector('video');
  const volumeBtn = wrapper.querySelector('.icon.volume');
  const fullscreenBtn = wrapper.querySelector('.icon.fullscreen');
  const settingsBtn = wrapper.querySelector('.icon.settings'); // if needed for future

  // Toggle mute
  volumeBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    volumeBtn.textContent = video.muted ? '🔇' : '🔈';
  });

  // Toggle fullscreen
  fullscreenBtn.addEventListener('click', () => {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  });
});


// For Question expand in FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('open');
    });
});





// For testimonial slider 
// For testimonial slider 
const testimonialTrack = document.querySelector('.testimonial-track');
const originalSlides = Array.from(document.querySelectorAll('.work-testimonial:not(.clone)'));
const testimonialDots = document.querySelectorAll('.testimonial-dots .dot');

let testimonialIndex = 1;
let testimonialSlides = [];
const slideGap = 32; // Matches CSS margin-right

function getSlideWidth() {
  return testimonialSlides[0].offsetWidth + slideGap;
}

function setTrackWidth() {
  const slideWidth = getSlideWidth();
  testimonialTrack.style.width = `${slideWidth * testimonialSlides.length}px`;
}

function moveToIndex(index, withTransition = true) {
  const slideWidth = getSlideWidth();
  testimonialTrack.style.transition = withTransition ? 'transform 0.5s ease-in-out' : 'none';
  testimonialTrack.style.transform = `translateX(-${slideWidth * index}px)`;
}

function updateActiveTestimonial() {
  testimonialSlides.forEach(slide => slide.classList.remove('active'));
  const center = testimonialSlides[testimonialIndex + 1]; // offset due to prepended clone
  if (center) center.classList.add('active');

  testimonialDots.forEach(dot => dot.classList.remove('active'));
  testimonialDots[(testimonialIndex - 1 + testimonialDots.length) % testimonialDots.length].classList.add('active');
}

function handleInfiniteLoop() {
  const total = originalSlides.length;

  if (testimonialIndex === 0) {
    testimonialIndex = total;
    moveToIndex(testimonialIndex, false);
  } else if (testimonialIndex === total + 1) {
    testimonialIndex = 1;
    moveToIndex(testimonialIndex, false);
  }

  updateActiveTestimonial();
}

function moveTestimonial(direction) {
  testimonialIndex += direction === 'next' ? 1 : -1;
  moveToIndex(testimonialIndex, true);

  testimonialTrack.addEventListener('transitionend', handleInfiniteLoop, { once: true });
}

function setupTestimonials() {
  // Clear previous clones
  testimonialTrack.querySelectorAll('.clone').forEach(el => el.remove());

  // Clone
  const first = originalSlides[0].cloneNode(true),
        last  = originalSlides[originalSlides.length - 1].cloneNode(true);
  first.classList.add('clone');
  last.classList.add('clone');

  // Insert clones
  testimonialTrack.insertBefore(last, testimonialTrack.firstChild);
  testimonialTrack.appendChild(first);

  testimonialSlides = Array.from(document.querySelectorAll('.work-testimonial'));
  setTrackWidth();
  moveToIndex(testimonialIndex, false);
  updateActiveTestimonial();
}


// Dot click navigation
testimonialDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    testimonialIndex = i + 1;
    moveToIndex(testimonialIndex);
    updateActiveTestimonial();
  });
});

// Auto-slide every 8 seconds
setInterval(() => moveTestimonial('next'), 8000);

// On load
window.addEventListener('load', setupTestimonials);

// On resize
window.addEventListener('resize', () => {
  setTrackWidth();
  moveToIndex(testimonialIndex, false);
});



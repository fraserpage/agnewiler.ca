// ----------------------
// Nav menu underline effect
// Adapted from https://webdesign.tutsplus.com/tutorials/how-to-build-a-shifting-underline-hover-effect-with-css-and-javascript--cms-28510
// ----------------------

const target = document.querySelector(".target");
const links = document.querySelectorAll("#desktop-nav a");
var currentPage = document.querySelector("#desktop-nav a.current-page");
const header = document.getElementById("header");
const nav = document.getElementById("desktop-nav");
const colors = [ "#C673A0", "#73C699", "#EDD377"];

function animateUnderline(elem, recalculate){
  // Abort if the element passed doesn't exist or the mobile nav is currently showing
  if(elem !== null && !document.body.classList.contains("mobile-nav")){  
    // Only animate the underline if:
    // -- the element is not already underlined i.e. 'active'
    // -- or (because the page width has changed) we need to recalculate the current active underline
    if ( recalculate || !elem.classList.contains("active") ) {

      for (let i = 0; i < links.length; i++) {
        if (links[i].classList.contains("active")) {
          links[i].classList.remove("active");
        }
        links[i].style.opacity = "0.75";
      }

      elem.classList.add("active");
      elem.style.opacity = "1";

      const rect = elem.getBoundingClientRect();
      const { width, height, left, top } = rect 
      const color = colors[Math.floor(Math.random() * colors.length)];

      target.style.width = `${width}px`;
      target.style.height = `${height}px`;
      target.style.left = `${left}px`;
      target.style.top = "14px";
      target.style.borderColor = color;
      target.style.transform = "none";
    }
  }
}

for (let i = 0; i < links.length; i++) {
  links[i].addEventListener("mouseenter", function(){
    animateUnderline(this, false);
  });
}

nav.addEventListener("mouseleave", function(){
    animateUnderline(currentPage, false);
});

window.addEventListener('load',  function(){
    animateUnderline(currentPage, false);
});

var underlineResizeTimerDone = true;
window.addEventListener('resize',  function(){

  if (underlineResizeTimerDone == true){
    underlineResizeTimerDone = false;

    setTimeout(function(){
      animateUnderline(currentPage, true);
      underlineResizeTimerDone = true;
    }, 100);
  }
    
});

// ----------------------
// Animate nav underline on scroll
// -- Uses the 'navList' array that is set in footer.njk
// -- 'navList' is only set on home
// ----------------------
if (typeof navList !== 'undefined') {
  let underlineScrollObserver = new IntersectionObserver(onIntersection, {
    // If the section crosses the 40% mark in the viewport call the function 
    rootMargin: '-39% 0% -60%',
    threshold: 0
  });

  navList.forEach(navItem => {
    underlineScrollObserver.observe(document.querySelector(navItem));
  });

  function onIntersection(entries) {
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0) {
        setUnderline(entry.target.id);
      }
    });
  }

  var currentSection = "";

  function setUnderline(id){
    if (currentSection !== id){
      currentSection = id;
      currentPage = document.querySelector("#desktop-nav a[href='#"+currentSection+"']");
      animateUnderline(currentPage, false);
    }
  }
}

// ----------------------
// Show the navbar on scroll
// ----------------------
//Using presence of 'navList' variable to do this only on the home page
if (typeof navList !== 'undefined') {
  let firstSection = document.querySelector('main :first-child');
  // Threshold is % of way from bottom of top image section
  const threshold = 0.7;
  let observer = new IntersectionObserver((entries, observer) => { 
    entries.forEach(entry => {
      if(entry.intersectionRatio <= threshold ){
          header.classList.add('show-header');
      }
      else {
        header.classList.remove('show-header'); 
      }
    });
  }, {threshold: threshold});
  observer.observe(firstSection);
}


 // ----------------------
 // Scroll to all anchor links
 // ----------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();

      var element = document.querySelector(this.getAttribute('href'))
      var headerOffset = header.offsetHeight;
      var elementPosition = element.getBoundingClientRect().top;
      var offsetPosition = elementPosition - headerOffset;

      window.scrollBy({
        top: offsetPosition,
        behavior: "smooth"
   });
  });
});

// ----------------------
 // Throttle helper function
 // ----------------------
function throttle(fn, wait) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn();
      time = Date.now();
    }
  }
}

// ----------------------
// Mobile Nav
// - Show and hide mobile nav based on when main nav breaks across lines.
// ----------------------
window.addEventListener('load',  function(){
  mobileMenu()
});

var mobileMenuResizeTimerDone = true;
window.addEventListener('resize',  function(){

  if (mobileMenuResizeTimerDone == true){
    mobileMenuResizeTimerDone = false;

    setTimeout(function(){
      mobileMenu()
      mobileMenuResizeTimerDone = true;
    }, 100);
  }
    
});

function mobileMenu() {
  var a = document.querySelector("#desktop-nav ul").offsetHeight
    , b = document.querySelector("#desktop-nav li").offsetHeight
  if (a > b){
    document.body.classList.add("mobile-nav") 
  }
  else{
    document.body.classList.remove("mobile-nav");
    animateUnderline(currentPage, false);
  }
}

//If clicking on a mobile nav link, close the nav
document.querySelectorAll('#mobile-nav a').forEach(navlink => {
  navlink.addEventListener('click', function (e) {

    document.body.classList.remove("nav-open");
    
  });
});


// ----------------------
//Click on mobile nav button
// ----------------------
document.getElementById("mobile-nav-toggle").addEventListener('click',function(){

  if (document.body.classList.contains("nav-open") ){
    this.setAttribute("aria-expanded","false");
    document.body.classList.remove("nav-open");
  }
  else{
    this.setAttribute("aria-expanded","true");
    document.body.classList.add("nav-open");
  }
});

// ----------------------
// Slideshow
// ----------------------


const slideshows = document.getElementsByClassName('slideshow');
const images = document.querySelectorAll('img[data-loaded="false"]');
var slideshowTimeouts = {};

window.addEventListener('load',  function(){
  loadImages(images);
  startSlideShows(slideshows)
});

function startSlideShows(slideshows){
  for (let i = 0; i < slideshows.length; i++) {
    playPauseSlideshow(slideshows[i]);

    slideshows[i].querySelector('.play-pause').addEventListener('click',function(){
      playPauseSlideshow(slideshows[i]);
    });

    slideshows[i].querySelector('.next').addEventListener('click',function(){
      clearTimeout(slideshowTimeouts[slideshows[i].dataset.id]);
      changeSlide(slideshows[i]);
    });

    slideshows[i].querySelector('.prev').addEventListener('click',function(){
      clearTimeout(slideshowTimeouts[slideshows[i].dataset.id]);
      changeSlide(slideshows[i], -1);
    });
  }
}
function startSlideShow(slideshow, imediatelyChange = false){
  if (imediatelyChange){
    changeSlide(slideshow);
  }
  else{
    let timing = parseInt(slideshow.dataset.timing) * 1000;
    slideshowTimeouts[slideshow.dataset.id] = setTimeout(function(){
      changeSlide(slideshow);
    }, timing);
  }
}

function playPauseSlideshow(slideshow, imediatelyChange = false){
  //Pause the slideshow
  if (slideshow.classList.contains('playing')){
    clearTimeout(slideshowTimeouts[slideshow.dataset.id]);
    slideshow.classList.remove('playing');
    slideshow.querySelector('.play-pause .label').innerHTML = "Play"
  }
  //Play the slideshow
  else{
    slideshow.classList.add('playing');
    slideshow.querySelector('.play-pause .label').innerHTML = "Pause"
    startSlideShow(slideshow, imediatelyChange);
  }
}

function changeSlide(slideshow, dir = 1, timing = false){
  if (!timing){
    var timing = parseInt(slideshow.dataset.timing) * 1000;
  }
  let slides = slideshow.getElementsByTagName('img');
  let newSlide = parseInt(slideshow.dataset.currentSlide) + dir;
  if ( newSlide >= slides.length){
    newSlide = 0;
  }
  if ( newSlide < 0 ){
    newSlide = slides.length - 1;
  }
  slideshow.dataset.currentSlide = newSlide;

  for (let i = 0; i < slides.length; i++) {
    if (i == newSlide && slides[i].dataset.loaded){
      slides[i].classList.add('current-slide');
    }
    else{
      slides[i].classList.remove('current-slide');
    }
  }
  if (slideshow.classList.contains('playing')){
    slideshowTimeouts[slideshow.dataset.id] = setTimeout( function(){
      changeSlide(slideshow, 1, timing)
    }, timing);
  }
}


// Lazy load slideshow images

function fetchImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = resolve;
    image.onerror = reject;
  });
}

function preloadImage(image) {
  const src = image.dataset.src;
  if (!src) {
    return;
  }
  return fetchImage(src).then(() => { applyImage(image, src); });
}

function loadImages(images) {
  for (let i = 0; i < images.length; i++) {
    let image = images[i];
    preloadImage(image);
  }
}

function applyImage(img, src) {
  img.dataset.loaded = true;
  img.src = src;
}

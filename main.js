import "./style.css";

// query selector

const slideBtns = document.querySelectorAll("[data-slideBtn]");
const sliderContainer = document.querySelector("[data-slideContainer]");
const slides = [...document.querySelectorAll("[data-slide]")];
const contactForm = document.querySelector("#contact-form");
const contactBtn = document.querySelector("#contact-btn");
const contactInput = document.querySelector("#email");
// variable

let currentIndex = 0;
let isMoving = false;

// handleSlideBtnClick

function handleSlideBtnClick(e) {
  if (isMoving) return;
  isMoving = true;
  e.currentTarget.id === "prev" ? currentIndex-- : currentIndex++;
  // add custom event
  sliderContainer.dispatchEvent(new Event("sliderMove"));
}

// btn event on click

slideBtns.forEach((btn) => btn.addEventListener("click", handleSlideBtnClick));

// remove disable atribute && add disable atribute
const removeDisabledAttribute = (els) =>
  els.forEach((el) => el.removeAttribute("disabled"));
const addDisabledAttribute = (els) =>
  els.forEach((el) => el.setAttribute("disabled", "true"));
// slideMovie event

sliderContainer.addEventListener("sliderMove", () => {
  sliderContainer.style.transform = `translateX(-${
    currentIndex * slides[0].clientWidth
  }px)`;
  removeDisabledAttribute(slideBtns);
  currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
});

// endTransiton evenet
sliderContainer.addEventListener("transitionend", () => (isMoving = false));

// disable drag

document
  .querySelectorAll("[data-slide] img")
  .forEach((img) => (img.ondragstart = () => false));

// intersection observer for slider
const slideObserver = new IntersectionObserver(
  (slide) => {
    if (slide[0].isIntersecting) {
      addDisabledAttribute([slideBtns[1]]);
    }
  },
  { threshold: 0.75 }
);

slideObserver.observe(slides[slides.length - 1]);

// options for submint btn

const contactBtnOptions = {
  pending: `
    <svg xmlns="http://www.w3.org/2000/svg" class="animate-spin" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
    <span class="uppercase tracking-wide animate-pulse">
    Sending...
    </span>
  `,
  success: `
  <span class="uppercase tracking-wide">
    Thank you!
    </span>
    <span class="uppercase tracking-wide">
    ✌️
    </span>`,
};

// postEmailToDataBase

function postEmailToDataBase(userEmail) {
  console.log(`Your email address is ${userEmail}`);
  return new Promise((resolve) => setTimeout(resolve, 2000));
}

// handleSubmintForm
async function handleFormSubmint(e) {
  e.preventDefault();
  addDisabledAttribute([contactForm, contactBtn]);
  contactBtn.innerHTML = contactBtnOptions.pending;
  const userEmail = contactInput.value;
  contactInput.style.display = "none";
  await postEmailToDataBase(userEmail);
  contactBtn.innerHTML = contactBtnOptions.success;
}

contactForm.addEventListener("submit", handleFormSubmint);

// fadeUp observer

const fadeUpObserver = new IntersectionObserver(
  (itemToWatch) => {
    itemToWatch.forEach((item) => {
      if (item.isIntersecting) {
        item.target.classList.add("faded");
        fadeUpObserver.unobserve(item.target);
        item.target.addEventListener(
          "transitionend",
          () => {
            item.target.classList.remove("fade-up", "faded");
          },
          { once: true }
        );
      }
    });
  },
  { threshold: 0.6 }
);

document.querySelectorAll(".fade-up").forEach((item) => {
  fadeUpObserver.observe(item);
});

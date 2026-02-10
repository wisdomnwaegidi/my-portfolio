import { projects } from "./projects.js";

document.addEventListener("DOMContentLoaded", function () {
  ("use strict");

  ////////selectors/////
  const nav = document.querySelector("header");
  const showMoreButton = document.querySelector(".see-more");
  const moredetailsContainer = document.querySelector(".more-details");
  const showMoreBtn = document.querySelector(".showMore");
  const projectContainer = document.querySelector(".project__sub__container");
  const message = document.querySelector(".message");
  const messageOverlay = document.querySelector(".message-overlay");
  const ul = document.querySelector(".project__sub__container");
  const jobTabs = document.querySelector(".job-tabs");
  const jobDescriptionContent = document.querySelectorAll(
    ".job__description-content",
  );

  const allScrollButton = document.querySelectorAll(".scroll-button");
  const allSection = document.querySelectorAll(".section");
  const headerSection = document.querySelector("#header");
  /////////////

  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  /////// close when clicking a nav link  ///////
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function closeMenu() {
    hamburger.classList.remove("active");
    navLinks.classList.remove("active");
    document.body.style.overflow = "auto";
  }

  ///// scroll bar functionality ///////
  const disableScroll = function () {
    document.body.style.overflowY = "hidden";
  };

  const enableScroll = function () {
    document.body.style.overflowY = "auto";
  };
  ///// scroll bar functionality ///////

  //add event handler to each of the buttons in the tab by using event delegation, i.e targeting the parent element
  jobTabs.addEventListener("click", function (e) {
    const clicked = e.target.closest(".button__tab");
    if (!clicked) return;

    //activate content area
    //remove all active class on the element
    jobDescriptionContent.forEach((description) => {
      description.classList.remove("describe--active");
    });
    //link
    document
      .querySelector(`.job__description--${clicked.dataset.tab}`)
      .classList.add("describe--active");
  });

  /////// sticky navigation 1 ///////
  const navheight = Math.round(nav.getBoundingClientRect().height);

  const observerFunc = function (entries) {
    const [entry] = entries;

    // Check if screen width is greater than 600px (37.5em)
    const isSmallScreen = window.innerWidth <= 600;

    if (!entry.isIntersecting && !isSmallScreen) {
      nav.classList.add("sticky");
    } else {
      nav.classList.remove("sticky");
    }
  };

  const observerOps = {
    root: null,
    threshold: 0,
    rootMargin: `-${navheight}px`,
  };

  const observer = new IntersectionObserver(observerFunc, observerOps);

  observer.observe(headerSection);

  /////// find out more scroll ///////
  allScrollButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const targetId = button.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
  ////////////////////////

  //////// reveal sections  on scroll /////////////
  const revealFunct = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) {
      return;
    }
    entry.target.classList.remove("section-hidden");
    observer.unobserve(entry.target);
  };
  const sectionObj = {
    root: null,
    threshold: 0.2,
  };

  let sectionObserver = new IntersectionObserver(revealFunct, sectionObj);

  allSection.forEach((sections) => {
    sections.classList.add("section-hidden");
    sectionObserver.observe(sections);
  });
  //////////////////////

  /////// show more details functionality /////
  let show = true;
  moredetailsContainer.style.display = "none";

  const toggleShow = function () {
    if (show === true) {
      moredetailsContainer.style.display = "block";

      showMoreButton.style.display = "none";
      show = false;
    } else {
      moredetailsContainer.style.display = "none";
      showMoreButton.textContent = `See more`;
      show = true;
    }
  };
  showMoreButton.addEventListener("click", toggleShow);
  ////////////////////////

  ////////// projects //////////
  const projectMapped = projects.map(function (project) {
    return `
      <li class=""project_list>
                        <div class="project1 project" data-url="${
                          project.projectLink
                        }">
                            <div class="icon-container">
                                <div class="project-folder">
                                    <svg class="file-icon">
                                        <use xlink:href="./images/sprite.svg#icon-folder-open-o"></use>
                                    </svg>
                                </div>
                                
                                <div class="project-links">
                                    <a href="${
                                      project.githubLink
                                    }" class="github-link" target="_blank">
                                        <svg class="link-icon">
                                            <use xlink:href="./images/sprite.svg#icon-github">
                                            </use>
                                        </svg>
                                    </a>
                                    
                                    ${
                                      project.projectLink &&
                                      `<a
                                          href="${project.projectLink}"
                                          class="external-link"
                                          target="_blank"
                                        >
                                          <svg class="link-icon">
                                            <use xlink:href="./images/sprite.svg#icon-external-link"></use>
                                          </svg>
                                        </a>`
                                    }
                                    
                                </div>
                            </div>
                            <div class="project__details">
                                <h2 class="heading-portfolio">
                                    <a href="${
                                      project.projectLink
                                    }" target="_blank"> ${project.projectTitle} </a>
                                </h2>
                                <p class="heading_brief">${
                                  project.projectDescription
                                }</p>
                            </div>
                            <div class="project__tools">
                                ${project.projectTools
                                  .map((tool) => `<span>${tool}</span>`)
                                  .join(" ")}
                            </div>
                        </div>
                        <!--  -->
                    </li>
  `;
  });

  let currCounter = 0;
  showMoreBtn.addEventListener("click", function () {
    const showResult = 3;
    for (let index = 0; index < showResult; index++) {
      if (currCounter + index < projectMapped.length) {
        projectContainer.insertAdjacentHTML(
          "beforeend",
          projectMapped[index + currCounter],
        );
      }
      if (currCounter > projectMapped.length) {
        message.querySelector(".message__content").textContent =
          `Oops!, That's all the project I have for now.
            More projects coming soon!👨🏼‍💻😉`;
        message.classList.remove("hidemessage");
        messageOverlay.classList.add("message-overlay");
        messageOverlay.classList.remove("hideoverlay");
        disableScroll();
        return;
      }
    }
    currCounter += showResult;
    let closebtn = message.querySelector(".btn");
    closebtn.addEventListener("click", function () {
      message.classList.add("hidemessage");
      messageOverlay.classList.add("hideoverlay");
      enableScroll();
    });
  });
  ////////////////////////

  ///////// project sub links
  ul.addEventListener("click", function (e) {
    let clickedElement = e.target.closest(".project");

    if (clickedElement) {
      let url = clickedElement.getAttribute("data-url");
      window.open(url, "_blank");
    }
  });
  //////////////////////
});

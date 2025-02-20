console.log("this code is working");

///////////////////////////////
/// REGISTER GSAP PLUGINS
///////////////////////////////

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(CustomEase);
  gsap.registerPlugin(SplitText);
  //   gsap.registerPlugin(DrawSVGPlugin);
  // gsap code here!
});

//////////////////////////////
/// SETUP LENIS
///////////////////////////////

const lerpValue = 0.1; // Set your custom lerp value here
const lenis = new Lenis({ lerp: lerpValue });

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

$("[data-lenis-start]").on("click", function () {
  lenis.start();
});
$("[data-lenis-stop]").on("click", function () {
  lenis.stop();
});
$("[data-lenis-toggle]").on("click", function () {
  $(this).toggleClass("stop-scroll");
  if ($(this).hasClass("stop-scroll")) {
    lenis.stop();
  } else {
    lenis.start();
  }
});

///////////////////////////////
/// GSAP DEFAULTS
///////////////////////////////

gsap.defaults({
  ease: "power3.out",
  duration: 0.2,
});

CustomEase.create(
  "customBack",
  "M0,0 C0.126,0.382 0.139,1.139 0.352,1.197 0.668,1.282 0.862,1.11 1,1"
);

///////////////////////////////
/// BOUTON DÉCOUVRIR SCROLL NEXT SECTION
///////////////////////////////

document.querySelectorAll(".next_section_wrap").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior

    // Find the current section
    const currentSection = this.closest("section");

    // Find the next section
    const nextSection = currentSection.nextElementSibling;

    if (nextSection && nextSection.tagName.toLowerCase() === "section") {
      // Scroll to the next section
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  });
});

///////////////////////////////
/// DÉCOUVRIR MOUSE ENTER
///////////////////////////////

const nextSectionWrapper = document.querySelectorAll(".next_section_wrap");

nextSectionWrapper.forEach(function (el) {
  let underline = el.querySelector(".next_section_underline");
  let tlNextSection = gsap.timeline({ paused: true });

  tlNextSection.from(underline, {
    width: 0,
  });

  el.addEventListener("mouseenter", function () {
    tlNextSection.play(); //  tl_in on mouseenter
  });

  el.addEventListener("mouseleave", function () {
    tlNextSection.reverse(); // tl_out on mouseleave
  });
});

///////////////////////////////
/// CREATE SVG ELEMENTS
///////////////////////////////
$(".svg_code").each(function (index) {
  let svgCode = $(this).text();
  $(svgCode).insertAfter($(this));
});

///////////////////////////////
/// ARTICLE FEATURED MOUSE ENTER
///////////////////////////////

const articleFeaturedWrap = document.querySelectorAll(
  ".grid_item_link"
);

articleFeaturedWrap.forEach(function (el) {
  let img = el.querySelector(".g_visual_img");
  let overlay = el.querySelector(".g_visual_overlay");
  let line = el.querySelector(".nav_link_line");
  let tlArticleFeatured = gsap.timeline({ paused: true });

  tlArticleFeatured
  .to(img,{
      scale: 1.1,
      ease: "power4.out",
      duration: 1,
    })
  .to(overlay,{
      opacity: .2,
      duration: .3,
    }, "<")
  .to(line,{
      width: "100%",
    }, "<")
    
    ;

  el.addEventListener("mouseenter", function () {
    tlArticleFeatured.play(); //  tl_in on mouseenter
  });

  el.addEventListener("mouseleave", function () {
    tlArticleFeatured.timeScale(2).reverse(); // tl_out on mouseleave
  });
});


///////////////////////////////
/// SVG BLOB IN THE BACKGROUND
///////////////////////////////

// Select all SVG blobs
const blobs = document.querySelectorAll(".gold_blob_svg");

// Loop through each blob and animate its position, scale, and rotation
blobs.forEach((blob) => {
  // Generate random x and y positions
  const xPos = gsap.utils.random(0, window.innerWidth * 2);
  const yPos = gsap.utils.random(0, window.innerHeight);

  // Generate random scale
  const scale = gsap.utils.random(0.5, 1);

  // Generate random rotation
  const rotation = gsap.utils.random(0, 45);

  // Generate random opacity
  // const opacity = gsap.utils.random(0.1, 0.4);

  // gsap.set(blob, {
  //   opacity: opacity,
  // });

  // Animate the blob to the random position, scale, and rotation
  gsap.to(blob, {
    duration: 60,
    x: xPos,
    y: yPos,
    scale: scale,
    rotation: rotation + 360, // Rotate back to initial rotation
    ease: "linear",
    repeat: -1, // Repeat the animation indefinitely
    yoyo: true, // Reverse the animation
    repeatDelay: gsap.utils.random(0, 5), // Random delay between repeats
  });
});


///////////////////////////////
/// HOME STATEMENT SCROLL TRIGGER
///////////////////////////////

let tlStatement = gsap.timeline({ paused: true });
let statementSplit = new SplitText(".statement_text_wrap p", {
  type: "words,lines",
  // type: "words",
  //type: "chars",
});

tlStatement
    .from(".statement_line", {
      height: 0,
      })
    .from(statementSplit.words, {
      // opacity: 0,
      y: 100,
      duration: 1,      
      stagger: 0.02,
    }, '<')
;

ScrollTrigger.create({
  trigger: ".statement_wrap", // Element that triggers the animation
  start: "top center",
  // markers: true,
  animation: tlStatement, // Animation to play
   // scrub: true, // Smooth scrolling effect
  toggleActions: "play complete play reverse",
});


///////////////////////////////
/// NAV DROPDOWN OPEN
///////////////////////////////

const navDropdownWrap = document.querySelectorAll(".link_dropdown_item_wrap");
const timelines = [];

// Loop through each element
navDropdownWrap.forEach(function (el) {
  let title = el.querySelector(".link_dropdown_title");
  let chevron = el.querySelector(".link_dropdown_chevron");
  let content = el.querySelector(".link_dropdown_content");

  // Create a timeline for each dropdown
  let tlNavDropdownWrap = gsap.timeline({ paused: true });

  // Add animations to the timeline
  tlNavDropdownWrap
    .from(content, {
      display: "none",
    })
    .from(content, {
      height: 0,
    }, "<")
    .from(el, {
      gap: 0,
    }, "<")
    .to(chevron, {
      rotate: 90,
    }, "<");

  // Determine if this dropdown should be open by default
  const isOpenByDefault = el.hasAttribute("data-open");

  // Store the timeline and state in an array
  timelines.push({
    timeline: tlNavDropdownWrap,
    isOpen: isOpenByDefault, // Set initial state based on attribute
  });

  // Open the dropdown on load if it has the attribute
  if (isOpenByDefault) {
    tlNavDropdownWrap.play();
  }

  // Add click event listener
  el.addEventListener("click", function () {
    const current = timelines.find((tlObj) => tlObj.timeline === tlNavDropdownWrap);

    if (!current.isOpen) {
      // If the current timeline is not open (closed), reverse all other timelines
      timelines.forEach((tlObj) => {
        if (tlObj.isOpen && tlObj.timeline !== tlNavDropdownWrap) {
          tlObj.timeline.reverse();
          tlObj.isOpen = false; // Set their state to closed
        }
      });

      // Play the clicked timeline and set its state to open
      current.timeline.play();
      current.isOpen = true;
    } else {
      // If the current timeline is open, reverse it and set its state to closed
      current.timeline.reverse();
      current.isOpen = false;
    }
  });
});


///////////////////////////////
/// LINKS WITH LINE
///////////////////////////////

function activateNavLinks() {
  const navLinkWrapper = document.querySelectorAll(".nav_link_item, .link_dropdown_title_link");

  navLinkWrapper.forEach(function (el) {
    let line = el.querySelector(".nav_link_line");
    let tlNavLink = gsap.timeline({ paused: true });

    tlNavLink.to(line, {
      width: "100%",
    });

    el.addEventListener("mouseenter", function () {
      tlNavLink.play(); // tl_in on mouseenter
    });

    el.addEventListener("mouseleave", function () {
      tlNavLink.reverse(); // tl_out on mouseleave
    });
  });
}

// Initial check for screen size
if (window.innerWidth > 991) {
  activateNavLinks();
}

// Re-check on window resize
window.addEventListener("resize", function () {
  if (window.innerWidth > 991) {
    activateNavLinks();
  }
});



///////////////////////////////
/// ANIMATION TO OPEN NAV LEFT
///////////////////////////////

const leftNavOpen = document.querySelectorAll(".nav_burger_wrap");
const leftNavClose = document.querySelectorAll(".nav_panel_bg, .left_panel_cross_svg");

let tlLeftPanel = gsap.timeline({ paused: true });

tlLeftPanel
    .to(".nav_left_panel_wrap", {
      display: "block",
    })

    .from(".left_panel_content", {
      x: "-100%",
    })
    .from(".nav_panel_bg.left", {
      opacity: 0,
      duation: .5,
    }, ">")
    .from(".left_panel_layout > *", {
      x: -20,
      opacity:0,
      duration: .6,
      stagger: .05,
    }, "<")

    ;

// Loop through each element to add click event listeners
leftNavOpen.forEach(function (element) {
  element.addEventListener("click", function () {
    tlLeftPanel.timeScale(1).play(); // Play the timeline on click
  });
});

leftNavClose.forEach(function (element) {
  element.addEventListener("click", function () {
    tlLeftPanel.timeScale(2).reverse(); // Reverse the timeline on click
  });
});



///////////////////////////////
/// ANIMATION TO OPEN NAV RIGHT
///////////////////////////////

const rightNavOpen = document.querySelectorAll(".nav_right_wrap a:nth-of-type(2)");
const rightNavClose = document.querySelectorAll(".nav_panel_bg, .right_panel_close_svg");

let tlRightPanel = gsap.timeline({ paused: true });

tlRightPanel
    .to(".nav_right_panel_wrap", {
      display: "flex",
    })

    .from(".right_panel_content", {
      x: "100%",
    })
    .from(".nav_panel_bg.right", {
      opacity: 0,
      duation: .5,
    }, ">")
    .from(".right_panel_links_wrap > *", {
      x: -20,
      opacity:0,
      duration: .6,
      stagger: .05,
    }, "<")
    .from(".right_panel_masterclass_wrap > *", {
      x: -20,
      opacity:0,
      duration: .6,
      stagger: .05,
    }, "<")

    ;

// Loop through each element to add click event listeners
rightNavOpen.forEach(function (element) {
  element.addEventListener("click", function () {
    tlRightPanel.timeScale(1).play(); // Play the timeline on click
  });
});

rightNavClose.forEach(function (element) {
  element.addEventListener("click", function () {
    tlRightPanel.timeScale(2).reverse(); // Reverse the timeline on click
  });
});


///////////////////////////////
/// NAVBAR ON SCROLL
///////////////////////////////

let lastScroll = 0;
let isScrollingUp = false;

window.addEventListener("scroll", function () {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && !isScrollingUp) {
    // User is scrolling down
    isScrollingUp = true;
    gsap.to(".navbar_wrap", { y: "-150%", duration: 0.5 });
  } else if (currentScroll < lastScroll && isScrollingUp) {
    // User is scrolling up
    isScrollingUp = false;
    gsap.to(".navbar_wrap", { y: 0, duration: 0.5 });
  }

  lastScroll = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
});


///////////////////////////////
/// HIDE NON FEATURED ARTICLES HOMEPAGE
///////////////////////////////
// function hideNonFeaturedArticles() {
//   const container = document.querySelector('.blog_featured_collection_list');
  
//   // Run only if the container exists and the screen width is below 767px
//   if (container && window.innerWidth < 767) {
//     // Select all direct child divs with the class 'grid_item_link'
//     const divs = container.querySelectorAll('.grid_item_link');

//     // Filter divs where data-featured is not true
//     const nonFeaturedDivs = Array.from(divs).filter(div => div.getAttribute('data-featured') !== 'true');

//     // Hide the last two non-featured divs if they exist
//     if (nonFeaturedDivs.length >= 2) {
//       nonFeaturedDivs.slice(-2).forEach(div => {
//         div.style.display = 'none';
//       });
//     }
//   }
// }

// // Run the function on page load and on window resize
// window.addEventListener('load', hideNonFeaturedArticles);
// window.addEventListener('resize', hideNonFeaturedArticles);



///////////////////////////////
/// SLIDER DECOUVREZ ADRESSES
///////////////////////////////


const sliders = document.querySelectorAll('.decouvrez_adresses_item');

sliders.forEach((slider) => {
  // Get the slider container, buttons, and text elements
  const sliderList = slider.querySelector('.decouvrez_adresses_collection_list');
  const arrows = slider.querySelectorAll('.slider_arrow_item_wrap');
  const texts = slider.querySelectorAll('.decouvrez_adresses_h4');

  // Set up initial state
  let currentIndex = 0;
  const items = sliderList.children;
  const totalItems = items.length;

  // Split the text for each `.decouvrez_adresses_h4` using GSAP SplitText
  const splitTexts = Array.from(texts).map(text => new SplitText(text, { type: 'words,chars' }));

  // Create a GSAP timeline for the slider animation
  const tlSlider = gsap.timeline({ paused: true });

  // Function to slide to a specific index
  function slideTo(index) {
    // Calculate the percentage to move based on the index
    const xPercent = -100 * index;

    // Animate the translation using GSAP
    tlSlider
      .to(sliderList, {
        xPercent: xPercent,
        duration: 0.6,
      })
      .fromTo(
        splitTexts[index].chars, // Animate each character separately
        { opacity: 0, y: 20 },   // Starting state of text animation
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.03 }, // Ending state of text animation with stagger
        '<' // Start text animation at the same time as slider animation
      )
      .play();
  }

  // Add event listeners for the slider navigation buttons
  arrows[0].addEventListener('click', () => {
    // Previous button
    currentIndex = currentIndex > 0 ? currentIndex - 1 : totalItems - 1;
    slideTo(currentIndex);
  });

  arrows[1].addEventListener('click', () => {
    // Next button
    currentIndex = currentIndex < totalItems - 1 ? currentIndex + 1 : 0;
    slideTo(currentIndex);
  });
});





///////////////////////////////
/// SCALE AND SHADOW SVG
///////////////////////////////

// Select all the elements with classA, classB, or classC
const hoveredSvg = document.querySelectorAll(".nav_burger_wrap, .right_panel_close_svg, .left_panel_cross_svg, .blog_share_item_wrap");

// Loop through each element and add event listeners for hover (mouseenter and mouseleave)
hoveredSvg.forEach(function (el) {
  el.addEventListener("mouseenter", function () {
    el.classList.add("u-filter-shadow"); // Add the drop shadow class on hover
    // el.classList.add('u-scale-up'); // Add the scale class on hover
  });

  el.addEventListener("mouseleave", function () {
    el.classList.remove("u-filter-shadow"); // Remove the drop shadow class when hover ends
    // el.classList.remove('u-scale-up'); // Remove the scale class when hover ends
  });
});


///////////////////////////////
/// TIMELINE CURSOR
///////////////////////////////


gsap.to(".timeline_active", {
  scrollTrigger: {
    trigger: ".timeline_layout",
    start: "top 50%",
    end: "bottom 50%",
    // markers: true,
    scrub: true,
  },
  ease: "none", // Ensures linear progression
  clipPath: "inset(0 0 0% 0)" // Animates from hidden to fully visible
});


gsap.from(".timeline_cursor", {
  scrollTrigger: {
    trigger: ".timeline_layout",
    start: "top 50%",    
    end: "90% 50%",      
    // markers: true,
    toggleActions: "play reverse play reverse"
  },
  scale: 0, // Scale up to 2 times its original size
  opacity:0,
  ease: "none" // Ensures a linear scaling effect
});


///////////////////////////////
/// TIMELINE COMPONENT FOR EACH
///////////////////////////////

const timelineItemWrap = document.querySelectorAll(".timeline_item_wrap");

// FOR EACH ODD ETAPE WRAPPER
timelineItemWrap.forEach(function (el) {  
    let year = el.querySelector(".timeline_year");
    let paragraph = el.querySelector(".timeline_paragraph");
    let yearSplitText = new SplitText(year, {
      // type: "lines",
      // type: "chars",
      type: "words, chars",
    });
    let paragraphSplitText = new SplitText(paragraph, {
      type: "lines", 
    });
    let tlTimelineItem = gsap.timeline({ paused: true });
  
    tlTimelineItem
      .from(yearSplitText.chars, {
        y: "2em",
        opacity: 0,
        duration: .8,
        stagger: 0.05,
        })
      .from(paragraphSplitText.lines, {
        y: "2em",
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        }, "<")
        ;
  
    ScrollTrigger.create({
      trigger: el, // Element that triggers the animation
      toggleActions: "play complete play reverse",
      start: "top 66%", // When to start the animation
      // end: 'bottom center', // When to end the animation
      // markers: true,
      animation: tlTimelineItem, // Animation to play
      // scrub: true, // Smooth scrolling effect
    });
  });


///////////////////////////////
/// SLIDER BIBLIOTHEQUE
///////////////////////////////

// // Initialize the slider
// let currentIndexBibli = 3; // Start at the first real item after the clones (adjust based on the number of clones)
// const itemsBibliotheque = document.querySelectorAll('.bibliotheque_collection_item');
// const totalItemsBibliotheque = itemsBibliotheque.length;

// // Number of items to clone for seamless effect
// const cloneCount = 3; // You can adjust this to 2 or 3 as needed

// // Clone the first and last few items
// const collectionList = document.querySelector('.bibliotheque_collection_list');
// for (let i = 0; i < cloneCount; i++) {
//   const firstClone = itemsBibliotheque[i].cloneNode(true); // Clone first items
//   const lastClone = itemsBibliotheque[totalItemsBibliotheque - 1 - i].cloneNode(true); // Clone last items
  
//   collectionList.appendChild(firstClone); // Append the cloned first items at the end
//   collectionList.insertBefore(lastClone, itemsBibliotheque[0]); // Prepend the cloned last items at the beginning
// }

// // Update items to include the clones
// const updatedItemsBibliotheque = document.querySelectorAll('.bibliotheque_collection_item');
// const updatedTotalItemsBibliotheque = updatedItemsBibliotheque.length;

// // Function to create the sliding animation
// function slideToIndex(index) {
//   gsap.to('.bibliotheque_collection_list', {
//     x: -index * updatedItemsBibliotheque[0].offsetWidth, // Moves the container based on item width
//     duration: 0.6, // Duration of the animation
//     // ease: 'power2.out', // Easing for the animation
//     onComplete: checkIndex // Check the index after animation completes
//   });
// }

// // Check if we need to jump to the real item after looping
// function checkIndex() {
//   if (currentIndexBibli < cloneCount) {
//     // If at the start clones, jump to the corresponding real items at the end
//     currentIndexBibli = totalItemsBibliotheque + currentIndexBibli;
//     gsap.set('.bibliotheque_collection_list', {
//       x: -currentIndexBibli * updatedItemsBibliotheque[0].offsetWidth
//     });
//   } else if (currentIndexBibli >= totalItemsBibliotheque + cloneCount) {
//     // If at the end clones, jump to the corresponding real items at the start
//     currentIndexBibli = currentIndexBibli - totalItemsBibliotheque;
//     gsap.set('.bibliotheque_collection_list', {
//       x: -currentIndexBibli * updatedItemsBibliotheque[0].offsetWidth
//     });
//   }
// }

// // Using nth-of-type to target the arrows
// document.querySelector('.slider_arrow_item_wrap:nth-of-type(1)').addEventListener('click', () => {
//   currentIndexBibli++;
//   slideToIndex(currentIndexBibli);
// });

// document.querySelector('.slider_arrow_item_wrap:nth-of-type(2)').addEventListener('click', () => {
//   currentIndexBibli--;
//   slideToIndex(currentIndexBibli);
// });

// // Initial setup position to start at the first real item
// gsap.set('.bibliotheque_collection_list', {
//   x: -currentIndexBibli * updatedItemsBibliotheque[0].offsetWidth
// });


///////////////////////////////
/// UNIVERSAL DRAGGABLE FUNCTION
///////////////////////////////

const initializeDraggableForElements = (wrapClass, listClass, itemClass, breakpoint = 0) => {
  const wraps = document.querySelectorAll(wrapClass);

  const initializeDraggable = (wrap) => {
    const listElement = wrap.querySelector(listClass);
    const items = wrap.querySelectorAll(itemClass);

    if (wrap && items.length) {
      const updateBoundsProcess = () => {
        const containerPWidth = wrap.clientWidth;
        const listPWidth = listElement.scrollWidth;

        // Calculate the padding from the container
        const containerStyles = window.getComputedStyle(wrap);
        const paddingLeft = parseFloat(containerStyles.paddingLeft);
        const paddingRight = parseFloat(containerStyles.paddingRight);

        // Adjust minX and maxX to consider the padding
        const minX = containerPWidth - listPWidth - paddingRight - paddingLeft; // Ensures we respect the right padding
        const maxX = 0; // Ensures we respect the left padding

        // Calculate snap points relative to the container, considering its padding
        const snapPoints = Array.from(items).map(item => paddingLeft - item.offsetLeft);

        // Make sure the draggable instance is recreated on resize
        Draggable.get(listElement)?.kill(); // Kill previous Draggable instance

        Draggable.create(listElement, {
          type: "x",
          edgeResistance: 0.5,
          bounds: { minX: minX, maxX: maxX }, // Correct the bounds for full drag range
          inertia: true,
          snap: {
            x: (value) => {
              let closest = snapPoints[0];
              snapPoints.forEach(point => {
                if (Math.abs(value - point) < Math.abs(value - closest)) {
                  closest = point;
                }
              });
              return closest;
            }
          }
        });
      };

      // Initialize draggable on page load
      updateBoundsProcess();

      // Update draggable bounds on window resize
      window.addEventListener('resize', updateBoundsProcess);
    }
  };

  const handleScreenResize = () => {
    wraps.forEach((wrap) => {
      const listElement = wrap.querySelector(listClass);
      if (window.innerWidth <= breakpoint) {
        initializeDraggable(wrap);
      } else {
        // Kill the draggable instance when screen size is above the breakpoint
        Draggable.get(listElement)?.kill();
      }
    });
  };

  // Initialize draggable on page load
  handleScreenResize();

  // Update draggable initialization on window resize
  window.addEventListener('resize', handleScreenResize);
};

// Example usage for the two cases:
initializeDraggableForElements(".bibliotheque_contain", ".bibliotheque_collection_list", ".bibliotheque_collection_item", 5000);
initializeDraggableForElements(".third_item_contain", ".third_item_layout", ".third_item_wrap", 767);
initializeDraggableForElements(".nav_careers_contain", ".nav_careers_layout", ".nav_link_item.careers", 478);
initializeDraggableForElements(".more_articles_contain", ".article_list_collection_list.more_articles_var", ".article_list_collection_item.u-flex-noshrink", 767);
initializeDraggableForElements(".all_resto_contain", ".all_resto_layout", ".all_resto_collection_item", Infinity);


///////////////////////////////
/// SCROLL TRIGGER FOR EACH BLOC 
///////////////////////////////

const blocWrap = document.querySelectorAll(".bloc_layout");

// FOR EACH ODD ETAPE WRAPPER
blocWrap.forEach(function (el) {
    let mediaWrap = el.querySelector(".bloc_media_wrap");
    let media = el.querySelector(".g_visual_wrap");
    let michelinStar = el.querySelectorAll(".michelin_star_item");
    let tlBloc = gsap.timeline({ paused: true });
  
    tlBloc
      .from(mediaWrap, {
        clipPath: "inset(100% 0 0 0)",
        opacity: 0,
        duration: 1,
        })
      .from(media, {
        scale: 1.3,
        duration: 1.5,
        }, "<")
      .from(michelinStar, {
        scale: 0,
        ease: "customBack",
        stagger: .25,
        }, "<")
      
        ;
  
    ScrollTrigger.create({
      trigger: el, // Element that triggers the animation
      toggleActions: "play complete play reverse",
      start: "top 66%", // When to start the animation
      // end: 'bottom center', // When to end the animation
      // markers: true,
      animation: tlBloc, // Animation to play
      // scrub: true, // Smooth scrolling effect
    });
  });



///////////////////////////////
/// SECTION PINNING
///////////////////////////////
  gsap.timeline({
    scrollTrigger: {
      trigger: ".pin_layout .boutique_promo_wrap:nth-of-type(1)",
      start: "top top",       // When the second section reaches the top of the viewport
      end: "bottom top",       // When the second section reaches the top of the viewport      
      pin: true,   // Pin the first section while the second one scrolls
      pinSpacing: false,
      // markers: true,
    }
  });


///////////////////////////////
/// REFRESH SCROLL TRIGGER
///////////////////////////////
  // Apply ScrollTrigger to all instances of ".u-refresh-scroll-trigger"
  gsap.utils.toArray(".u-refresh-scroll-trigger").forEach(trigger => {
    ScrollTrigger.create({
      trigger: trigger, // Apply to each .u-refresh-scroll-trigger
      start: "top bottom", // When the top of the trigger enters the bottom of the viewport
      onEnter: () => {
        console.log("Refresh trigger entered the viewport, refreshing ScrollTrigger");
        ScrollTrigger.refresh(); // Refresh ScrollTrigger
      }
    });
  });




///////////////////////////////
/// COLLABORATEUR ITEM MOUSE ENTER
///////////////////////////////

const collaborateurItemWrap = document.querySelectorAll(".nos_collaborateurs_collection_item");

collaborateurItemWrap.forEach(function (el) {
  let overlayWrap = el.querySelector(".collaborateur_overlay_wrap");
  let name = el.querySelector("p.u-weight-bold");
  let line = el.querySelector(".collaborateur_separator");
  let poste = el.querySelector(".collaborateur_poste");
  let tlCollaborateur = gsap.timeline({ paused: true });

  tlCollaborateur
        .from(overlayWrap,{
              opacity: 0,
              duration: .4,
            })
        .from(name,{
              y: 50,
              opacity: 0,
            }, "<.2")
        .from(poste,{
              y: 50,
              opacity: 0,
            }, "<")
        .from(line,{
              width: 0,
            }, "<")
            ;

  el.addEventListener("mouseenter", function () {
    tlCollaborateur.timeScale(1).play(); //  tl_in on mouseenter
  });

  el.addEventListener("mouseleave", function () {
    tlCollaborateur.timeScale(2).reverse(); // tl_out on mouseleave
  });
});

///////////////////////////////
/// REPLACE LINK IN THE JOB OFFERS
///////////////////////////////

var offerWrapper = document.querySelector('.offres_collection_list_wrapper');
if (offerWrapper) {
    offerWrapper.querySelectorAll('a').forEach(function(anchor) {
        var customHref = anchor.getAttribute('custom-href');
        if (customHref) {
            anchor.setAttribute('href', customHref);
        }
    });
}




///////////////////////////////
/// RESTAURANT ITEM ANIMATIONS
///////////////////////////////

const restaurantItemWrapper = document.querySelectorAll(".restaurant_list_collection_item");

restaurantItemWrapper.forEach(function (el) {
  let img = el.querySelector(".g_visual_img");
  let imgWrap = el.querySelector(".restaurant_list_img_wrap");
  let line = el.querySelector(".restaurant_name_line");
  let michelinStarItem = el.querySelectorAll(".michelin_star_item");
  let heading = el.querySelector(".restaurant_name_link_wrap");

  let tlRestaurantItemHover = gsap.timeline({ paused: true });
  let tlRestaurantItemScroll = gsap.timeline({ paused: true });

  tlRestaurantItemHover
        .to(img,{
            scale: 1.1,
            duration: .5,
          })

        .to(line,{
            width: "100%",
          }, "<")
          ;

  tlRestaurantItemScroll
        .from(imgWrap,{
            clipPath: "inset(100% 0 0 0)", //RECTANGLE REVEAL FROM BOTTOM
            opacity: 0,
            y: 100,
            duration: .5,
          })
        .from(michelinStarItem,{
            scale: 0,
            stagger: .5,
          })

          ;



        imgWrap.addEventListener("mouseenter", function () {
          tlRestaurantItemHover.timeScale(1).play(); //  tl_in on mouseenter
        });

        imgWrap.addEventListener("mouseleave", function () {
          tlRestaurantItemHover.timeScale(2).reverse(); // tl_out on mouseleave
        });
        
        heading.addEventListener("mouseenter", function () {
          tlRestaurantItemHover.timeScale(1).play(); //  tl_in on mouseenter
        });

        heading.addEventListener("mouseleave", function () {
          tlRestaurantItemHover.timeScale(2).reverse(); // tl_out on mouseleave
        });



        ScrollTrigger.create({
          trigger: el, // Element that triggers the animation
          toggleActions: "play complete play reverse",
          start: "top center", // When to start the animation
          // end: 'bottom center', // When to end the animation
          // markers: true,
          animation: tlRestaurantItemScroll, // Animation to play
          // scrub: true, // Smooth scrolling effect
        });
});



///////////////////////////////
/// COUNTER ANIMATION WITH SCROLLTRIGGER
///////////////////////////////

const counters = document.querySelectorAll(".counter_figure");

counters.forEach(function (counter) {
  let targetNumber = parseInt(counter.innerHTML, 10);

  // ScrollTrigger setup
  gsap.fromTo(counter, 
    { innerHTML: 0 }, // Start value
    {
      innerHTML: targetNumber, 
      duration: 3, 
      ease: "power1.out", 
      snap: { innerHTML: 1 }, // Snap to whole numbers
      scrollTrigger: {
        trigger: counter, // Trigger on each counter
        start: "top 80%", // When the counter enters the viewport
        toggleActions: "play none none none", // Play the animation on scroll
        once: true, // Only run the animation once
        // markers: true,
      },
      onUpdate: function() {
        counter.innerHTML = Math.ceil(counter.innerHTML); // Keep rounded to whole number
      }
    }
  );
});


///////////////////////////////
/// COLORED BLOC SCROLL TRIGGER
///////////////////////////////

const coloredBlocWrap = document.querySelectorAll(".colored_bg_text_wrap");

// FOR EACH ODD ETAPE WRAPPER
coloredBlocWrap.forEach(function (el) {
    let bloc = el.querySelector(".colored_bg_text_layout");
    let tlColoredBloc = gsap.timeline({ paused: true });
  
    tlColoredBloc
      .from(bloc, {
        clipPath: "inset(100% 0 0 0)", //RECTANGLE REVEAL FROM BOTTOM
        opacity: 0,
        y: 100,
        duration: .6,
        })
      
        ;
  
    ScrollTrigger.create({
      trigger: el, // Element that triggers the animation
      toggleActions: "play complete play reverse",
      start: "top 66%", // When to start the animation
      // end: 'bottom center', // When to end the animation
      // markers: true,
      animation: tlColoredBloc, // Animation to play
      // scrub: true, // Smooth scrolling effect
    });
  });



///////////////////////////////
/// DECOUVREZ METIERS ANIMATION
///////////////////////////////

const metierItem = document.querySelectorAll(".decouvrez_metiers_collection_item");

metierItem.forEach(function (el) {
  let fixedWrap = el.querySelector(".decouvrez_metiers_fixed_wrap");
  let metierItemContent = el.querySelector(".decouvrez_metiers_overlay");
  let playBtn = el.querySelector(".play_video_wrap");
  let img = el.querySelector(".g_visual_img");
  let imgOverlay = el.querySelector(".g_visual_overlay");
  let videoWrap = el.querySelector(".decouvrez_metiers_video_wrap");
  let bg = el.querySelector(".full_page_overlay");
  let closeBtn = el.querySelector(".video_close_wrap");

  let tlMetierClick = gsap.timeline({ paused: true });

  tlMetierClick
    .to(fixedWrap, {
      display: "flex",
    })
    .from(videoWrap, {
      y: "50vh",
      opacity: 0,
      duration: 0.4,
    }, "<")
    .from(bg, {
      opacity: 0,
      duration: 0.6,
    }, "<")
    .from(closeBtn, {
      scale: 0,
      ease: "customBack",
    }, "< .2");

  // Play the animation on element click
  metierItemContent.addEventListener("click", function (e) {
    e.stopPropagation(); // Stop event bubbling
    tlMetierClick.timeScale(1).play();
  });

  // Reverse the animation on background click
  bg.addEventListener("click", function (e) {
    e.stopPropagation(); // Stop event bubbling
    tlMetierClick.timeScale(2).reverse();
  });

  // Reverse the animation on close button click
  closeBtn.addEventListener("click", function (e) {
    e.stopPropagation(); // Stop event bubbling
    tlMetierClick.timeScale(2).reverse();
  });


  let tlMetierHover = gsap.timeline({ paused: true });

  tlMetierHover
  .to(img, {
    scale: 1.1,
    duration: .4,
  })
  .to(playBtn, {
    scale: 1.1,
    duration: .4,
  }, "<")
  .to(imgOverlay, {
    opacity: 0,    
  }, "<")
  ;

  metierItemContent.addEventListener("mouseenter", function () {
    tlMetierHover.timeScale(1).play(); //  tl_in on mouseenter
  });

  metierItemContent.addEventListener("mouseleave", function () {
    tlMetierHover.timeScale(2).reverse(); // tl_out on mouseleave
  });

  let tlMetierScroll = gsap.timeline({ paused: true });

  tlMetierScroll
  .from(metierItemContent, {
    clipPath: "inset(100% 0 0 0)", //RECTANGLE REVEAL FROM BOTTOM
    opacity: 0,
    y: 100,
    duration: .6,
  });

  ScrollTrigger.create({
    trigger: el, // Element that triggers the animation
    start: "top 66%",
    // markers: true,
    animation: tlMetierScroll, // Animation to play
     // scrub: true, // Smooth scrolling effect
    toggleActions: "play complete play reverse",
  });

});


///////////////////////////////
/// ANIMATIONS BLOG ARTICLE
///////////////////////////////

const blogArticleWrap = document.querySelectorAll(".article_list_collection_item");

blogArticleWrap.forEach(function (el) {
  let img = el.querySelector(".g_visual_img");
  let imgWrap = el.querySelector(".g_visual_wrap");
  let articleTitle = el.querySelector(".grid_item_h3");
  let articleTitleSplit = new SplitText(articleTitle, {
    type: "lines, words",    
  });
  let navLinkLine = el.querySelector(".nav_link_line");
  let date = el.querySelector(".article_date_p");
  let category = el.querySelector(".article_category_p");
  let tlBlogArticleHover = gsap.timeline({ paused: true });

      tlBlogArticleHover
          .to(img,{
            scale: 1.1,
            duration: .3,
          })
          .to(navLinkLine,{
            width: "100%",
          }, "<")
          
          ;

  el.addEventListener("mouseenter", function () {
    tlBlogArticleHover.play(); //  tl_in on mouseenter
  });

  el.addEventListener("mouseleave", function () {
    tlBlogArticleHover.reverse(); // tl_out on mouseleave
  });

  let tlBlogArticleScroll = gsap.timeline({ paused: true });
      
      tlBlogArticleScroll
      .from(imgWrap, {
        clipPath: "inset(50% 0 0 0)", //RECTANGLE REVEAL FROM BOTTOM"
        opacity: 0,
        y: 50,
        duration: .5,
      })

      .from(category,{
        x: -50,
        opacity: 0,
      }, "<.1")

      .from(date,{
        x: -50,
        opacity: 0,
      },"<.1")

      .from(articleTitleSplit.words, {
        y: 50,
        stagger: 0.02,
        duration: 1,
      }, "<")
      ;

      ScrollTrigger.create({
        trigger: el, // Element that triggers the animation
        start: "top 66%",
        // markers: true,
        animation: tlBlogArticleScroll, // Animation to play
         // scrub: true, // Smooth scrolling effect
        toggleActions: "play complete play reverse",
      });
});

  

///////////////////////////////
/// ANIMATION FOR SLIDERS
//////////////////////////////

// Select all slider wraps
const eventSliders = document.querySelectorAll(".bloc_slider_wrap");
const autoplayDelay = 3000; // Variable to store delay between each autoplay (in milliseconds)

eventSliders.forEach((slider, sliderIndex) => {
  console.log(`Initializing slider #${sliderIndex + 1}`);

  const items = slider.querySelectorAll(".bloc_slider_item_wrap");
  const arrows = slider.querySelectorAll(".slider_arrow_item_wrap"); // Select both arrows
  const prevArrow = arrows[0]; // First arrow for 'previous'
  const nextArrow = arrows[1]; // Second arrow for 'next'

  console.log(`Total items in slider: ${items.length}`);

  // Check if both arrows exist to avoid errors
  if (!prevArrow || !nextArrow) {
    console.error("Arrows not found in the slider");
    return; // Exit if arrows are not found
  }

  console.log('Previous and next arrows found');

  let currentIndex = 0;
  const totalItems = items.length;

  // Function to show the current slide
  function showSlide(index) {
    console.log(`Showing slide #${index + 1}`);
    
    // Translate all items, by shifting each one based on the index
    gsap.to(items, { xPercent: -100 * index, duration: 0.5, ease: "power1.out" });
  }

  // Click event for 'next' arrow
  nextArrow.addEventListener("click", () => {
    console.log('Next arrow clicked');
    currentIndex = (currentIndex + 1) % totalItems; // Go to the next slide, loop back to the first
    console.log(`Next slide index: ${currentIndex}`);
    showSlide(currentIndex);
  });

  // Click event for 'previous' arrow
  prevArrow.addEventListener("click", () => {
    console.log('Previous arrow clicked');
    currentIndex = (currentIndex - 1 + totalItems) % totalItems; // Go to the previous slide, loop back to the last
    console.log(`Previous slide index: ${currentIndex}`);
    showSlide(currentIndex);
  });

  // Initialize the slider to the first item
  console.log('Initializing first slide');
  showSlide(currentIndex);

  // Autoplay functionality
  function startAutoplay() {
    return setInterval(() => {
      currentIndex = (currentIndex + 1) % totalItems; // Move to the next slide
      showSlide(currentIndex);
    }, autoplayDelay); // Delay defined by the autoplayDelay variable
  }

  // Start autoplay
  let autoplay = startAutoplay();

  // Pause autoplay on arrow clicks and restart after delay
  function resetAutoplay() {
    clearInterval(autoplay);
    autoplay = startAutoplay();
  }

  nextArrow.addEventListener("click", resetAutoplay);
  prevArrow.addEventListener("click", resetAutoplay);
});




///////////////////////////////////////
/// SHARING ARTICLE IN THE BLOG SECTION
///////////////////////////////////////

// Check if any element with the class .blog_share_list_wrap exists
const shareButtonsContainers = document.querySelectorAll(".blog_share_list_wrap");

if (shareButtonsContainers.length > 0) { // Only run if the class exists
  shareButtonsContainers.forEach((container) => {
    // Dynamically get the current page URL and title
    const postURL = window.location.href; // Use the current page URL
    const postTitle = document.title; // Use the page title

    // LinkedIn
    const linkedInButton = container.querySelector('[data-platform="linkedin"]');
    if (linkedInButton) {
      linkedInButton.setAttribute("href", `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postURL)}&title=${encodeURIComponent(postTitle)}`);
      linkedInButton.setAttribute("target", "_blank"); // Dynamically set target
    }

    // X (formerly Twitter)
    const twitterButton = container.querySelector('[data-platform="x"]');
    if (twitterButton) {
      twitterButton.setAttribute("href", `https://twitter.com/intent/tweet?url=${encodeURIComponent(postURL)}&text=${encodeURIComponent(postTitle)}`);
      twitterButton.setAttribute("target", "_blank"); // Dynamically set target
    }

    // Facebook
    const facebookButton = container.querySelector('[data-platform="facebook"]');
    if (facebookButton) {
      facebookButton.setAttribute("href", `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postURL)}`);
      facebookButton.setAttribute("target", "_blank"); // Dynamically set target
    }
  });
}


///////////////////////////////
/// FILTERS DROPDOWN OPEN
///////////////////////////////

const filterDropdownWraps = document.querySelectorAll(".checkbox_category_wrap");
const filterTimelines = [];

// Loop through each element
filterDropdownWraps.forEach(function (el, index) {
  let chevron = el.querySelector(".checkbox_dropdown");
  let headingWrap = el.querySelector(".checkbox_heading_wrap");
  let content = el.querySelector(".checkbox_list_wrap");

  // Create a timeline for each dropdown
  let tlFiltersDropdown = gsap.timeline({ paused: true });

  // Add animations to the timeline
  tlFiltersDropdown
    .from(content, {
      display: "none",
    })
    .from(content, {
      height: 0,
    }, "<")    
    .to(el, {
      borderBottom: 0,
    }, "<")    
    .to(chevron, {
      rotate: 180,
    }, "<");

  // Store the timeline and state in an array
  filterTimelines.push({
    timeline: tlFiltersDropdown,
    isOpen: false, // Initial state is closed
  });

  // Add click event listener for each headingWrap
  headingWrap.addEventListener("click", function (e) {
    e.stopPropagation(); // Prevent click event from bubbling to the document

    // Get the current state of the timeline
    const current = filterTimelines[index];

    if (!current.isOpen) {
      // If the current timeline is not open (closed), reverse all other filterTimelines
      filterTimelines.forEach((tlObj, i) => {
        if (i !== index && tlObj.isOpen) {
          tlObj.timeline.reverse();
          tlObj.isOpen = false; // Set their state to closed
        }
      });

      // Play the clicked timeline and set its state to open
      current.timeline.play();
      current.isOpen = true;
    } else {
      // If the current timeline is open, reverse it and set its state to closed
      current.timeline.reverse();
      current.isOpen = false;
    }
  });

  // Add click event listener on the content to refresh ScrollTrigger when filters are clicked
  content.addEventListener("click", function() {
    // Wait for the dropdown animation to finish, then refresh ScrollTrigger
    setTimeout(function() {
      ScrollTrigger.refresh(); // Refresh ScrollTrigger to recalculate positions
    }, 300); // Adjust delay based on the duration of the animation
  });
});

// Close dropdown when clicking outside of any filter, but ignore clicks inside the dropdown
document.addEventListener("click", function (e) {
  // Check if the click was inside any of the filterDropdownWraps
  let isClickInsideDropdown = Array.from(filterDropdownWraps).some(function (el) {
    return el.contains(e.target); // Check if the clicked element is inside the dropdown
  });

  // If the click is outside any dropdown, close all open dropdowns
  if (!isClickInsideDropdown) {
    filterTimelines.forEach(function (tlObj) {
      if (tlObj.isOpen) {
        tlObj.timeline.reverse(); // Reverse the timeline to close the dropdown
        tlObj.isOpen = false; // Set its state to closed
      }
    });
  }
});




///////////////////////////////
/// FILTERS AUTOMATIC CATEGORY
///////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
  // Check if there's any element with a data-filter-type attribute
  var hasFilterType = document.querySelector('[data-filter-type]');

  if (hasFilterType) {
    // Function to populate filter buttons for a specific filter type
    function createFilterButtons(attribute, filterType, itemAttribute = 'filterable-collection-item') {
        var uniqueValues = new Set(); // Create a Set to store unique values

        // Loop through all CMS items and collect unique values based on the attribute
        document.querySelectorAll(`[${itemAttribute}="true"]`).forEach(function(cmsItem) {
            var value = cmsItem.getAttribute(attribute);
            if (value) {
                uniqueValues.add(value); // Add value to the Set
            }
        });

        // Find the filter button container with the correct data-filter-type
        var filterButtonsContainer = document.querySelector('[data-filter-type="' + filterType + '"]');

        // Ensure the container exists before proceeding
        if (filterButtonsContainer) {
          // Check if the container has a child div with the class "checkbox_list_wrap"
          var checkboxListWrap = filterButtonsContainer.querySelector('.checkbox_list_wrap');

          // If the div is found, insert the buttons inside it
          if (checkboxListWrap) {
              // Create a button for each unique value using a custom HTML template
              uniqueValues.forEach(function(value) {
                  var buttonHTML = `
                      <label class="w-checkbox checkbox_item_wrap u-hflex-between-center">
                      <input type="checkbox" name="${filterType}" id="contrat" data-name="${filterType}" class="w-checkbox-input custom_checkbox">
                      <span fs-cmsfilter-field="${filterType}" class="custom_checkbox_label w-form-label" for="contrat">${value}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 13 10" fill="none" class="checkbox_svg">
                        <path d="M11.5 1L4.625 8.33333L1.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                      </svg>
                  </label>
                  `;

                  // Append the button to the checkbox_list_wrap container
                  checkboxListWrap.innerHTML += buttonHTML;
              });
          }
        } else {
          console.error(`No element found for [data-filter-type="${filterType}"]`);
        }
    }

    // Populate contract filter buttons with the new target attribute
    createFilterButtons('data-categorie', 'categorie');
    createFilterButtons('data-metiers', 'metiers');
    createFilterButtons('data-ville', 'ville');
    createFilterButtons('data-contrat', 'contrat');
    createFilterButtons('data-etablissement', 'etablissement');
  }
});

///////////////////////////////
/// REPLACE EMBED WITH CUSTOM HREF
///////////////////////////////

document.querySelectorAll('.iframe_booking_code_embed').forEach(function(embedElement) {
  // Get the custom-href attribute value
  var customHref = embedElement.getAttribute('custom-href');

  // Find the child iframe with the class .iframe-booking
  var iframeElement = embedElement.querySelector('.iframe-booking');

  // If both customHref and iframeElement exist, update the iframe src
  if (customHref && iframeElement) {
    iframeElement.setAttribute('src', customHref);
  }
});



///////////////////////////////
/// TIMELINE FOR LANGUAGE SWITCHES
///////////////////////////////


// Create a GSAP timeline for .locales_list
const languageSwitchTl = gsap.timeline({ paused: true })
  .to('.locales_list', {
    display: 'block',
    // opacity: 1,    

  });

// Toggle functionality for showing the list
const toggle = document.querySelector('.locales_toggle');
const localesList = document.querySelector('.locales_list');

toggle.addEventListener('click', (event) => {
  event.stopPropagation(); // Prevent click from propagating to the document
  if (languageSwitchTl.isActive() || languageSwitchTl.progress() > 0) {
    languageSwitchTl.reverse();
  } else {
    languageSwitchTl.play();
  }
});

// Close the list when clicking outside
document.addEventListener('click', (event) => {
  if (!localesList.contains(event.target) && !toggle.contains(event.target)) {
    if (languageSwitchTl.progress() > 0) {
      languageSwitchTl.reverse();
    }
  }
});

// Disable browser scroll restoration so page always starts at top on refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

$(document).ready(function() {

  // Mobile menu toggle
  $(".menu_icon").click(function() {
    $(".navbar").toggleClass("active");
    $(this).find("i").toggleClass("fa-bars fa-times");
  });

  // Close mobile menu when a nav link is clicked
  $(".navbar li a").click(function() {
    $(".navbar").removeClass("active");
    $(".menu_icon i").removeClass("fa-times").addClass("fa-bars");
  });

  //sticky header
    $(window).scroll(function() {
      if ($(this).scrollTop() > 1) {
        $(".header-area").addClass("sticky");
      } else {
        $(".header-area").removeClass("sticky");
      }
  
      // Update the active section in the header
      updateActiveSection();
    });
  
    $(".header ul li a").click(function(e) {
      e.preventDefault();

      var $this = $(this);
      var target = $this.attr("href");

      if (target === "#home") {
        $("html, body").animate({ scrollTop: 0 }, 500, function() {
          $(".header ul li a").removeClass("active");
          $this.addClass("active");
        });
        return;
      }

      var doScroll = function() {
        var stickyH = $(".header-area").outerHeight();
        var offset = $(target).offset().top - stickyH - 50;

        $("html, body").animate(
          { scrollTop: Math.max(1, offset) },
          500,
          function() {
            // Set active only after scroll settles — avoids updateActiveSection()
            // firing mid-animation and overwriting the active class
            $(".header ul li a").removeClass("active");
            $this.addClass("active");
          }
        );
      };

      if (!$(".header-area").hasClass("sticky")) {
        // Force sticky + reflow first, then measure offset in the stable layout
        $(window).scrollTop(1);
        setTimeout(doScroll, 50);
      } else {
        doScroll();
      }
    });
  

    //Initial content revealing js
    ScrollReveal({
      distance: "100px",
      duration: 2000,
      delay: 200
    });
  
    ScrollReveal().reveal(".header a, .profile-photo, .about-content, .education", {
      origin: "left"
    });
    ScrollReveal().reveal(".header ul, .profile-text, .about-skills, .internship", {
      origin: "right"
    });
    ScrollReveal().reveal(".project-title, .contact-title", {
      origin: "top"
    });
    ScrollReveal().reveal(".projects, .contact", {
      origin: "bottom"
    });

  // Set active nav item on page load
  updateActiveSection();

  //contact form
  const scriptURL = 'https://script.google.com/macros/s/abc/exec'; //Replace with your actual script URL which runs a script that saves the form data to a Google Sheet / sends an email notification, etc.
  const form = document.forms['submitToGoogleSheet']
  const msg = document.getElementById("msg")

  form.addEventListener('submit', e => {
      e.preventDefault()
      const submitBtn = form.querySelector('.submit');
      submitBtn.value = "Sending...";
      submitBtn.disabled = true;
      fetch(scriptURL, { method: 'POST', body: new FormData(form) })
          .then(response => {
              msg.innerHTML = "Message sent successfully"
              msg.style.color = "#4CAF50";
              setTimeout(function () {
                  msg.innerHTML = ""
              }, 5000)
              form.reset()
          })
          .catch(error => {
              msg.innerHTML = "Failed to send message. Please try again.";
              msg.style.color = "#ff4444";
              console.error('Error!', error.message)
          })
          .finally(() => {
              submitBtn.value = "Send Message";
              submitBtn.disabled = false;
          })
  })
    
  });
  
  function updateActiveSection() {
    var scrollPosition = $(window).scrollTop();
  
    // Checking if scroll position is at the top of the page
    if (scrollPosition === 0) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#home']").addClass("active");
      return;
    }

    // If scrolled to the bottom, highlight the last nav item (Contact)
    if ($(window).scrollTop() + $(window).height() >= $(document).height() - 5) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#contact']").addClass("active");
      return;
    }
  
    // Use a focus point: sticky header bottom + small offset
    // A section is active when this focus point is inside it
    var headerH = $(".header-area").outerHeight();
    var focusPoint = scrollPosition + headerH + 30;

    // Iterate through each section (including #home div) and update the active class
    $("#home, section[id]").each(function() {
      var target = $(this).attr("id");
      var offset = $(this).offset().top;
      var height = $(this).outerHeight();

      if (focusPoint >= offset && focusPoint < offset + height) {
        $(".header ul li a").removeClass("active");
        $(".header ul li a[href='#" + target + "']").addClass("active");
      }
    });
  }
  

 
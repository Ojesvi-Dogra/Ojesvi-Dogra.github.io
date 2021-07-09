// Check screen width immediately
if ($(window).width() < 1000) {
  $("#scrollbar").css("display", "none");
  $("#about > div > div > ul > li > a").css("display", "inline-block");
}

$(document).ready(function() {
  var options = {
  strings: ["a college student.", "a gamer.", "a frontend developer.", "Ka."],
  typeSpeed: 40,
  onComplete: function() {
    $("#status").fadeTo("slow" , 1, function() {
    // Animation complete.
    });
  },
  startDelay: 850,
  // backspacing speed
  backSpeed: 50,
  // time before backspacing
  backDelay: 100,
}

var typed = new Typed(".typed", options);
  
  // When collapse button is clicked
  $("#sidebarCollapse").on("click", function() {
    if ($("#sidebar").hasClass("active")) {
      $("#content").css("margin-left", "12%");
      $("#scrollbar").css("margin-left", "14%");
    } else {
      $("#content").css("margin-left", "80px");
      $("#scrollbar").css("margin-left", "105px");
    }
    $("#sidebar").toggleClass("active");
    $(this).toggleClass("active");
  });

  $(window).scroll(function() {
    if ($(window).scrollTop() != 0) {
      $("#scrollbar").css("background", "rgba(52, 52, 54, 0.9)");
    } else {
      $("#scrollbar").css("background", "rgba(52, 52, 54, 0.2)");
    }
  });
  
  // When resizing occurs
  $(window).resize(function () {
    if ($(window).width() < 1500) {
      if (!$("#sidebar").hasClass("active"))
        $("#sidebarCollapse").trigger("click");
      if ($(window).width() < 1000) {
        $("#scrollbar").css("display", "none");
      }
      else
        $("#scrollbar").css("display", "");
      }
    else {
      $("#scrollbar").css("display", "");
    }
  });
  
  // When an anchor is clicked
  $(document).on('click', 'a[href^="#"]', function (event) {
    event.preventDefault();
    $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
    }, 750);
});
});
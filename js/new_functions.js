$(document).ready(function() {
  $(".site-main-menu .nav-link").click(function(event) {
    console.log("click");
    $('html, body').animate({
      scrollTop: $(".site-main-menu .tab-content").offset().top
    }, 1000);
  });
});

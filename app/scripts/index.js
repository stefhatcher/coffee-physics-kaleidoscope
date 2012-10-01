(function(){
  var bodyEl = $('body'),
      nav = $('#nav'),
      startTop = $('#start').length && $('#start').offset().top - 10;

  $('html, body').animate({ scrollTop: bodyEl.offset().top }, 190);

  nav.delegate('li', 'touchend click', function(e){
    e.preventDefault();
    e.stopPropagation();

    var obj = $(this),
        id = this.id,
        active = nav.find('.active').removeClass('active');

    bodyEl.removeClass(active.attr('id')).addClass(id);
    obj.addClass('active');
    $('html, body').animate({ scrollTop: startTop }, 190);
  });
})();


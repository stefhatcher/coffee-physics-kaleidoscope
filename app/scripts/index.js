
(function() {
  var bodyEl, nav, startTop;
  bodyEl = $('body');
  nav = $('#nav');
  startTop = $('#start');
  if (startTop != null) {
    startTop = startTop.offset().top - 10;
    $('#main .content').height($('.help.content').height() + 'px');
  }
  $('html, body').animate({
    scrollTop: bodyEl.offset().top
  }, 190);
  return nav.delegate('li', 'touchend mouseup', function(e) {
    var active, id, obj;
    e.preventDefault();
    e.stopPropagation();
    obj = $(this);
    id = this.id;
    active = nav.find('active').removeClass('active');
    bodyEl.removeClass(active.attr('id')).addClass(id);
    obj.addClass('active');
    return $('html, body').animate({
      scrollTop: startTop
    }, 190);
  });
})();

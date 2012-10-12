do ->
  bodyEl = $('body')
  nav = $('#nav')
  startTop = $('#start')

  if startTop?
    startTop = startTop.offset().top - 10
    $('#main .content').height $('.help.content').height() + 'px'

  $('html, body').animate { scrollTop: bodyEl.offset().top }, 190

  nav.delegate 'li', 'touchend mouseup', (e) ->
    do e.preventDefault
    do e.stopPropagation

    obj = $(this)
    id = this.id
    active = nav.find('active').removeClass 'active'

    bodyEl.removeClass(active.attr('id')).addClass(id)
    obj.addClass 'active'

    $('html, body').animate { scrollTop: startTop }, 190

do ->
  bodyEl = $('body')
  nav = $('#nav')
  startTop = $('#start')

  if startTop? and startTop.length > 0
    startTop = startTop.offset().top - 10
    $('#main .content').height $('.help.content').height() + 'px'

  nav.delegate 'li', 'touchend mouseup', (e) ->
    do e.preventDefault
    do e.stopPropagation

    obj = $(this)
    id = this.id
    active = nav.find('.active').removeClass 'active'

    bodyEl.removeClass(active.attr('id')).addClass(id)
    obj.addClass 'active'

    $('html, body').animate { scrollTop: startTop }, 190

  window.scrollTo 0, 1

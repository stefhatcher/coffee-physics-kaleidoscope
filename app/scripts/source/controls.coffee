class Controls

	constructor: ->
    @playing = false

  init: (world) ->
    @world = world
    @playing = true
    @pixelate = false
    @pixelImgId = 'pixel-img'

    do @update

    @themes = $('#color-themes').hide()
    @items = {}
    @actions = {
      'kaleidoscope': @toggleMirrors,
      'pixelate': @togglePixelate,
      'bleed': @toggleBleed,
      'colors': @toggleThemes,
      'edit': @toggleEdit,
      'hide': @toggleMenu,
      'animate': @togglePause,
      'reset': @resetAll,
      'screenshot a': @exportAll
    }

    if Modernizr.touch then @startEvent = 'touchmove touchend' else @startEvent = 'mousedown'

    for action of @actions
      item = $('#' + action)
      item.bind @startEvent, @actions[action]
      item.data 'action', action
      @items[action] = item
   
    do @setupColors
    do @toggleEdit

    $('li.shape').bind @startEvent, @addShape
    $(@world.container).bind @startEvent, @step

    if not Modernizr.localstorage
      @items['screenshot a'].remove()


  addShape: (e) =>
    if e? then do e.stopPropagation
    @world.addShape $(e.target).parent().attr 'id'

  exportAll: (e) =>
    do e.stopPropagation
    do e.preventDefault

    if @pixelate
      data = $('#' + @pixelImgId)[0].toDataURL 'jpg/image'
    else if @world.renderer.reflecting
      data = @world.renderer.mirror.toDataURL 'jpg/image'
    else
      data = @world.renderer.cnvs.toDataURL 'jpg/image'

    localStorage.setItem 'kaleidoscope_screenshot', data

  pause: (e) ->
    @items['animate'].removeClass('playing').addClass 'paused'
    @playing = false

  play: () ->
    @items['animate'].removeClass('paused').addClass 'playing'
    @items['edit'].removeClass 'open'

    @items['reset'].hide
    @playing = true

    if @pixelate then do @togglePixelate

  removeSpring: (time) ->
    if time % 500 == 0
      index = ~~Random 1, @world.physics.springs.length - 1
      removed = @world.physics.springs[index]

      if removed?
        removed.p2.behaviours.push new Attraction(removed.p1.pos, 500, -2000)
        @world.physics.springs.splice index, 1

  resetAll: (e) =>
    if e?
      do e.stopPropagation
      do e.preventDefault

    if confirm 'Clear all of the things? You sure?'
      @pixelate = false
      @items['pixelate'].removeClass 'active'

      do @pause

      @items['edit'].addClass 'open'

      do @world.physics.destroy
      @world.physics = null
      do @world.renderer.reset
      do @world.setup

      localStorage.setItem 'kaleidoscope_screenshot', ''

      do $('#' + @pixelImgId).remove
      do $(@world.renderer.cnvs).show
      do $(@world.renderer.mirror).show

  selectTheme: (e) =>
    if e? then do e.stopPropagation

    @world.setTheme $(e.target).parent().attr 'id'
    do @toggleThemes

  setupColors: ->
    size = @world.THEMES.length
    themeh = @world.width / (size * 4)

    for theme, i in @world.THEMES
      li = $('<li>').attr 'id', i + '_theme'
      li.append $('<h2>').text(i)

      for color in theme
        li.append $('<span style="background-color:' + color + '; height:' + themeh + 'px">')

      @themes.append li
      li.bind @startEvent, @selectTheme

  step: (e) =>
    if not @playing
      do @world.step
      @world.renderer.render @world.physics

  toggleBleed: (e) =>
    if e? then do e.stopPropagation

    @world.renderer.bleeding = not @world.renderer.bleeding
    @items['bleed'].toggleClass 'active'

    if not @playing then @world.renderer.render @world.physics

  toggleEdit: (e) =>
    if e? then do e.stopPropagation

    @items['edit'].toggleClass 'open';

    if @items['edit'].hasClass 'open'
      do @pause
      do @items['reset'].show
    else
      do @play
      @items['colors'].removeClass 'active'
      do @themes.hide
      do @items['reset'].hide

  toggleMenu: (e) =>
    if e? then do e.stopPropagation

    @items['hide'].toggleClass('flip')
                  .siblings().toggle()
                  .parent().toggleClass('collapsed')

    @items['animate'].toggleClass 'minimized'

    if @items['hide'].hasClass 'flip'
      do @items['reset'].hide
    else if @items['edit'].hasClass 'open'
      do @items['reset'].show

  toggleMirrors: (e) =>
    if e? then do e.stopPropagation

    @items['kaleidoscope'].toggleClass('active')
    @world.renderer.reflecting = not @world.renderer.reflecting

    if not @pixelate
      if not @world.renderer.reflecting
        do $(@world.renderer.cnvs).show
        do $(@world.renderer.mirror).hide

        @world.renderer.mctx.clearRect 0, 0, @world.width, @world.height
      else
        do $(@world.renderer.cnvs).hide
        do $(@world.renderer.mirror).show

        if not @playing then @world.renderer.render @world.physics

  togglePause: (e) =>
    if not @playing then do @play else do @pause

  togglePixelate: (e) =>
    if e? then do e.stopPropagation

    @items['pixelate'].toggleClass 'active'
    @pixelate = not @pixelate

    if @pixelate
      do @updatePixelate
    else
      $(@world.renderer.cnvs).fadeIn 0
      $(@world.renderer.mirror).fadeIn 0
      do $('#' + @pixelImgId).remove

  toggleThemes: (e) =>
    if e? then do e.stopPropagation

    @items['colors'].toggleClass 'active'
    @themes.slideToggle 'fast'

  update: (time) =>
    requestAnimationFrame @update

    if @playing and @world
      do @world.step
      @removeSpring time

  updatePixelate: ->
    console.log 'pixelate'
    if @world.renderer.reflecting
      data = @world.renderer.mirror.toDataURL 'png/image'
    else
      data = @world.renderer.cnvs.toDataURL 'png/image'
    
    img = document.createElement('img');
    img.src = data;
    img.id = @pixelImgId;
    img.style.opacity = 0;

    img.addEventListener 'load', =>
      img.closePixelate([
        { shape: 'square', resolution: 18, size: 20, offset: 0, alpha: 0.271 },
        { shape: 'diamond', resolution: 18, size: 38, offset: 0, alpha: 0.651 }
      ]);

      $('#' + @pixelImgId).css 'opacity', 1
      $(@world.renderer.cnvs).fadeOut 0
      $(@world.renderer.mirror).fadeOut 0
      
    , false
  
    @world.container.appendChild(img);

k_world = new World()
k_world.init document.getElementById('viewport'), new Renderer()

k_interface = new Controls()
k_interface.init k_world
k_interface.world.addShape 'circle'
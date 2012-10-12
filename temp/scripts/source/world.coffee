class World
  constructor: ->
    @COLORS = COLOR_THEMES[0]
    @THEMES = COLOR_THEMES

    @width = window.innerWidth
    @height = window.innerHeight

  init: (container, renderer) ->
    @container = container
    @renderer = renderer

    do @setup

    startType = if Modernizr? and Modernizr.touch then 'touchmove' else 'mouseup'

    @container.addEventListener startType, @mousemove, false
    document.addEventListener 'resize', @resize, false
    window.addEventListener 'resize', @resize, false
    window.addEventListener 'orientationchange', @resize, false

    @container.appendChild @renderer.cnvs
    @container.appendChild @renderer.mirror

    do @resize

  setup: ->
    max = Math.max @width, @height

    @renderTime = 0;
    @counter = 0;

    @physics = new Physics()
    @mouse = new Particle()
    @mouse.fixed = true;
    @mouse.pos.set @width / 2, @height / 2
    @physics.particles.push @mouse

    @max = 400;
    @physics.integrator = new ImprovedEuler()
    @center = new Attraction @mouse.pos, 500, 1200

    @edge = new EdgeWrap new Vector(0, 0), new Vector(max, max)

    @renderer.mouse = @mouse
    @renderer.init @physics

  addShape: (type) ->
    max = ~~Random 3, 10
    size = @physics.particles.length

    if size + max > @max
      @physics.particles.splice 1, (size + max) - @max
      @physics.springs.splice 1, (size + max) - @max
    
    for i in [max..0]
      p = new Particle Random 0.1, 4.0
      p.setRadius ~~(p.mass * 15)
      p.behaviours.push new Wander 0.5, 700, Random(1.0, 2.0)
      p.behaviours.push @center
      p.behaviours.push @edge
      p.moveTo new Vector ~~Random(@width), ~~Random(@height)

      p.colour = @COLORS[(size + max - i) % @COLORS.length]
      p.shape = type;

      s = new Spring @mouse, p, Random(30, 300), Random(0, 1.0)

      @physics.particles.push p
      @physics.springs.push s

    do @renderWorld

  mousemove: (event) =>
    do event.preventDefault

    if event.touches and !!event.touches.length
      touch = event.touches[0]
      @mouse.pos.set touch.pageX, touch.pageY
    else
      @mouse.pos.set event.clientX, event.clientY

  resize: (event) =>
    @width = window.innerWidth
    @height = window.innerHeight

    if event?
      $('body').height window.innerHeight + 100 + 'px'
      window.scrollTo 0, 1
      $('body').height window.innerHeight + 'px'

    @landscape = if @width > @height then 90 else 0

    @container.style.width = @width + 'px'
    @container.style.height = @height + 'px'

    @mouse.pos.set @width/2, @height/2

    @renderer.setSize @width, @height
    do @renderWorld

    size = @THEMES.length
    themeh = @width / (size * 4)
    $('#color-themes li span').height themeh + 'px'

  renderWorld: ->
    @renderer.render(@physics)

  setTheme: (theme) ->
    if theme?
      theme = parseInt theme, 10
      @COLORS = @THEMES[theme]

    for p, i in @physics.particles
      p.colour = @COLORS[(_len - i) % @COLORS.length]

    do @renderWorld

  step: ->
    do @physics.step

    if ++@counter % 3 is 0
      do @renderWorld
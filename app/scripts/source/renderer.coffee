
class Renderer
  constructor: ->
    @TO_RADIAN = Math.PI / 180
    @TWO_PI = Math.PI * 2

    @width = 0
    @height = 0
    @landscape = 0

    @centerX = 0
    @centerY = 0

    @initialized = false
    @renderTime = 0

    # canvas to render particles
    @cnvs = document.createElement 'canvas'
    @ctx = @cnvs.getContext '2d'

    # canvas to draw mirror effect / kaleidoscope
    @mirror = document.createElement 'canvas'
    @mctx = @mirror.getContext '2d'

    # offscreen processor canvas
    @offscrn = document.createElement 'canvas'
    @octx = @offscrn.getContext '2d'

    # states 
    @bleeding = false
    @reflecting = false


  init: (physics) ->
    @initialized = true

  render: (physics) ->
    if not @initialized then @init physics

    time = new Date().getTime()
    vel = new Vector()
    direction = new Vector()

    if not @bleeding
      @cnvs.width = @cnvs.width

    # draw particles
    for p in physics.particles
      @ctx.fillStyle = p.colour || '#FFFFFF'

      if p.shape is 'pentagon'
        @drawPentagon p
      else if p.shape is 'square'
        @drawSquare p
      else if p.shape is 'special'
        @drawCat p
      else if p.shape is 'triangle'
        @drawTriangle p
      else
        @drawCircle p

    # draw springs
    @ctx.strokeStyle = 'rgba(249, 249, 222, 0.1)'
    do @ctx.beginPath

    for s in physics.springs
      @ctx.moveTo s.p1.pos.x, s.p1.pos.y
      @ctx.lineTo s.p2.pos.x, s.p2.pos.y

    do @ctx.stroke

    # draw mouse
    @ctx.fillStyle = 'rgba(255,255,255,0.2)'
    do @ctx.beginPath
    @ctx.arc @mouse.pos.x, @mouse.pos.y, 20, 0, @TWO_PI
    do @ctx.fill

    # draw kaleidoscope reflection
    if @reflecting
      @octx.clearRect 0, 0, @width, @height
      @mctx.fillStyle = '#f9f9de'

      do @octx.save
      do @octx.beginPath
      @octx.moveTo 0, 0
      @octx.lineTo @centerX, @centerY
      @octx.lineTo 0, @centerY
      @octx.lineTo 0, 0
      do @octx.closePath
      do @octx.clip
      @octx.drawImage @cnvs, 0, 0
      do @octx.restore

      do @octx.save
      @octx.globalCompositeOperation = 'destination-over'
      @octx.translate @centerX, @centerY
      @octx.scale -1, 1 
      @octx.rotate (180 * @TO_RADIAN) - Math.atan(@centerY/@centerX) * 2
      @octx.drawImage @offscrn, -@centerX, -@centerY
      @octx.scale -1, 1
      @octx.drawImage @offscrn, @centerX, -@centerY
      do @octx.restore

      if @landscape is 90
        do @octx.save
        @octx.globalCompositeOperation = 'destination-over'
        @octx.translate @centerX, @centerY
        @octx.scale -1, 1
        @octx.rotate (135 * @TO_RADIAN) - Math.atan(@centerY/@centerX) * 2.4
        @octx.drawImage @offscrn, -@centerX, -@centerY
        @octx.scale -1, 1
        @octx.drawImage @offscrn, @centerX, -@centerY
        do @octx.restore    
      
      @octx.clearRect @centerX, 0, @centerX, @height
      @octx.clearRect 0, @centerY, @width, @centerY

      do @octx.save
      @octx.translate @centerX, @centerY
      @octx.scale -1, -1
      @octx.drawImage @offscrn, -@centerX, -@centerY
      @octx.scale -1, 1
      @octx.drawImage @offscrn, -@centerX, -@centerY
      do @octx.restore

      @mctx.fillRect 0, 0, @width, @height
      @mctx.drawImage @offscrn, 0, 0

    @renderTime = new Date().getTime() - time


  drawCat: (p) ->
    do @ctx.beginPath
    @ctx.moveTo p.pos.x - p.radius, p.pos.y
    @ctx.lineTo p.pos.x - p.radius, p.pos.y - p.radius * 1.5
    @ctx.lineTo p.pos.x, p.pos.y
    @ctx.arc p.pos.x, p.pos.y, p.radius, 0, @TWO_PI, false
    @ctx.moveTo p.pos.x + p.radius, p.pos.y
    @ctx.lineTo p.pos.x + p.radius, p.pos.y - p.radius * 1.5
    @ctx.lineTo p.pos.x, p.pos.y
    @ctx.arc p.pos.x, p.pos.y, p.radius, 0, @TWO_PI, false
    do @ctx.closePath
    do @ctx.fill

  drawCircle: (p) ->
    do @ctx.beginPath
    @ctx.arc p.pos.x, p.pos.y, p.radius, 0, @TWO_PI, false
    do @ctx.closePath
    do @ctx.fill

  drawPentagon: (p) ->
    do @ctx.beginPath
    @ctx.moveTo p.pos.x, p.pos.y - p.radius
    @ctx.lineTo p.pos.x - p.radius, p.pos.y
    @ctx.lineTo p.pos.x + -p.radius * 0.5, p.pos.y + p.radius * (Math.sqrt(3) / 2)
    @ctx.lineTo p.pos.x + p.radius * 0.5, p.pos.y + p.radius * (Math.sqrt(3) / 2)
    @ctx.lineTo p.pos.x + p.radius, p.pos.y
    @ctx.lineTo p.pos.x, p.pos.y - p.radius
    do @ctx.closePath
    do @ctx.fill

  drawSquare: (p) ->
    do @ctx.beginPath
    @ctx.fillRect p.pos.x - p.radius, p.pos.y - p.radius, p.radius * 2, p.radius * 2
    do @ctx.closePath
    do @ctx.fill

  drawTriangle: (p) ->
    side = ~~(p.radius * (6 / Math.sqrt(3)))
    do @ctx.beginPath
    @ctx.moveTo p.pos.x, p.pos.y - p.radius
    @ctx.lineTo p.pos.x - side / 5, p.pos.y + side / 5
    @ctx.lineTo p.pos.x + side / 5, p.pos.y + side / 5
    do @ctx.closePath
    do @ctx.fill

  reset: ->
    @cnvs.width = @cnvs.width
    @mirror.width = @mirror.width
    @offscrn.width = @offscrn.width
    @initialized = false

  setSize: (width, height, orientation) =>
    @landscape = orientation || Math.abs(window.orientation) || (width > height) ? 90 : 0
    
    @width = width
    @height = height

    @centerX = @width / 2
    @centerY = @height / 2

    @cnvs.width = @width
    @cnvs.height = @height

    @mirror.width = @width
    @mirror.height = @height

    @offscrn.width = @width
    @offscrn.height = @height



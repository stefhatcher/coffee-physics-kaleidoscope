var World,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

World = (function() {

  function World() {
    this.resize = __bind(this.resize, this);

    this.mousemove = __bind(this.mousemove, this);
    this.COLORS = COLOR_THEMES[0];
    this.THEMES = COLOR_THEMES;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  World.prototype.init = function(container, renderer) {
    var startType;
    this.container = container;
    this.renderer = renderer;
    this.setup();
    startType = (typeof Modernizr !== "undefined" && Modernizr !== null) && Modernizr.touch ? 'touchmove' : 'mouseup';
    this.container.addEventListener(startType, this.mousemove, false);
    document.addEventListener('resize', this.resize, false);
    window.addEventListener('resize', this.resize, false);
    window.addEventListener('orientationchange', this.resize, false);
    this.container.appendChild(this.renderer.cnvs);
    this.container.appendChild(this.renderer.mirror);
    return this.resize();
  };

  World.prototype.setup = function() {
    var max;
    max = Math.max(this.width, this.height);
    this.renderTime = 0;
    this.counter = 0;
    this.physics = new Physics();
    this.mouse = new Particle();
    this.mouse.fixed = true;
    this.mouse.pos.set(this.width / 2, this.height / 2);
    this.physics.particles.push(this.mouse);
    this.max = 400;
    this.physics.integrator = new ImprovedEuler();
    this.center = new Attraction(this.mouse.pos, 500, 1200);
    this.edge = new EdgeWrap(new Vector(0, 0), new Vector(max, max));
    this.renderer.mouse = this.mouse;
    return this.renderer.init(this.physics);
  };

  World.prototype.addShape = function(type) {
    var i, max, p, s, size, _i;
    max = ~~Random(3, 10);
    size = this.physics.particles.length;
    if (size + max > this.max) {
      this.physics.particles.splice(1, (size + max) - this.max);
      this.physics.springs.splice(1, (size + max) - this.max);
    }
    for (i = _i = max; max <= 0 ? _i <= 0 : _i >= 0; i = max <= 0 ? ++_i : --_i) {
      p = new Particle(Random(0.1, 4.0));
      p.setRadius(~~(p.mass * 15));
      p.behaviours.push(new Wander(0.5, 700, Random(1.0, 2.0)));
      p.behaviours.push(this.center);
      p.behaviours.push(this.edge);
      p.moveTo(new Vector(~~Random(this.width), ~~Random(this.height)));
      p.colour = this.COLORS[(size + max - i) % this.COLORS.length];
      p.shape = type;
      s = new Spring(this.mouse, p, Random(30, 300), Random(0, 1.0));
      this.physics.particles.push(p);
      this.physics.springs.push(s);
    }
    return this.renderWorld();
  };

  World.prototype.mousemove = function(event) {
    var touch;
    event.preventDefault();
    if (event.touches && !!event.touches.length) {
      touch = event.touches[0];
      return this.mouse.pos.set(touch.pageX, touch.pageY);
    } else {
      return this.mouse.pos.set(event.clientX, event.clientY);
    }
  };

  World.prototype.resize = function(event) {
    if ((typeof e !== "undefined" && e !== null) && e.type === 'orientationchange') {
      this.landscape = Math.abs(window.orientation);
    }
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container.style.width = this.width + 'px';
    this.container.style.height = this.height + 'px';
    this.renderer.setSize(this.width, this.height, this.landscape);
    return this.renderWorld();
  };

  World.prototype.renderWorld = function() {
    return this.renderer.render(this.physics);
  };

  World.prototype.setTheme = function(theme) {
    var i, p, _i, _len, _ref;
    if (theme != null) {
      theme = parseInt(theme, 10);
      this.COLORS = this.THEMES[theme];
    }
    _ref = this.physics.particles;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      p = _ref[i];
      p.colour = this.COLORS[(_len - i) % this.COLORS.length];
    }
    return this.renderWorld();
  };

  World.prototype.step = function() {
    this.physics.step();
    if (++this.counter % 3 === 0) {
      return this.renderWorld();
    }
  };

  return World;

})();

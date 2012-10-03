var kaleid = {},
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

kaleid = (function() {

  function kaleid() {
    this.DPR = window.devicePixelRatio;
    this.COLORS = COLOR_THEMES[0];
    this.THEMES = COLOR_THEMES;
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.physics = new Physics();
    this.mouse = new Particle();
    this.mouse.fixed = true;
    this.mouse.pos.set(this.width/2, this.height/2);
    this.physics.particles.push(this.mouse);
    this.renderTime = 0;
    this.counter = 0;
    this.resize = __bind(this.resize, this);
    this.mousemove = __bind(this.mousemove, this);
  }

  kaleid.prototype.setup = function(full) {
    var wall1, wall2, squared = Math.max(this.width, this.height);
    full = (full !== null) ? full : false;

    this.max = full ? 400 : 200;
    this.physics.integrator = new ImprovedEuler();
    this.center = new Attraction(this.mouse.pos, 500, 1200);

    wall1 = new Vector(0, 0);
    wall2 = new Vector(squared, squared);
    this.edge = new EdgeBounce(wall1, wall2);
  };


  kaleid.prototype.init = function(container, view) {
    this.container = container;
    this.view = view;

    this.setup();

    var startEvent = (Modernizr && Modernizr.touch) ? 'touchmove' : 'mouseup';

    this.container.addEventListener(startEvent, this.mousemove, false);
    document.addEventListener('resize', this.resize, false);
    window.addEventListener('orientationchange', this.resize, false);
    window.addEventListener('resize', this.resize, false);

    this.container.appendChild(this.view.domElement);
    this.container.appendChild(this.view.mirrors);
    this.view.mouse = this.mouse;
    this.view.init(this.physics);

    return this.resize();
  };

  kaleid.prototype.addShape = function(type) {
    var max = ~~Random(3, 10), size = this.physics.particles.length, i, i_, p, s;

    if (size + max > 300) {
      this.physics.particles.splice(1, (size + max) - 300);
      this.physics.springs.splice(1, (size + max) - 300);
    }

    for (i = _i = 0; 0 <= max ? _i <= max : _i >= max; i = 0 <= max ? ++_i : --_i) {
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

    this.view.render(this.physics);
  };

  // handler mouse/touch move
  kaleid.prototype.mousemove = function(e) {
    var touch;
    e.preventDefault();
    if (e.touches && !!e.touches.length) {
      touch = e.touches[0];
      return this.mouse.pos.set(touch.pageX, touch.pageY);
    } else {
      return this.mouse.pos.set(e.clientX, e.clientY);
    }
  };

  // handler for window resize
  kaleid.prototype.resize = function(e) {
    if (e && e.type === "orientationchange") {
      this.landscape = Math.abs(window.orientation);
    }

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container.style.width = this.width + 'px';
    this.container.style.height = this.height + 'px';
    return this.view.setSize(this.width, this.height, this.landscape);
  };

  // update loop
  kaleid.prototype.step = function() {
    this.physics.step();
    if (++this.counter % 3 === 0) {
      return this.view.render(this.physics);
    }
  };

  kaleid.prototype.setTheme = function(theme) {
    if (theme) {
      theme = parseInt(theme, 10);
      this.COLORS = this.THEMES[theme];
    }

    var parts = this.physics.particles;
    for (var i = 0, _length = parts.length; i < _length; i++) {
      parts[i].colour = this.COLORS[(_length - i) % this.COLORS.length];
    }

    return this.view.render(this.physics);
  };

  return kaleid;

})();


// ========= END KALEID OSCOPE JS ===========


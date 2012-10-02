var COLOR_THEMES = [
  [
    'rgba(237,20,91,.5)', 'rgba(255,245,155,.5)', 'rgba(131,203,157,.5)', 'rgba(1,170,199,.5)',
    'rgba(0,173,241,.5)', 'rgba(0,144,187,.5)', 'rgba(144,39,142,.5)', 'rgba(135,129,191,.5)',
    'rgba(50, 50, 122, 0.5)', 'rgba(243,155,195,.5)', 'rgba(237, 20, 91, 0.5)', 'rgba(189, 141, 193, 0.5)',
    'rgba(144,39,142,.5)', 'rgba(255,245,155,.5)', 'rgba(191, 225, 201, 0.5)', 'rgba(238,0,140,.5)'
  ],
  [
    "rgba(255, 255, 255, 0.45)", "rgba(248, 203, 224, 0.45)", "rgba(243, 155, 195, 0.45)", "rgba(238, 0, 140, 0.45)",
    "rgba(254, 250, 203, 0.45)", "rgba(251, 199, 178, 0.45)", "rgba(245, 152, 160, 0.45)", "rgba(236, 9, 114, 0.45)",
    "rgba(184, 229, 250, 0.45)", "rgba(187, 183, 220, 0.45)", "rgba(189, 141, 193, 0.45)", "rgba(190, 26, 141, 0.45)",
    "rgba(191, 225, 201, 0.45)", "rgba(192, 180, 180, 0.45)", "rgba(192, 139, 157, 0.45)", "rgba(190, 30, 116, 0.45)"
  ],
  [
    "rgba(109, 207, 246, 0.45)", "rgba(126, 167, 219, 0.45)", "rgba(135, 129, 191, 0.45)", "rgba(144, 39, 142, 0.45)",
    "rgba(123, 204, 198, 0.45)", "rgba(134, 166, 177, 0.45)", "rgba(141, 128, 158, 0.45)", "rgba(150, 39, 118, 0.45)",
    "rgba(0, 173, 241, 0.45)", "rgba(0, 143, 213, 0.45)", "rgba(0, 114, 187, 0.45)", "rgba(46, 49, 146, 0.45)",
    "rgba(1, 170, 199, 0.45)", "rgba(2, 140, 176, 0.45)", "rgba(0, 113, 157, 0.45)", "rgba(50, 50, 122, 0.45)"
  ],
  [
    "rgba(255, 245, 155, 0.45)", "rgba(253, 197, 138, 0.45)", "rgba(243, 153, 119, 0.45)", "rgba(237, 20, 91, 0.45)",
    "rgba(254, 241, 2, 0.45)", "rgba(254, 193, 14, 0.45)", "rgba(247, 148, 29, 0.45)", "rgba(238, 28, 37, 0.45)",
    "rgba(194, 223, 156, 0.45)", "rgba(194, 179, 140, 0.45)", "rgba(194, 138, 123, 0.45)", "rgba(190, 35, 93, 0.45)",
    "rgba(202, 219, 43, 0.45)", "rgba(201, 176, 47, 0.45)", "rgba(199, 138, 49, 0.45)", "rgba(193, 39, 47, 0.45)"
  ],
  [
    "rgba(131, 203, 157, 0.45)", "rgba(139, 164, 142, 0.45)", "rgba(142, 128, 125, 0.45)", "rgba(148, 44, 97, 0.45)",
    "rgba(142, 198, 65, 0.45)", "rgba(146, 162, 63, 0.45)", "rgba(148, 127, 60, 0.45)", "rgba(152, 45, 51, 0.45)",
    "rgba(2, 168, 158, 0.45)", "rgba(0, 140, 141, 0.45)", "rgba(1, 113, 127, 0.45)", "rgba(57, 50, 101, 0.45)",
    "rgba(0, 165, 79, 0.45)", "rgba(2, 136, 77, 0.45)", "rgba(0, 111, 69, 0.45)", "rgba(54, 53, 59, 0.45)"
  ]
];

// ========= END KALEID COLORS =========


PI_RAD = Math.PI / 180;
TWO_PI = Math.PI * 2;

var view,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

view = (function() {
  function view(scale) {
    this.scale = scale || 1;
    this.setSize = __bind(this.setSize, this);
    this.width = 0;
    this.height = 0;
    this.renderParticles = true;
    this.renderSprings = true;
    this.renderMouse = true;
    this.initialized = false;
    this.renderTime = 0;
    this.canvas = document.createElement('canvas');
    this.mirrors = document.createElement('canvas');
    this.offscreen = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.mctx = this.mirrors.getContext('2d');
    this.octx = this.offscreen.getContext('2d');
    this.domElement = this.canvas;
    this.bleed = false;
    this.reflect = false;
    this.xo = 0;
    this.yo = 0;
  }

  view.prototype.toRadian = function(deg) {
    return deg * this.PI_RAD;
  };

  view.prototype.init = function(physics) {
    return this.initialized = true;
  };

  view.prototype.render = function(physics) {
    if (!this.initialized) {
      return this.init(physics);
    }

    var startTime = new Date().getTime(),
        vel = new Vector(),
        dir = new Vector(),
        parts, springs;

    if (!this.bleed) {
      this.canvas.width = this.canvas.width;
    }

    this.ctx.lineWidth = 1;

    if (this.renderParticles) {
      parts = physics.particles;
      for (var i = 0, _len = parts.length; i < _len; i++) {
        var p = parts[i];

        this.ctx.fillStyle = p.colour || '#FFFFFF';
        this.ctx.beginPath();

        if (p.shape === 'pentagon') {
          // draw this
        } else if (p.shape === 'square') {
          this.ctx.fillRect(p.pos.x - p.radius, p.pos.y - p.radius, p.radius * 2, p.radius * 2);
        } else if (p.shape === 'special') {
          this.ctx.moveTo(p.pos.x - p.radius, p.pos.y);
          this.ctx.lineTo(p.pos.x - p.radius, p.pos.y - p.radius * 1.5);
          this.ctx.lineTo(p.pos.x, p.pos.y);
          this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, TWO_PI, false);
          this.ctx.moveTo(p.pos.x + p.radius, p.pos.y);
          this.ctx.lineTo(p.pos.x + p.radius, p.pos.y - p.radius * 1.5);
          this.ctx.lineTo(p.pos.x, p.pos.y);
          this.ctx.arc(p.pos.x, p.pos.y, p.radius+1, 0, TWO_PI, false);

        } else if (p.shape === 'triangle') {
          var side = ~~(p.radius * (6 / Math.sqrt(3)));
          this.ctx.moveTo(p.pos.x, p.pos.y - p.radius);
          this.ctx.lineTo(p.pos.x - side/5, p.pos.y + side / 5);
          this.ctx.lineTo(p.pos.x + side/5, p.pos.y + side / 5);
        } else { // circle
          this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, TWO_PI, false);
        }

        this.ctx.closePath();
        this.ctx.fill();
      }
    }

    if (this.renderSprings) {
      this.ctx.strokeStyle = 'rgba(249, 249, 222, 0.2)';
      this.ctx.beginPath();

      sprs = physics.springs;
      for (var i = 0, _len = sprs.length; i < _len; i++) {
        var s = sprs[i];
        this.ctx.moveTo(s.p1.pos.x, s.p1.pos.y);
        this.ctx.lineTo(s.p2.pos.x, s.p2.pos.y);
      }
      this.ctx.stroke();
    }

    if (this.renderMouse) {
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      this.ctx.beginPath();
      this.ctx.arc(this.mouse.pos.x, this.mouse.pos.y, 20, 0, TWO_PI);
      this.ctx.fill();
    }

    if (this.reflect) {
      this.octx.clearRect(0, 0, this.width, this.height);
      this.mctx.fillStyle = '#f9f9de';

      this.octx.save();
      this.octx.translate(this.xo, this.yo);
      this.octx.rotate(90 * PI_RAD);
      this.octx.scale(-1, 1);
      this.octx.drawImage(this.canvas, 0, 0);
      this.octx.restore();

      this.octx.save();
      this.octx.translate(this.xo, this.yo);
      this.octx.scale(-1, 1);
      this.octx.drawImage(this.offscreen, -this.xo, -this.yo);
      this.octx.scale(-1, -1);
      this.octx.drawImage(this.offscreen, -this.xo, -this.yo);
      this.octx.restore();
      
      this.mctx.fillRect(0, 0, this.width, this.height);
      this.mctx.drawImage(this.offscreen, 0, 0);
    }

    return this.renderTime = new Date().getTime() - startTime;
  };

  view.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.xo = ~~(this.width / 2);
    this.yo = ~~(this.height / 2);
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.mirrors.width = this.width;
    this.mirrors.height = this.height;
    this.offscreen.width = this.width;
    return this.offscreen.height = this.height;
  };

  return view;
})();

// ========= END KALEID CANVAS OBJ =========


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
    this.edge = new EdgeWrap(wall1, wall2);
  };


  kaleid.prototype.init = function(container, view) {
    this.container = container;
    this.view = view;

    this.setup();

    var startEvent = (Modernizr && Modernizr.touch) ? 'touchmove' : 'mousemove';

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
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.container.style.width = this.width + 'px';
    this.container.style.height = this.height + 'px';
    return this.view.setSize(this.width, this.height);
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


(function() {
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame =
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}());

// ========= END REQUEST ANIMATION FRAME =========

var controls,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

controls = (function() {
  function controls(kaleid) {
    this.playing = false;
  }

  controls.prototype.init = function(kaleid) {
    this.oscope = kaleid;
    this.update = __bind(this.update, this);
    this.playing = true;
    this.update();
    this.items = {};
    this.themes = $('#color-themes').hide();
    this.pixelate = false;

    this.actions = {
      'kaleidoscope': this.toggleMirrors,
      'pixelate': this.togglePixelate,
      'bleed': this.toggleBleed,
      'colors': this.toggleThemes,
      'edit': this.toggleEdit,
      'hide': this.toggleMenu,
      'pause': this.togglePause,
      'destroy-all': this.destoryAll
    };

    var item, startEvent = (Modernizr && Modernizr.touch) ? 'touchend' : 'mouseup';
    for (var action in this.actions) {
      item = $('#' + action);
      item.bind(startEvent, __bind(this.actions[action], this));
      item.data('action', action);
      this.items[action] = item;
    }

    this.setupColors();
    this.toggleEdit();

    $('li.shape').bind(startEvent, __bind(this.addShape, this));
    $(document).bind('keypress', __bind(this.togglePause, this));
  }

  controls.prototype.destoryAll = function(e) {

  };

  controls.prototype.togglePause = function(e) {
    if (e && e.type === 'keypress') {
      var code = e.keyCode || e.which;
      if (code && code === 32) { // spacebar
        this.playing = !this.playing;
      }
    } else {
      this.items['pause'].toggleClass('active');
      this.playing = !this.playing;
    }
  };

  controls.prototype.update = function(time) {
    requestAnimationFrame(this.update);

    if (this.playing && this.oscope) {
      this.oscope.step();
      this.removeSpring(time);
    }
  };

  controls.prototype.removeSpring = function(time) {
    if (time % 500 === 0) {
      var index = ~~Random(1, this.oscope.physics.springs.length - 1),
      removed = this.oscope.physics.springs[index];

      if (removed) {
        removed.p2.behaviours.push(new Attraction(removed.p1.pos, 500, -2000));
        this.oscope.physics.springs.splice(index, 1);
      }
    }
  };

  // shape controls
  controls.prototype.addShape = function(e) {
    e.stopPropagation();
    this.oscope.addShape($(e.target).parent().attr('id'));
  };

  // color controls
  controls.prototype.setupColors = function() {
    var startEvent = (Modernizr && Modernizr.touch) ? 'touchend' : 'mouseup',
        size = this.oscope.THEMES.length,
        themeh = this.oscope.width/(size * 4), theme, li;

    for (var i = 0, _len = this.oscope.THEMES.length; i < _len; i++) {
      theme = this.oscope.THEMES[i];
      li = $('<li>').attr('id', i + '_theme');
      li.append($('<h2>').text(i));

      for (var j = 0, _jlen = theme.length; j < _jlen; j++) {
        li.append($('<span style="background-color:' + theme[j] + '; height:' + themeh + 'px">'));
      }

      this.themes.append(li);
      li.bind(startEvent, __bind(this.selectTheme, this));
    }
  };

  controls.prototype.selectTheme = function(e) {
    e.stopPropagation();

    this.oscope.setTheme(($(e.target).parent().attr('id')));
    this.toggleThemes();
  };


  // state controls
  controls.prototype.toggleBleed = function(e) {
    e && e.stopPropagation();
    
    this.oscope.view.bleed = !this.oscope.view.bleed;
    this.items['bleed'].toggleClass('active');
  };

  controls.prototype.toggleEdit = function(e) {
    e && e.stopPropagation();
    
    this.togglePause();
    this.items['edit'].toggleClass('open');

    if (!this.playing) {
      this.oscope.view.pixelate = false;
      this.items['pixelate'].removeClass('active');
    }
  };

  controls.prototype.toggleMenu = function(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    this.items['hide'].toggleClass('flip')
                      .siblings().toggle()
                      .parent().toggleClass('collapsed');
    this.items['destroy-all'].toggle();
  };

  controls.prototype.toggleMirrors = function(e) {
    e && e.stopPropagation();

    this.items['kaleidoscope'].toggleClass('active');
    this.oscope.view.reflect = !this.oscope.view.reflect;

    if (!this.oscope.view.reflect) {
      $(this.oscope.view.canvas).fadeIn('fast');
      $(this.oscope.view.mirrors).fadeOut('fast');
      this.oscope.view.mctx.clearRect(0, 0, this.oscope.width, this.oscope.height);
    } else {
      $(this.oscope.view.canvas).fadeOut('fast');
      $(this.oscope.view.mirrors).fadeIn('fast');

      !this.playing && this.oscope.view.render(this.oscope.physics);
    }
  };

  controls.prototype.togglePixelate = function(e) {
    e && e.stopPropagation();

    this.pixelate = !this.pixelate;

    if (this.pixelate) {
      $('#pixel-img').remove();
      this.items['pixelate'].addClass('active');

      if (this.oscope.view.reflect) {
        data = this.oscope.view.mirrors.toDataURL('png/image');
      } else {
        data = this.oscope.view.canvas.toDataURL('png/image');
      }
      
      var obj = this,
          img = document.createElement('img');
          img.src = data;
          img.id = 'pixel-img';
          img.style.opacity = 0;

      img.addEventListener('load', function(){
        img.closePixelate([
          { shape: 'square', resolution: 18, size: 20, offset: 0, alpha: 0.271 },
          { shape: 'diamond', resolution: 18, size: 38, offset: 0, alpha: 0.651 }
        ]);

        setTimeout(function(){
          $('#pixel-img').css('opacity', 0.2);
          obj.items['pixelate'].removeClass('active');
        }, 500);

      }, false);
    
      this.oscope.container.appendChild(img);
      this.pixelate = false;  
    }
  };

  controls.prototype.toggleThemes = function(e) {
    e && e.stopPropagation();

    this.items['colors'].toggleClass('active');
    this.themes.slideToggle('fast');
    
    if (!this.items['edit'].hasClass('open')) {
      this.playing = !this.playing;
    }
  };

  return controls;

})();

var kaleidoscope = new kaleid();
    kaleidoscope.init(document.getElementById('viewport'), new view());
var controllers = new controls();
    controllers.init(kaleidoscope);
    controllers.oscope.addShape('circle');
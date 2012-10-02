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
          // left ear
          this.ctx.moveTo(p.pos.x - p.radius, p.pos.y);
          this.ctx.lineTo(p.pos.x - p.radius, p.pos.y - p.radius * 1.5);
          this.ctx.lineTo(p.pos.x, p.pos.y);
          this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, TWO_PI, false);

          // right ear
          this.ctx.moveTo(p.pos.x + p.radius, p.pos.y);
          this.ctx.lineTo(p.pos.x + p.radius, p.pos.y - p.radius * 1.5);
          this.ctx.lineTo(p.pos.x, p.pos.y);
          this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, TWO_PI, false);

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


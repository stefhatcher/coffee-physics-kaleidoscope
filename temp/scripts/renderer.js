var Renderer,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Renderer = (function() {

  function Renderer() {
    this.setSize = __bind(this.setSize, this);
    this.TO_RADIAN = Math.PI / 180;
    this.TWO_PI = Math.PI * 2;
    this.width = 0;
    this.height = 0;
    this.landscape = 0;
    this.centerX = 0;
    this.centerY = 0;
    this.initialized = false;
    this.renderTime = 0;
    this.cnvs = document.createElement('canvas');
    this.ctx = this.cnvs.getContext('2d');
    this.mirror = document.createElement('canvas');
    this.mctx = this.mirror.getContext('2d');
    this.offscrn = document.createElement('canvas');
    this.octx = this.offscrn.getContext('2d');
    this.bleeding = false;
    this.reflecting = false;
  }

  Renderer.prototype.init = function(physics) {
    return this.initialized = true;
  };

  Renderer.prototype.render = function(physics) {
    var direction, p, s, time, vel, _i, _j, _len, _len1, _ref, _ref1;
    if (!this.initialized) {
      this.init(physics);
    }
    time = new Date().getTime();
    vel = new Vector();
    direction = new Vector();
    if (!this.bleeding) {
      this.cnvs.width = this.cnvs.width;
    }
    _ref = physics.particles;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      this.ctx.fillStyle = p.colour || '#FFFFFF';
      if (p.shape === 'pentagon') {
        this.drawPentagon(p);
      } else if (p.shape === 'square') {
        this.drawSquare(p);
      } else if (p.shape === 'special') {
        this.drawCat(p);
      } else if (p.shape === 'triangle') {
        this.drawTriangle(p);
      } else {
        this.drawCircle(p);
      }
    }
    this.ctx.strokeStyle = 'rgba(249, 249, 222, 0.1)';
    this.ctx.beginPath();
    _ref1 = physics.springs;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      s = _ref1[_j];
      this.ctx.moveTo(s.p1.pos.x, s.p1.pos.y);
      this.ctx.lineTo(s.p2.pos.x, s.p2.pos.y);
    }
    this.ctx.stroke();
    this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
    this.ctx.beginPath();
    this.ctx.arc(this.mouse.pos.x, this.mouse.pos.y, 20, 0, this.TWO_PI);
    this.ctx.fill();
    if (this.reflecting) {
      this.octx.clearRect(0, 0, this.width, this.height);
      this.mctx.fillStyle = '#f9f9de';
      this.octx.save();
      this.octx.beginPath();
      this.octx.moveTo(0, 0);
      this.octx.lineTo(this.centerX, this.centerY);
      this.octx.lineTo(0, this.centerY);
      this.octx.lineTo(0, 0);
      this.octx.closePath();
      this.octx.clip();
      this.octx.drawImage(this.cnvs, 0, 0);
      this.octx.restore();
      this.octx.save();
      this.octx.globalCompositeOperation = 'destination-over';
      this.octx.translate(this.centerX, this.centerY);
      this.octx.scale(-1, 1);
      this.octx.rotate((180 * this.TO_RADIAN) - Math.atan(this.centerY / this.centerX) * 2);
      this.octx.drawImage(this.offscrn, -this.centerX, -this.centerY);
      this.octx.scale(-1, 1);
      this.octx.drawImage(this.offscrn, this.centerX, -this.centerY);
      this.octx.restore();
      if (this.landscape === 90) {
        this.octx.save();
        this.octx.globalCompositeOperation = 'destination-over';
        this.octx.translate(this.centerX, this.centerY);
        this.octx.scale(-1, 1);
        this.octx.rotate((135 * this.TO_RADIAN) - Math.atan(this.centerY / this.centerX) * 2.4);
        this.octx.drawImage(this.offscrn, -this.centerX, -this.centerY);
        this.octx.scale(-1, 1);
        this.octx.drawImage(this.offscrn, this.centerX, -this.centerY);
        this.octx.restore();
      }
      this.octx.clearRect(this.centerX, 0, this.centerX, this.height);
      this.octx.clearRect(0, this.centerY, this.width, this.centerY);
      this.octx.save();
      this.octx.translate(this.centerX, this.centerY);
      this.octx.scale(-1, -1);
      this.octx.drawImage(this.offscrn, -this.centerX, -this.centerY);
      this.octx.scale(-1, 1);
      this.octx.drawImage(this.offscrn, -this.centerX, -this.centerY);
      this.octx.restore();
      this.mctx.fillRect(0, 0, this.width, this.height);
      this.mctx.drawImage(this.offscrn, 0, 0);
    }
    return this.renderTime = new Date().getTime() - time;
  };

  Renderer.prototype.drawCat = function(p) {
    this.ctx.beginPath();
    this.ctx.moveTo(p.pos.x - p.radius, p.pos.y);
    this.ctx.lineTo(p.pos.x - p.radius, p.pos.y - p.radius * 1.5);
    this.ctx.lineTo(p.pos.x, p.pos.y);
    this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, this.TWO_PI, false);
    this.ctx.moveTo(p.pos.x + p.radius, p.pos.y);
    this.ctx.lineTo(p.pos.x + p.radius, p.pos.y - p.radius * 1.5);
    this.ctx.lineTo(p.pos.x, p.pos.y);
    this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, this.TWO_PI, false);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Renderer.prototype.drawCircle = function(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.pos.x, p.pos.y, p.radius, 0, this.TWO_PI, false);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Renderer.prototype.drawPentagon = function(p) {
    this.ctx.beginPath();
    this.ctx.moveTo(p.pos.x, p.pos.y - p.radius);
    this.ctx.lineTo(p.pos.x - p.radius, p.pos.y);
    this.ctx.lineTo(p.pos.x + -p.radius * 0.5, p.pos.y + p.radius * (Math.sqrt(3) / 2));
    this.ctx.lineTo(p.pos.x + p.radius * 0.5, p.pos.y + p.radius * (Math.sqrt(3) / 2));
    this.ctx.lineTo(p.pos.x + p.radius, p.pos.y);
    this.ctx.lineTo(p.pos.x, p.pos.y - p.radius);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Renderer.prototype.drawSquare = function(p) {
    this.ctx.beginPath();
    this.ctx.fillRect(p.pos.x - p.radius, p.pos.y - p.radius, p.radius * 2, p.radius * 2);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Renderer.prototype.drawTriangle = function(p) {
    var side;
    side = ~~(p.radius * (6 / Math.sqrt(3)));
    this.ctx.beginPath();
    this.ctx.moveTo(p.pos.x, p.pos.y - p.radius);
    this.ctx.lineTo(p.pos.x - side / 5, p.pos.y + side / 5);
    this.ctx.lineTo(p.pos.x + side / 5, p.pos.y + side / 5);
    this.ctx.closePath();
    return this.ctx.fill();
  };

  Renderer.prototype.reset = function() {
    this.cnvs.width = this.cnvs.width;
    this.mirror.width = this.mirror.width;
    this.offscrn.width = this.offscrn.width;
    return this.initialized = false;
  };

  Renderer.prototype.setSize = function(width, height) {
    this.landscape = width > height ? 90 : 0;
    this.width = width;
    this.height = height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.cnvs.width = this.width;
    this.cnvs.height = this.height;
    this.mirror.width = this.width;
    this.mirror.height = this.height;
    this.offscrn.width = this.width;
    return this.offscrn.height = this.height;
  };

  return Renderer;

})();

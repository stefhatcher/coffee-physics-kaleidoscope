var Controls, k_interface, k_world,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Controls = (function() {

  function Controls() {
    this.update = __bind(this.update, this);

    this.toggleThemes = __bind(this.toggleThemes, this);

    this.togglePixelate = __bind(this.togglePixelate, this);

    this.togglePause = __bind(this.togglePause, this);

    this.toggleMirrors = __bind(this.toggleMirrors, this);

    this.toggleMenu = __bind(this.toggleMenu, this);

    this.toggleEdit = __bind(this.toggleEdit, this);

    this.toggleBleed = __bind(this.toggleBleed, this);

    this.step = __bind(this.step, this);

    this.selectTheme = __bind(this.selectTheme, this);

    this.resetAll = __bind(this.resetAll, this);

    this.exportAll = __bind(this.exportAll, this);

    this.addShape = __bind(this.addShape, this);
    this.playing = false;
  }

  Controls.prototype.init = function(world) {
    var action, item;
    this.world = world;
    this.playing = true;
    this.pixelate = false;
    this.pixelImgId = 'pixel-img';
    this.update();
    this.themes = $('#color-themes').hide();
    this.items = {};
    this.actions = {
      'kaleidoscope': this.toggleMirrors,
      'pixelate': this.togglePixelate,
      'bleed': this.toggleBleed,
      'colors': this.toggleThemes,
      'edit': this.toggleEdit,
      'hide': this.toggleMenu,
      'animate': this.togglePause,
      'reset': this.resetAll,
      'screenshot a': this.exportAll
    };
    if (Modernizr.touch) {
      this.startEvent = 'touchmove touchend';
    } else {
      this.startEvent = 'mousedown';
    }
    for (action in this.actions) {
      item = $('#' + action);
      item.bind(this.startEvent, this.actions[action]);
      item.data('action', action);
      this.items[action] = item;
    }
    this.setupColors();
    this.toggleEdit();
    $('li.shape').bind(this.startEvent, this.addShape);
    $(this.world.container).bind(this.startEvent, this.step);
    if (!Modernizr.localstorage) {
      return this.items['screenshot a'].remove();
    }
  };

  Controls.prototype.addShape = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    return this.world.addShape($(e.target).parent().attr('id'));
  };

  Controls.prototype.exportAll = function(e) {
    var data;
    e.stopPropagation();
    e.preventDefault();
    if (this.pixelate) {
      data = $('#' + this.pixelImgId)[0].toDataURL('jpg/image');
    } else if (this.world.renderer.reflecting) {
      data = this.world.renderer.mirror.toDataURL('jpg/image');
    } else {
      data = this.world.renderer.cnvs.toDataURL('jpg/image');
    }
    return localStorage.setItem('kaleidoscope_screenshot', data);
  };

  Controls.prototype.pause = function(e) {
    this.items['animate'].removeClass('playing').addClass('paused');
    return this.playing = false;
  };

  Controls.prototype.play = function() {
    this.items['animate'].removeClass('paused').addClass('playing');
    this.items['edit'].removeClass('open');
    this.items['reset'].hide;
    this.playing = true;
    if (this.pixelate) {
      return this.togglePixelate();
    }
  };

  Controls.prototype.removeSpring = function(time) {
    var index, removed;
    if (time % 500 === 0) {
      index = ~~Random(1, this.world.physics.springs.length - 1);
      removed = this.world.physics.springs[index];
      if (removed != null) {
        removed.p2.behaviours.push(new Attraction(removed.p1.pos, 500, -2000));
        return this.world.physics.springs.splice(index, 1);
      }
    }
  };

  Controls.prototype.resetAll = function(e) {
    if (e != null) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (confirm('Clear all of the things? You sure?')) {
      this.pixelate = false;
      this.items['pixelate'].removeClass('active');
      this.pause();
      this.items['edit'].addClass('open');
      this.world.physics.destroy();
      this.world.physics = null;
      this.world.renderer.reset();
      this.world.setup();
      localStorage.setItem('kaleidoscope_screenshot', '');
      $('#' + this.pixelImgId).remove();
      $(this.world.renderer.cnvs).show();
      return $(this.world.renderer.mirror).show();
    }
  };

  Controls.prototype.selectTheme = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.world.setTheme($(e.target).parent().attr('id'));
    return this.toggleThemes();
  };

  Controls.prototype.setupColors = function() {
    var color, i, li, size, theme, themeh, _i, _j, _len, _len1, _ref, _results;
    size = this.world.THEMES.length;
    themeh = this.world.width / (size * 4);
    _ref = this.world.THEMES;
    _results = [];
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      theme = _ref[i];
      li = $('<li>').attr('id', i + '_theme');
      li.append($('<h2>').text(i));
      for (_j = 0, _len1 = theme.length; _j < _len1; _j++) {
        color = theme[_j];
        li.append($('<span style="background-color:' + color + '; height:' + themeh + 'px">'));
      }
      this.themes.append(li);
      _results.push(li.bind(this.startEvent, this.selectTheme));
    }
    return _results;
  };

  Controls.prototype.step = function(e) {
    if (!this.playing) {
      this.world.step();
      return this.world.renderer.render(this.world.physics);
    }
  };

  Controls.prototype.toggleBleed = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.world.renderer.bleeding = !this.world.renderer.bleeding;
    this.items['bleed'].toggleClass('active');
    if (!this.playing) {
      return this.world.renderer.render(this.world.physics);
    }
  };

  Controls.prototype.toggleEdit = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.items['edit'].toggleClass('open');
    if (this.items['edit'].hasClass('open')) {
      this.pause();
      return this.items['reset'].show();
    } else {
      this.play();
      this.items['colors'].removeClass('active');
      this.themes.hide();
      return this.items['reset'].hide();
    }
  };

  Controls.prototype.toggleMenu = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.items['hide'].toggleClass('flip').siblings().toggle().parent().toggleClass('collapsed');
    this.items['animate'].toggleClass('minimized');
    if (this.items['hide'].hasClass('flip')) {
      return this.items['reset'].hide();
    } else if (this.items['edit'].hasClass('open')) {
      return this.items['reset'].show();
    }
  };

  Controls.prototype.toggleMirrors = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    if (!this.pixelate) {
      this.items['kaleidoscope'].toggleClass('active');
      this.world.renderer.reflecting = !this.world.renderer.reflecting;
      if (!this.world.renderer.reflecting) {
        $(this.world.renderer.cnvs).show();
        $(this.world.renderer.mirror).hide();
        return this.world.renderer.mctx.clearRect(0, 0, this.world.width, this.world.height);
      } else {
        $(this.world.renderer.cnvs).hide();
        $(this.world.renderer.mirror).show();
        if (!this.playing) {
          return this.world.renderer.render(this.world.physics);
        }
      }
    }
  };

  Controls.prototype.togglePause = function(e) {
    if (!this.playing) {
      return this.play();
    } else {
      return this.pause();
    }
  };

  Controls.prototype.togglePixelate = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.items['pixelate'].toggleClass('active');
    this.pixelate = !this.pixelate;
    if (this.pixelate) {
      return this.updatePixelate();
    } else {
      $(this.world.renderer.cnvs).fadeIn(0);
      $(this.world.renderer.mirror).fadeIn(0);
      return $('#' + this.pixelImgId).remove();
    }
  };

  Controls.prototype.toggleThemes = function(e) {
    if (e != null) {
      e.stopPropagation();
    }
    this.items['colors'].toggleClass('active');
    return this.themes.slideToggle('fast');
  };

  Controls.prototype.update = function(time) {
    requestAnimationFrame(this.update);
    if (this.playing && this.world) {
      this.world.step();
      return this.removeSpring(time);
    }
  };

  Controls.prototype.updatePixelate = function() {
    var data, img,
      _this = this;
    if (this.world.renderer.reflecting) {
      data = this.world.renderer.mirror.toDataURL('png/image');
    } else {
      data = this.world.renderer.cnvs.toDataURL('png/image');
    }
    img = document.createElement('img');
    img.src = data;
    img.id = this.pixelImgId;
    img.style.opacity = 0;
    img.addEventListener('load', function() {
      img.closePixelate([
        {
          shape: 'square',
          resolution: 18,
          size: 20,
          offset: 0,
          alpha: 0.271
        }, {
          shape: 'diamond',
          resolution: 18,
          size: 38,
          offset: 0,
          alpha: 0.651
        }
      ]);
      $('#' + _this.pixelImgId).css('opacity', 1);
      $(_this.world.renderer.cnvs).fadeOut(0);
      return $(_this.world.renderer.mirror).fadeOut(0);
    }, false);
    return this.world.container.appendChild(img);
  };

  return Controls;

})();

$('body').height(window.innerHeight + 100 + 'px');

window.scrollTo(0, 1);

$('body').height(window.innerHeight + 'px');

k_world = new World();

k_world.init(document.getElementById('viewport'), new Renderer());

k_interface = new Controls();

k_interface.init(k_world);

k_interface.world.addShape('circle');

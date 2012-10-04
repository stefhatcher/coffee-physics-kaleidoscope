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
    this.world = kaleid;
    this.update = __bind(this.update, this);
    this.playing = true;
    this.update();
    this.items = {};
    this.themes = $('#color-themes').hide();
    this.pixelate = false;
    this.pixelImgId = 'pixel-img';

    this.actions = {
      'kaleidoscope': this.toggleMirrors,
      'pixelate': this.togglePixelate,
      'bleed': this.toggleBleed,
      'colors': this.toggleThemes,
      'edit': this.toggleEdit,
      'hide': this.toggleMenu,
      'animate': this.togglePause,
      'reset': this.resetAll,
      'screenshot a': this.export
    };

    var item, startEvent = (Modernizr && Modernizr.touch) ? 'touchmove touchend' : 'mousedown';
    for (var action in this.actions) {
      item = $('#' + action);
      item.bind(startEvent, __bind(this.actions[action], this));
      item.data('action', action);
      this.items[action] = item;
    }

    this.setupColors();
    this.toggleEdit();

    $('li.shape').bind(startEvent, __bind(this.addShape, this));
    $(this.world.container).bind(startEvent, __bind(this.step, this));

    if (!Modernizr.localstorage) {
      this.items['screenshot a'].remove();
    }
  }

  controls.prototype.export = function(e) {
    e.stopPropagation();
    e.preventDefault();

    var data;

    if (this.pixelate) {
      data = document.getElementById(this.pixelImgId).toDataURL('png/image');
    } else if (this.world.view.reflect) {
      data = this.world.view.mirrors.toDataURL('png/image');
    } else {
      data = this.world.view.canvas.toDataURL('png/image');
    }

    localStorage.setItem('kaleidoscope_screenshot', data);

    return true;
  };

  controls.prototype.resetAll = function(e) {
    e && e.stopPropagation();

    if (confirm("Clear all of the things?")) {
      this.pixelate = false;
      this.items['pixelate'].removeClass('active');

      this.pause();
      this.items['edit'].addClass('open');

      this.world.physics.destroy();
      this.world.physics = null;
      this.world.view.reset();

      this.world.setup();

      localStorage.setItem('kaleidoscope_screenshot', '');

      $('#' + this.pixelImgId).remove();
      $(this.world.view.canvas).show();
      $(this.world.view.mirrors).show();
    }
  };

  controls.prototype.togglePause = function(e) {
    return (!this.playing) ? this.play() : this.pause();
  };

  controls.prototype.pause = function(e) {
    this.items['animate'].removeClass('playing').addClass('paused');
    this.playing = false;
  };

  controls.prototype.play = function() {
    this.items['animate'].removeClass('paused').addClass('playing');
    this.items['edit'].removeClass('open');
    this.items['reset'].hide();
    this.playing = true;

    this.pixelate && this.togglePixelate();
  };

  controls.prototype.step = function(e) {
    if (!this.playing) {
      this.world.step();
      this.world.view.render(this.world.physics);
    }
  };

  controls.prototype.update = function(time) {
    requestAnimationFrame(this.update);

    if (this.playing && this.world) {
      this.world.step();
      this.removeSpring(time);
    }
  };

  controls.prototype.removeSpring = function(time) {
    if (time % 500 === 0) {
      var index = ~~Random(1, this.world.physics.springs.length - 1),
      removed = this.world.physics.springs[index];

      if (removed) {
        removed.p2.behaviours.push(new Attraction(removed.p1.pos, 500, -2000));
        this.world.physics.springs.splice(index, 1);
      }
    }
  };

  // shape controls
  controls.prototype.addShape = function(e) {
    e && e.stopPropagation();
    this.world.addShape($(e.target).parent().attr('id'));
  };

  // color controls
  controls.prototype.setupColors = function() {
    var startEvent = (Modernizr && Modernizr.touch) ? 'touchend' : 'mouseup',
        size = this.world.THEMES.length,
        themeh = this.world.width/(size * 4), theme, li;

    for (var i = 0, _len = this.world.THEMES.length; i < _len; i++) {
      theme = this.world.THEMES[i];
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
    e && e.stopPropagation();

    this.world.setTheme(($(e.target).parent().attr('id')));
    this.toggleThemes();
  };

  // state controls
  controls.prototype.toggleBleed = function(e) {
    e && e.stopPropagation();
    
    this.world.view.bleed = !this.world.view.bleed;
    this.items['bleed'].toggleClass('active');
    !this.playing && this.world.view.render(this.world.physics);
  };

  controls.prototype.toggleEdit = function(e) {
    e && e.stopPropagation();

    this.items['edit'].toggleClass('open');

    if (this.items['edit'].hasClass('open')) {
      this.pause();
      this.items['reset'].show();
    } else {
      this.play();
      this.items['colors'].removeClass('active');
      this.themes.hide();
      this.items['reset'].hide();
    }
  };

  controls.prototype.toggleMenu = function(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    this.items['hide'].toggleClass('flip')
                      .siblings().toggle()
                      .parent().toggleClass('collapsed');

    this.items['animate'].toggleClass('minimized');

    if (this.items['hide'].hasClass('flip')) {
      this.items['reset'].hide();
    } else if (this.items['edit'].hasClass('open')) {
      this.items['reset'].show();
    }
  };

  controls.prototype.toggleMirrors = function(e) {
    e && e.stopPropagation();

    this.items['kaleidoscope'].toggleClass('active');
    this.world.view.reflect = !this.world.view.reflect;

    if (!this.pixelate) {
      if (!this.world.view.reflect) {
        $(this.world.view.canvas).show();
        $(this.world.view.mirrors).hide();
        this.world.view.mctx.clearRect(0, 0, this.world.width, this.world.height);
      } else {
        $(this.world.view.canvas).hide();
        $(this.world.view.mirrors).show();
        !this.playing && this.world.view.render(this.world.physics);
      }
    }
  };

  controls.prototype.togglePixelate = function(e) {
    e && e.stopPropagation();

    this.items['pixelate'].toggleClass('active');
    this.pixelate = !this.pixelate;

    if (this.pixelate) {
      // pixelate the currently visible world
      if (this.world.view.reflect) {
        data = this.world.view.mirrors.toDataURL('png/image');
      } else {
        data = this.world.view.canvas.toDataURL('png/image');
      }
      
      var obj = this,
          img = document.createElement('img');
          img.src = data;
          img.id = this.pixelImgId;
          img.style.opacity = 0;

      img.addEventListener('load', function(){
        img.closePixelate([
          { shape: 'square', resolution: 18, size: 20, offset: 0, alpha: 0.271 },
          { shape: 'diamond', resolution: 18, size: 38, offset: 0, alpha: 0.651 }
        ]);

        $('#' + obj.pixelImgId).css('opacity', 1);
        $(obj.world.view.canvas).fadeOut(0);
        $(obj.world.view.mirrors).fadeOut(0);
        
      }, false);
    
      this.world.container.appendChild(img);
    } else {
      $(this.world.view.canvas).fadeIn(0);
      $(this.world.view.mirrors).fadeIn(0);
      $('#' + this.pixelImgId).remove();
    }
  };

  controls.prototype.toggleThemes = function(e) {
    e && e.stopPropagation();

    this.items['colors'].toggleClass('active');
    this.themes.slideToggle('fast');
  };

  return controls;

})();

var kaleidoscope = new kaleid();
    kaleidoscope.init(document.getElementById('viewport'), new view());
var controllers = new controls();
    controllers.init(kaleidoscope);
    controllers.world.addShape('circle');
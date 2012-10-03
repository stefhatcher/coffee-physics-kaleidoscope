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
    $(this.oscope.container).bind(startEvent, __bind(this.step, this));
  }

  controls.prototype.destoryAll = function(e) {

  };

  controls.prototype.togglePause = function(e) {
    if (!this.playing) {
      this.play();
      this.items['edit'].removeClass('open')
    } else {
      this.pause();
    }
  };

  controls.prototype.pause = function(e) {
    this.items['pause'].removeClass('active');
    this.playing = false;
  };

  controls.prototype.play = function() {
    this.items['pause'].addClass('active');
    this.playing = true;
  };

  controls.prototype.step = function(e) {
    if (!this.playing) {
      this.oscope.step();
      this.oscope.view.render(this.oscope.physics);
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

    this.items['edit'].toggleClass('open');

    if (this.items['edit'].hasClass('open')) {
      this.pause();
    } else {
      this.play();
      this.items['colors'].removeClass('active');
      this.themes.hide();
    }
  };

  controls.prototype.toggleMenu = function(e) {
    e && e.preventDefault();
    e && e.stopPropagation();

    this.items['hide'].toggleClass('flip')
                      .siblings().toggle()
                      .parent().toggleClass('collapsed');

    this.items['destroy-all'].toggle();
    this.items['pause'].toggleClass('minimized');
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
          $('#pixel-img').css('opacity', 0.4);
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
  };

  return controls;

})();

var kaleidoscope = new kaleid();
    kaleidoscope.init(document.getElementById('viewport'), new view());
var controllers = new controls();
    controllers.init(kaleidoscope);
    controllers.oscope.addShape('circle');
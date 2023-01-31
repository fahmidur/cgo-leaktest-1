console.log('--- main.js ---');

//--- for reference ---
//# runtime.MemStats
//# Alloc = 530104
//# TotalAlloc = 530104
//# Sys = 14398728
//# Lookups = 0
//# Mallocs = 1614
//# Frees = 79
//# HeapAlloc = 530104
//# HeapSys = 3866624
//# HeapIdle = 2875392
//# HeapInuse = 991232
//# HeapReleased = 2842624
//# HeapObjects = 1535
//# Stack = 327680 / 327680
//# MSpan = 30960 / 32544
//# MCache = 19200 / 31200
//# BuckHashSys = 1445027
//# GCSys = 8098768
//# OtherSys = 596885
//# NextGC = 4194304
//# LastGC = 0

function HeapWatcher(el) {
  var self = this;
  self.logbase = 'HeapWatcher. ';
  var iburl = el.data('burl') || null;

  self.skeys = [
    'Mallocs', 
    'Frees',
    'Alloc',
    //'TotalAlloc', // too big
    'HeapAlloc',
    'HeapSys', // also big
    'HeapObjects',
  ];
  self.burl = null;
  self.autostop_sec = 0;
  self.watch_started = false;
  self.watch_started_ts = null;
  self.watch_interval = null;
  self.xleak_interval = null;
  self.countdown_interval = null;
  self.autostop_timeout = null;

  self.els = {};
  self.el = self.elmake(el);
  self.set_autostop_sec(self.autostop_sec);

  self.labels = [];
  self.datasets = [];
  self.skeys.forEach(function(key) {
    self.datasets.push(
      {
        label: key,
        data: [],
      }
    );
  });

  self.chart = new Chart(self.els.canvas0, {
    type: 'line',
    data: {
      labels: self.labels,
      datasets: self.datasets,
    },
    options: {
      scales: {
      }
    }
  });
  
  if(iburl) {
    self.set_burl(iburl);
  }
  self.set_watch_started(self.watch_started);
  self.state_restore();
}

HeapWatcher.prototype.set_autostop_sec = function(sec) {
  var self = this;
  console.log(self.logbase, 'set_autostop_sec. sec=', sec);
  self.autostop_sec = sec;
  self.els.input_autostop.val(sec);
};

HeapWatcher.prototype.state_restore = function() {
  var self = this;
  console.log(self.logbase, 'state_restore');
  var local_burl = localStorage.getItem('hw.burl');
  if(local_burl) {
    self.set_burl(local_burl);
  }
};

HeapWatcher.prototype.state_save = function() {
  var self = this;
  if(self.burl) {
    localStorage.setItem('hw.burl', self.burl);
  }
};

HeapWatcher.prototype.set_burl = function(burl) {
  var self = this;
  console.log('set_burl. burl=', burl);
  self.burl = burl;
  self.els.input_burl.val(self.burl);
};

HeapWatcher.prototype.set_watch_started = function(bool) {
  var self = this; 
  self.watch_started = bool;
  if(bool) {
    self.els.btn_start.hide();
    self.els.btn_stop.show();
    self.watch_started_ts = (new Date()).valueOf();
  }
  else {
    self.els.btn_stop.hide();
    self.els.btn_start.show();
  }
};

HeapWatcher.prototype.watch_stop = function() {
  var self = this;
  self.set_watch_started(false);
  clearInterval(self.watch_interval);
  clearInterval(self.xleak_interval);
  clearInterval(self.countdown_interval);
};

HeapWatcher.prototype.pprof_parse = function(str) {
  var lines = str.split("\n");
  var out = {};
  for(var i = 0; i < lines.length; i++) {
    let line = lines[i];
    let m;
    if((m=line.match(/^\# (\w+) = (\d+)\s*$/))) {
      out[m[1]] = parseInt(m[2]);
    }
  }
  return out;
};

HeapWatcher.prototype.watch_start = function() {
  var self = this;
  console.log(self.logbase, 'watch_start');
  clearInterval(self.watch_interval);
  clearInterval(self.xleak_interval);
  clearInterval(self.countdown_interval);
  clearTimeout(self.autostop_timeout);
  self.set_watch_started(true);
  self.watch_interval = setInterval(function() {
    var geturl = self.burl + '/debug/pprof/heap?debug=1';
    console.log(self.logbase, 'watch. GET ', geturl);
    $.ajax({
      url: geturl
    })
    .then(function(resp) {
      var ts = (new Date()).valueOf();
      //console.log('resp=', resp);
      var pprof = self.pprof_parse(resp);
      console.log('pprof=', pprof);
      self.labels.push(ts);
      self.datasets.forEach(function(ds) {
        ds.data.push(pprof[ds.label]);
      });
      //console.log('self.labels=', self.labels);
      //console.log('self.datasets=', self.datasets);
      self.chart.update();
    });
  }, 1000);
  self.xleak_interval = setInterval(function() {
    console.log(self.logbase, 'watch. xleak. calling ...');
    $.ajax({
      url: self.burl + '/x/leak1'
    }).then(function(resp) {
      console.log(self.logbase, 'watch. xleak. resp=', resp);
    });
  }, 1000);
  if(self.autostop_sec > 0) {
    self.els.countdown.show();
    self.countdown_interval = setInterval(function() {
      var now_ts = (new Date()).valueOf();
      var sec_ellapsed = Math.floor((now_ts - self.watch_started_ts)/1000);
      var sec_remaining = self.autostop_sec - sec_ellapsed;
      self.els.countdown.val(sec_remaining)
    }, 500);
    self.autostop_timeout = setTimeout(function() {
      self.watch_stop();
    }, self.autostop_sec*1000);
  } 
  else {
    self.els.countdown.hide();
  }
};

HeapWatcher.prototype.elmake = function(el) {
  var self = this;

  if(!el) {
    el = $('<div>');
  }

  el.addClass('HeapWatcher');

  var head = $('<div>').addClass('hw-head')
    var input_burl = $('<input>').addClass('hw-iburl').attr('type', 'text');
      input_burl.attr('placeholder', 'pprof index URL')
      input_burl.on('change', function() {
        var val = $(this).val();
        console.log('val=', val);
        if(!val.match(/^http\:\/\/.+$/)) {
          console.error('ERROR: invalid burl');
          $(this).addClass('error');
          return;
        }
        self.set_burl(val);
        $(this).removeClass('error');
        self.state_save();
      });
    head.append(input_burl);
    self.els.input_burl = input_burl;

    var input_autostop = $('<input>').addClass('hw-iautostop').attr('type', 'text');
      input_autostop.val(self.autostop_sec);
      input_autostop.on('change', function() {
        var val = parseInt($(this).val());
        console.log(self.logbase, 'input_autostop:change. val=', val);
        self.set_autostop_sec(val);
      });
    head.append(input_autostop); self.els.input_autostop = input_autostop;

    var countdown = $("<input>").attr('disabled', true).addClass('hw-countdown').hide();
    head.append(countdown); self.els.countdown = countdown;

    var btn_start = $('<button>').text('Go');
    btn_start.on('click', function() {
      console.log(self.logbase, 'btn_start:click');
      self.watch_start();
    });
    head.append(btn_start); self.els.btn_start = btn_start;

    var btn_stop = $('<button>').text('Stop');
    btn_stop.on('click', function() {
      console.log(self.logbase, 'btn_stop:click');
      self.watch_stop();
    });
    head.append(btn_stop); self.els.btn_stop = btn_stop;
    
  el.append(head);

  var body = $('<div>').addClass('hw-body');
    var canvas = $('<canvas>');
    //canvas.width($(window).width());
    //canvas.height($(window).height());
    body.append(canvas);
    self.els.canvas = canvas;
    self.els.canvas0 = canvas.get(0);
  el.append(body);
};

HeapWatcher.auto = function() {
  $('.HeapWatcher').each(function() {
    new HeapWatcher($(this));
  });
}

HeapWatcher.auto();

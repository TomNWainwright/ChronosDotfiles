-function() {

function Clipboard() {
  var self = this;

  this.timer = null;
  this.textarea = document.createElement('textarea');
  this.textarea.style.position = 'absolute';
  this.textarea.style.left = '-1000px';

  $(function() {
    document.body.appendChild(self.textarea);
  });
}

window.Clipboard = Clipboard;

var Proto = _.extend(Clipboard.prototype, Backbone.Events);

Proto.get = function() {
  this.textarea.focus();
  this.textarea.value = '';

  if (!document.execCommand("paste")) {
    throw new Error('Clipboard paste failed');
  }

  return this.textarea.value;
};

Proto.set = function(content) {
  this.textarea.value = content;
  this.textarea.select();

  var active = !!this.timer;

  if (active) {
    this.stop();
  }
  if (!document.execCommand("cut")) {
    throw new Error('Clipboard cut failed');
  }
  if (active) {
    this.start();
  }

  return true;
};

Proto.start = function() {
  var self = this;
  var oldValue = this.get();

  this.stop();
  this.timer = setInterval(function() {
    var newValue = self.get();

    if (newValue.trim().length && newValue !== oldValue) {
      self.trigger('change', oldValue = newValue);
    }
  }, 500);
};

Proto.stop = function() {
  if (this.timer) {
    clearInterval(this.timer);
    this.timer = null;
  }
};

}();
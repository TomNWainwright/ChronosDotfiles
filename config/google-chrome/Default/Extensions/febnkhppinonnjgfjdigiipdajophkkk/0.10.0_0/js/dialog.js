var Dialog = View.extend({
  initialize: function() {
    Dialog.__super__.initialize.call(this);

    var self = this;
    this.ui.view = this.$el.find('.dialog__view');
    this.ui.close = this.$el.find('.dialog__close');
    this.ui.close.click(function() {
      Backbone.history.navigate('');
      self.hide();
    });

    _.bindAll(this, 'keydown');
  },

  show: function() {
    document.addEventListener('keydown', this.keydown);

    this.$el.show();
    this.$el.css('opacity', .01);
    this.ui.view.css('-webkit-transform', 'scale(.95)');
    this.ui.view.css('top', -20);

    var self = this;
    setTimeout(function() {
      self.$el.css('opacity', 1);
      self.ui.view.css('-webkit-transform', 'scale(1)');
      self.ui.view.css('top', 0);
      self.trigger('show');
      self.onShow();
    }, 0);
  },

  hide: function() {
    document.removeEventListener('keydown', this.keydown);

    var self = this;
    this.$el.one('webkitTransitionEnd', function() {
      self.$el.hide();
      self.trigger('hide');
      self.onHide();
    });

    this.$el.css('opacity', .01);
    this.ui.view.css('-webkit-transform', 'scale(.95)');
    this.ui.view.css('top', -20);
  },

  showError: function(err) {
    var msg = errors[err] || err;
    this.ui.error.html(msg);
    this.ui.error.show();
  },

  hideError: function() {
    this.ui.error.empty();
    this.ui.error.hide();
  },

  keydown: function(event) {
    if (event.keyCode == 27) {
      Backbone.history.navigate('');
      this.hide();
    }
  },

  onShow: function() {},
  onHide: function() {}
});
var View = Backbone.View.extend({
  initialize: function() {
    var self = this;
    _.each(this.ui, function(selector, name) {
      self.ui[name] = self.$el.find(selector);
    });
    _.each(this.triggers, function(event, binding) {
      var domevent = binding.split(' ')[0];
      var selector = binding.split(' ')[1];
      self.$el.find(selector).bind(domevent, function() {
        self.trigger(event);
      });
    });
  }
});
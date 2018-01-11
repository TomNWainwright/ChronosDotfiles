var OptionsView = View.extend({
  el: '.options',

  events: {
    'change #notifyPopup': 'setPopupNotif'
  , 'change #notifySound': 'setSoundNotif'
  , 'click .btn-toggle': 'toggleStatus'
  , 'click .btn-signout': 'signout'
  },

  ui: {
    notifyPopup: '#notifyPopup'
  , notifySound: '#notifySound'
  , scrnSignedYes: '.scrn__signed_yes'
  , scrnSignedNo: '.scrn__signed_no'
  , userStatus: '.user__status'
  , userEmail: '.user__email'
  , btnToggle: '.btn-toggle'
  },

  initialize: function(op) {
    OptionsView.__super__.initialize.call(this);

    this.api = op.api;

    this.listenTo(this.api, 'signup', this.showOptions);
    this.listenTo(this.api, 'signout', this.hideOptions);
    this.listenTo(this.api, 'disable', this.updateStatus);
    this.listenTo(this.api, 'connecting', this.updateStatus);
    this.listenTo(this.api, 'enable', this.updateStatus);
    this.listenTo(this.api, 'enable', this.showOptions);

    if (settings.get('notifyPopup')) {
      this.ui.notifyPopup.attr('checked', true);
    }
    if (settings.get('notifySound')) {
      this.ui.notifySound.attr('checked', true);
    }
    if (this.api.hasAuthCredentials()) {
      this.showOptions();
    } else {
      this.hideOptions();
    }
  },

  setPopupNotif: function() {
    settings.set('notifyPopup', this.ui.notifyPopup.is(':checked'));
  },

  setSoundNotif: function() {
    settings.set('notifySound', this.ui.notifySound.is(':checked'));
  },

  showOptions: function() {
    this.ui.scrnSignedNo.hide();
    this.ui.scrnSignedYes.show();
    this.ui.userEmail.html(this.api.credentials.email);
    this.updateStatus();
  },

  hideOptions: function() {
    this.ui.scrnSignedNo.show();
    this.ui.scrnSignedYes.hide();
    Backbone.history.navigate('signin', true);
  },

  updateStatus: function() {
    var status = this.api.enabled ? 'Online' : 'Offline';
    var btn =  this.api.enabled ? 'Go Offline' : 'Go Online';
    if (this.api.connecting) {
      status = 'Connecting...';
      btn = '...';
    }
    this.ui.userStatus.html(status);
    this.ui.btnToggle.html(btn);
  },

  toggleStatus: function() {
    if (this.api.enabled) {
      settings.set('enabled', false);
      this.api.disable();
    } else {
      settings.set('enabled', true);
      this.api.enable();
    }
  },

  signout: function() {
    this.api.signout();
    settings.set('authEmail', null);
    settings.set('authHash', null);
    settings.set('enabled', false);
  }
});
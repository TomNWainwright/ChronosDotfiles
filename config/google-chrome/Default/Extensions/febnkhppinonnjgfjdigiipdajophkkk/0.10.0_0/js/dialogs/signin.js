var SignInDialog = Dialog.extend({
  el: '.signin',

  events: {
    'submit form': 'submit'
  },

  ui: {
    inpEmail      : '[name="email"]'
  , inpPassword   : '[name="password"]'
  , btnSubmit     : '[name="submit"]'
  , scrnSignedYes : '.scrn__signed_yes'
  , scrnSignedNo  : '.scrn__signed_no'
  , error         : '.error'
  , form          : 'form'
  },

  initialize: function(op) {
    SignInDialog.__super__.initialize.call(this);
    this.api = op.api;
  },

  submit: function(e) {
    e.preventDefault();
    this.ui.btnSubmit.attr('disabled', true);
    this.ui.btnSubmit.html('Preparing...');
    this.hideError();

    // a hack making submit button to be redrawn
    // before the start of creating hash
    var self = this;
    setTimeout(function() {
      var email = self.ui.inpEmail.val();
      var passw = self.ui.inpPassword.val();
      var ckey = Crypto.createKey(email, passw);
      var hash = Crypto.createHash(email, ckey);

      settings.set('cryptoKey', ckey);

      self.ui.btnSubmit.html('Signing...');
      self.listenToOnce(self.api, 'enable', self.onStart);
      self.listenToOnce(self.api, 'err', self.onError);

      self.api.setAuthCredentials(email, hash);
      self.api.enable();
    }, 0);
  },

  onStart: function() {
    settings.set('authEmail', this.api.credentials.email);
    settings.set('authHash', this.api.credentials.hash);
    settings.set('enabled', true);

    this.resetSubmitButton();
    this.ui.scrnSignedYes.show();
    this.ui.scrnSignedNo.hide();
  },

  onError: function(err) {
    this.showError(err.message);
    this.resetSubmitButton();
  },

  resetSubmitButton: function() {
    this.ui.btnSubmit.removeAttr('disabled');
    this.ui.btnSubmit.html('Sign in');
  },

  show: function() {
    this.ui.scrnSignedYes.hide();
    this.ui.scrnSignedNo.show();
    SignInDialog.__super__.show.call(this);
  },

  onShow: function() {
    this.ui.inpEmail.focus();
    this.ui.form.get(0).reset();
  }
});
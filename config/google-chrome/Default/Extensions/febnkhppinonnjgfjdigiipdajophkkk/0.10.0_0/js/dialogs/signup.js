var SignUpDialog = Dialog.extend({
  el: '.signup',

  events: {
    'submit form': 'submit'
  , 'input [name="confirm"]': 'validateConfirm'
  },

  ui: {
    inpEmail      : '[name="email"]'
  , inpPassword   : '[name="password"]'
  , inpConfirm    : '[name="confirm"]'
  , btnSubmit     : '[name="submit"]'
  , scrnSignedYes : '.scrn__signed_yes'
  , scrnSignedNo  : '.scrn__signed_no'
  , error         : '.error'
  , form          : 'form'
  },

  initialize: function(op) {
    SignUpDialog.__super__.initialize.call(this);

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

      var onsignup = _.bind(self.onSignup, self);
      var onerror = _.bind(self.onError, self);
      self.api.setAuthCredentials(email, hash);
      self.api.signup(onsignup, onerror);
    }, 0);
  },

  validateConfirm: function() {
    var el = this.ui.inpConfirm.get(0);
    if (this.ui.inpConfirm.val() != this.ui.inpPassword.val()) {
      el.setCustomValidity(errors['dont_match']);
    } else {
      el.setCustomValidity('');
    }
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

  onSignup: function() {
    this.api.enable();

    settings.set('authEmail', this.api.credentials.email);
    settings.set('authHash', this.api.credentials.hash);
    settings.set('enabled', true);

    this.resetSubmitButton();
    this.ui.scrnSignedYes.show();
    this.ui.scrnSignedNo.hide();
  },

  onError: function(err) {
    this.showError(err.message);
    this.api.clearAuthCredentials();
    this.resetSubmitButton();
  },

  show: function() {
    this.ui.scrnSignedYes.hide();
    this.ui.scrnSignedNo.show();
    SignUpDialog.__super__.show.call(this);
  },

  resetSubmitButton: function() {
    this.ui.btnSubmit.removeAttr('disabled');
    this.ui.btnSubmit.html('Sign up');
  },

  onShow: function() {
    this.ui.inpEmail.focus();
    this.ui.form.get(0).reset();
  }
});
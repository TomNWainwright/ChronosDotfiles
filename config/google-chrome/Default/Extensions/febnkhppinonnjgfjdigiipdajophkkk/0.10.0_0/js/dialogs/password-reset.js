var PasswordResetDialog = Dialog.extend({
  el: '.password-reset',

  events: {
    'submit form': 'submit'
  , 'input [name="confirm"]': 'validateConfirm'
  },

  ui: {
    inpPassword : '[name="password"]'
  , inpConfirm  : '[name="confirm"]'
  , btnSubmit   : '[name="submit"]'
  , scrnSentYes : '.scrn__sent_yes'
  , scrnSentNo  : '.scrn__sent_no'
  , error       : '.error'
  },

  initialize: function(op) {
    PasswordResetDialog.__super__.initialize.call(this);
    this.credentials = {};
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
      var email = self.credentials.email;
      var passw = self.ui.inpPassword.val();

      var ckey = Crypto.createKey(email, passw);
      var hash = Crypto.createHash(email, ckey);
      settings.set('cryptoKey', ckey);

      self.ui.btnSubmit.html('Resetting...');

      var data = {
        email: self.credentials.email
      , token: self.credentials.token
      , hash: hash
      };

      var onchange = _.bind(self.onChange, self);
      var onerror = _.bind(self.onError, self);
      self.api.resetHash(data, function() {
        self.api.setAuthCredentials(email, hash);
        self.api.enable();

        self.ui.btnSubmit.html('Signing...');

        self.api.once('enable', onchange);
        self.api.once('err', onerror);
      }, onerror);
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

  onChange: function() {
    settings.set('authHash', this.api.credentials.hash);
    this.ui.scrnSentYes.show();
    this.ui.scrnSentNo.hide();
  },

  onError: function(err) {
    this.showError(err.message);
    this.resetSubmitButton();
  },

  resetSubmitButton: function() {
    this.ui.btnSubmit.removeAttr('disabled');
    this.ui.btnSubmit.html('Reset');
  },

  show: function(email, token) {
    if (!email && !token) {
      this.showError('no_credentials');
    }

    this.credentials.email = email;
    this.credentials.token = token;

    this.ui.scrnSentYes.hide();
    this.ui.scrnSentNo.show();
    this.resetSubmitButton();

    PasswordResetDialog.__super__.show.call(this);
  },

  onShow: function() {
    this.ui.inpPassword.focus();
  }
});
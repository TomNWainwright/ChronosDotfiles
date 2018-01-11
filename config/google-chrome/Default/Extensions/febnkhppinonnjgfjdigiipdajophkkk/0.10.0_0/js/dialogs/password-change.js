var PasswordChangeDialog = Dialog.extend({
  el: '.password-change',

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
  , form        : 'form'
  },

  initialize: function(op) {
    PasswordChangeDialog.__super__.initialize.call(this);
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
      var email = self.api.credentials.email;
      var passw = self.ui.inpPassword.val();

      var ckey = Crypto.createKey(email, passw);
      var hash = Crypto.createHash(email, ckey);
      settings.set('cryptoKey', ckey);

      self.ui.btnSubmit.html('Changing...');

      var onchange = _.bind(self.onChange, self);
      var onerror = _.bind(self.onError, self);
      self.api.changeHash(hash, onchange, onerror);
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
    this.resetSubmitButton();
  },

  onError: function(err) {
    this.showError(err.message);
    this.resetSubmitButton();
  },

  resetSubmitButton: function() {
    this.ui.btnSubmit.removeAttr('disabled');
    this.ui.btnSubmit.html('Send instructions');
  },

  show: function() {
    this.ui.scrnSentYes.hide();
    this.ui.scrnSentNo.show();
    PasswordChangeDialog.__super__.show.call(this);
  },

  onShow: function() {
    this.ui.inpPassword.focus();
    this.ui.form.get(0).reset();
  }
});
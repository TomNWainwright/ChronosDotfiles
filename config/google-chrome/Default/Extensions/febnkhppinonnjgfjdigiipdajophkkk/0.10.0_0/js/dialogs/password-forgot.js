var PasswordForgotDialog = Dialog.extend({
  el: '.password-forgot',

  events: {
    'submit form': 'submit'
  },

  ui: {
    inpEmail    : '[name="email"]'
  , btnSubmit   : '[name="submit"]'
  , scrnSentYes : '.scrn__sent_yes'
  , scrnSentNo  : '.scrn__sent_no'
  , error       : '.error'
  , form        : 'form'
  },

  initialize: function(op) {
    PasswordForgotDialog.__super__.initialize.call(this);
    this.api = op.api;
  },

  submit: function(e) {
    e.preventDefault();
    this.ui.btnSubmit.attr('disabled', true);
    this.ui.btnSubmit.html('Sending...');
    this.hideError();

    var onsuccess = _.bind(this.onSuccess, this);
    var onerror = _.bind(this.onError, this);
    var email = this.ui.inpEmail.val();

    this.api.forgotHash(email, onsuccess, onerror);
  },

  onSuccess: function() {
    this.resetSubmitButton();
    this.ui.scrnSentYes.show();
    this.ui.scrnSentNo.hide();
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
    PasswordForgotDialog.__super__.show.call(this);
  },

  onShow: function() {
    this.ui.inpEmail.focus();
    this.ui.form.get(0).reset();
  }
});
$(function() {
  var bg = chrome.extension.getBackgroundPage();

  // Initialize dialogs and views
  var signinDialog = new SignInDialog({api: bg.api});
  var signupDialog = new SignUpDialog({api: bg.api});
  var passwordForgotDialog = new PasswordForgotDialog({api: bg.api});
  var passwordChangeDialog = new PasswordChangeDialog({api: bg.api});
  var passwordResetDialog  = new PasswordResetDialog({api: bg.api});
  var optionsView = new OptionsView({api: bg.api});

  // Remove all the views to remove all listeners they
  // added to the api instance. Prevents memory lick
  window.addEventListener('beforeunload', function() {
    passwordForgotDialog.remove();
    passwordChangeDialog.remove();
    passwordResetDialog.remove();
    signinDialog.remove();
    signupDialog.remove();
    optionsView.remove();
  });

  var Router = Backbone.Router.extend({
    routes: {
      'signin'  : 'signin'
    , 'forgot'  : 'forgot'
    , 'change'  : 'change'
    , 'signup'  : 'signup'
    , 'signout' : 'signout'
    , 'reset/:email/:token': 'reset'
    },

    signup: function() {
      signupDialog.show();
    },
    signin: function() {
      signinDialog.show();
    },
    forgot: function() {
      passwordForgotDialog.show();
    },
    change: function() {
      passwordChangeDialog.show();
    },
    reset: function(email, token) {
      passwordResetDialog.show(email, token);
    }
  });

  new Router();

  Backbone.history.start();
});
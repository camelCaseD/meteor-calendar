Template.layout.rendered = function() {
  Deps.autorun(function(){
    if(Meteor.userId()){
      if (Meteor.user() !== undefined) {
        var email = Meteor.user().services.google.email;
        var domain = email.replace(/.*@/, "");

        if (domain !== "sistersk-12.org") {
          Meteor.logout();
          alert("You must sign in with an account from Sisters School District");
        }
      }
    }
  });
};
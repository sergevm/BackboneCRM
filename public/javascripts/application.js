var App = {
  Models: {},
  Views: {},
  Routers: {},
  init: function() {
    var customers = new App.Routers.Customers();
    Backbone.history.start();
  }
};

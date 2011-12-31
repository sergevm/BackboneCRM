App.Routers.Customers = Backbone.Router.extend({
  
  routes: {
    "":                         "index",
    "customers":                "index"
  },

  customers: new App.Models.Customers(),

  index: function() {

    var view = new App.Views.Customers({el: $("#content"), collection: this.customers});

  }

});

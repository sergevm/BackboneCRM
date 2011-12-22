App.Routers.Customers = Backbone.Router.extend({
  
  routes: {
    "":                   "list",
    "customers/:id":      "get"
  },

  list: function() {
    console.log("list"); 

    var customers = new App.Models.Customers().fetch({
      success: function(collection, response){
        var view = new App.Views.Customers({collection: collection});
        view.render();
     }
    });

    this.navigate("customers");
  },

  get: function(id) {
    console.log("get_customer"); 
    this.navigate("get_customer/" + id);
  }

});

App.Routers.Customers = Backbone.Router.extend({
  
  routes: {
    "":                         "index",
    "customers":                "index",
    "customers/create":         "create",
    "customers/:id":            "get",
    "customers/delete/:id":     "remove"
  },

  customers: new App.Models.Customers(),

  index: function() {

    var view = new App.Views.Customers({el: $("#content"), collection: this.customers});
    this.clearMessage();

    this.navigate("customers");

  },

  create: function() {

    var router = this;
    var customers = this.customers;
    var model = new App.Models.Customer();

    var view = new App.Views.EditCustomer({el: $("#subcontent"), model: model});

    this.clearMessage();

    model.bind("saved", function() {

      view.el.empty();
      customers.add(model);
      router.displayMessage("Customer was added");
      router.navigate("customers");

    });
  },

  clearMessage: function() {
    
    var message = this.message || new App.Views.Message();
    message.clear();

  },

  displayMessage: function(message) {
    
    var view = this.message || new App.Views.Message();
    view.set(message);

  }

});

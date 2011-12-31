App.Routers.Customers = Backbone.Router.extend({
  
  routes: {
    "":                         "index",
    "customers":                "index",
    "customers/create":         "create",
    "customers/:id":            "edit",
    "customers/delete/:id":     "remove"
  },

  customers: new App.Models.Customers(),

  index: function() {

    var router = this;
    
    var view = new App.Views.Customers({el: $("#content"), collection: this.customers});

    this.clearMessage();

    view.bind("edit", function(customer) {
      router.edit(customer);
    });

    this.navigate("customers");

  },

  create: function() {

    var router = this;
    var customers = this.customers;
    var model = new App.Models.Customer();

    var view = new App.Views.EditCustomer({el: $("#subcontent"), model: model});

    view.bind("cancel", function() {
      
      router.displayMessage("Addition of customer was cancelled");
      router.navigate("customers");

    });

    this.clearMessage();

    model.bind("created", function() {

      view.el.empty();
      customers.add(model);
      router.displayMessage("Customer was added");
      router.navigate("customers");

    });
  },

  edit: function(customer) {

    var router = this;
    var view = new App.Views.EditCustomer({el: $("#subcontent"), model: customer});

    this.clearMessage();

    customer.bind("updated", function() {

      view.el.empty();
      router.displayMessage("Customer was updated");
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

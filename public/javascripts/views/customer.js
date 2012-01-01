App.Views.Customers = Backbone.View.extend({

  initialize: function() {

    this.collection.fetch();

    this.collection.bind("add", this.add, this);
    this.collection.bind("reset", this.addAll, this);
    this.collection.bind("destroy", this.destroy, this);

    var list = this;
    
   $(function() {

      var dialog = $("#dialogcontent")
                .dialog({
                  autoOpen: false,
                  title: "Create a customer",
                  modal: true,
                  width: 700,
                  height: 100,
                  close: function(event, ui) {
                    $("#dialogcontent").empty();
                  }
                });

      $("#create").click(function() {

        list.create(list, dialog);
        dialog.dialog('open');    
        return false;

      });

   });

   this.render();

  },

  events: {
    "click #create"                           :"create"
  },

  displayMessage: function(message) {
  
   var view = new App.Views.Message({message: message});

  },

  render: function() {

   $(this.el).html(JST.customers());
   return this;

  },

  add: function(customer) {

    var view = new App.Views.Customer({model: customer});
    
    view.bind("edit", function(customer){
      this.edit(customer);
    }, this);
    
    this.$("#customer-table-body").append(view.el);

  },

  edit: function(customer) {
      
    var list = this;
    var view = new App.Views.EditCustomer({el: $("#subcontent"), model: customer});

    view.bind("cancel", function() {

      $(this.el).empty();
      list.displayMessage("Edit of customer has been cancelled");
    
    });    

    customer.bind("updated", function() {
    
      $(this.el).empty();
      list.displayMessage("The customer has been updated successfully");

    }, view);

  },

  create: function(list, dialog) {
    
    var customer = new App.Models.Customer();
    var view = new App.Views.EditCustomer({el: $("#dialogcontent"), model: customer});

    view.bind("cancel", function() {

      $(this.el).empty();
      dialog.dialog("close");
      list.displayMessage("Creation of customer has been cancelled");
    
    });    

    customer.bind("created", function() {
    
      list.collection.add(this.model);
      $(this.el).empty();
      dialog.dialog("close");
      list.displayMessage("The customer has been created successfully");

    }, view);

  },

  destroy: function(customer) {
    
    this.displayMessage("The customer has been removed successfully");

  },

  addAll: function() {
    
    this.collection.each(this.add, this);

  }
    
});

App.Views.Customer = Backbone.View.extend({

  tagName:"tr",

  className:"customer-row ui-widget",

  events: {
    "dblclick td.customer-cell"             :"edit",
    "click #delete"                         :"remove"
  },

  initialize: function() {
    
    this.model.bind('change', this.render, this);
    this.render();

  },

  render: function() {

    $(this.el).html(JST.customer({customer: this.model}));
    return this;

  },

  edit: function() {
   this.trigger("edit", this.model); 
  },

  remove: function(ev) {

    var view = this;
    
    this.model.destroy({
      success: function(){
        $(view.el).remove();
      } 
    });

    ev.preventDefault();
  }

});


App.Views.EditCustomer = Backbone.View.extend({

  events: {
    "submit #customer-form"             :"save",
    "click input:button"                :"cancel"
  },

  initialize: function() {

    this.render();

  },

  render: function() {

    $(this.el).append(JST.edit_customer({model: this.model}));
    $("input:button, button").button();
    return this;

  },

  save: function(ev) {

    var el = $(this.el);
    var isNew = this.model.isNew();

    this.model.save({name: this.$("[name=name]").val(), 
      legal_form: this.$("[name=legal_form]").val()},
      {
        success: function(model,response){
          model.trigger(isNew ? "created": "updated");
          el.unbind();
        },
        error: function() {
        }
      }
    );

    ev.preventDefault(); 
  },

  cancel: function(){
    
    $(this.el).unbind();    
    this.trigger("cancel");

  }

});

App.Views.Message = Backbone.View.extend({

  el: "#message",

  initialize: function(options) {

    if(options) {
      this.message = options.message;
      this.render();
    }
  },

  render: function(){
    $(this.el).html(this.message);
  },

  set: function(message) {
    this.message = message;
    this.render();
  },

  clear: function() {
    $(this.el).empty();
  }
});

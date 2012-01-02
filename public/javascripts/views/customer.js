App.Views.Customers = Backbone.View.extend({

  initialize: function() {

    this.collection.fetch();

    this.collection.bind("add", this.add, this);
    this.collection.bind("reset", this.addAll, this);
    this.collection.bind("destroy", this.destroy, this);

    var list = this;
    
   $(function() {

      $("#create").click(function() {

        // TODO: I think it might be more performant to reuse the 
        // dialog. Will do for now, will look at it later on ...
        var dialog = $("#dialogcontent")
                .dialog({
                  autoOpen: false,
                  modal: true,
                  height: 100,
                  width: 700,
                  title: "Create a customer",
                  close: function() {$("#dialogcontent").empty();}
               });

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
    
    // Container view is in charge of displaying a view for editing 
    // underneath the table that shows all customers. Another option 
    // might be to have this handled by the row view of a customer?
    view.bind("edit", function(customer){
      this.edit(customer);
    }, this);
    
    this.$("#customer-table-body").append(view.el);

  },

  edit: function(customer) {
      
    var list = this;
    var view = new App.Views.EditCustomer({el: $("#subcontent"), model: customer});

    view.bind("cancel", function() {

      // Clear the zone under the table where editing is happening
      $(this.el).empty();
      list.displayMessage("Edit of customer has been cancelled");
    
    });    

    customer.bind("updated", function() {
    
      // Clear the zone under the table where editing is happening
      $(this.el).empty();
      list.displayMessage("The customer has been updated successfully");

    }, view);

  },

  create: function(list, dialog) {
    
    var customer = new App.Models.Customer();
    var view = new App.Views.EditCustomer({el: $("#dialogcontent"), model: customer});

    view.bind("cancel", function() {

      $(view.el).empty();
      dialog.dialog("destroy");
      list.displayMessage("Creation of customer has been cancelled");
    
    });    

    customer.bind("created", function() {
    
      // Add the new customer to the collection. This will trigger rendering 
      // of that customer via the add function
      list.collection.add(this.model);

      $(view.el).empty();
      dialog.dialog("destroy");
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
    "click #delete"                         :"destroy"
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

  destroy: function(ev) {

    // Prevent link navigation
    ev.preventDefault();

    // We need a reference inside of nested function calls
    var row = this; 

    var dialog = $("#dialogcontent").dialog({
      height: 150,
      width: 500,
      modal: true,
      title: "Confirmation",
      close: function() {
        $("#dialogcontent").empty();
      },
      buttons: [
        {
          text: "Ok",
          click: function(){

            row.model.destroy(
              {
                success: function(){
                  // Remove the row from the table
                  row.remove();
                  // Clear the content of the div holding
                  // the content. Mind that destroy of the 
                  // dialog does not invoke the close callback
                  // defined in the options above
                  $("#dialogcontent").empty();
                  // Destroy the dialog. Maybe I should 
                  // reuse the dialog over the different 
                  // views, and pass along options ????
                  $("#dialogcontent").dialog("destroy");
                }
              }
            );
          }
        },
        {
          text: "Cancel",
          click: function() {
            // Clear the content of the div holding
            // the content. Mind that destroy of the 
            // dialog does not invoke the close callback
            // defined in the options above
            $("#dialogcontent").empty();
            // Destroy the dialog. Maybe I should 
            // reuse the dialog over the different 
            // views, and pass along options ????
            $("#dialogcontent").dialog("destroy");
          }
        } 
        ]
    });

    $("#dialogcontent").append("<div>Are you sure you wish to remove '" + this.model.get('name') + "'?</div>");

    dialog.dialog('open');
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

    // We need this information in callbacks
    var el = $(this.el);
    var isNew = this.model.isNew();

    this.model.save(
        // These are the fields we're saving
        {
          name:       this.$("[name=name]").val(), 
          legal_form: this.$("[name=legal_form]").val()
        },
        // Callbacks for success or error
        {
          success: function(model,response){
     
            model.trigger(isNew ? "created": "updated");
            el.unbind();
     
          },
          error: function() {
          // TODO: display the error appropriately
          }
        }
    );

    // No navigation
    ev.preventDefault(); 
  },

  cancel: function(){
    
    // Make sure we're not don't stay bound to event handlers
    $(this.el).unbind();    
    // Notify the container view that the edit has been cancelled
    this.trigger("cancel");

  }

});

// This is a small view over the div that displays messages
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

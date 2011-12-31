App.Views.Customers = Backbone.View.extend({

  initialize: function() {

    this.collection.fetch();

    this.collection.bind("add", this.add, this);
    this.collection.bind("reset", this.addAll, this);
    this.collection.bind("destroy", this.showMessage, this);

    this.render();

  },

  render: function() {

   $(this.el).html(JST.customers());
   return this;

  },

  add: function(customer) {

    var list = this;

    var view = new App.Views.Customer({model: customer});
    
    view.bind("edit", function(customer){
     list.trigger("edit", customer); 
    }, view);
    
    this.$("#customer-table-body").append(view.el);

  },

  showMessage: function(customer) {

    var message = new App.Views.Message({
      el: $("#message"),
      message: "Customer was removed"
    });

  },

  addAll: function() {
    
    this.collection.each(this.add, this);

  }
    
});

App.Views.Customer = Backbone.View.extend({

  tagName:"tr",

  className:"customer-row",

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
    this.delegateEvents();

  },

  save: function(ev) {

    var el = this.el;
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
    
    this.el.unbind();
    this.el.empty();
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

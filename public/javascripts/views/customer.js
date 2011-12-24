App.Views.Customers = Backbone.View.extend({

  tagName: 'ul',
  
   template: "\
      <% _.each(customers, function(customer) { %>\
          <% $(list.el).append(render_customer(customer)) %>\
      <% }) %>",

  render: function() {
    
    var that = this;

    _.template(this.template, 
        {
          list: that,
          customers: this.collection.models, 
          render_customer: this.render_customer
        }); 

    $("#content").html(this.el);
  },

  render_customer: function(customer){
    var view = new App.Views.Customer({model: customer}); 
    view.render();
    return view.el;
  }
});

App.Views.Customer = Backbone.View.extend({
  
  tagName: 'li',

  render: function() {
    $(this.el).html(this.template(this.model.attributes));
    return this;
  },

  template: _.template('<span style="width:180"><%= name %></span>&nbsp;<span><%= legal_form %></span>')
});




App.Views.Customers = Backbone.View.extend({

  tagName: 'table',

  className: 'customer-table', 
  
   template: "\
      <% $(list.el).append('<tr><th class=customer-header>Company</th><th class=customer-header>Legal Form</th></tr>'); %>\
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
  
  tagName: 'tr',

  className: 'customer-row',

  template: "\
    <td class='customer-cell'><%= customer.name %></td>&nbsp;<td class='customer-cell'><%= customer.legal_form %></td>",

  render: function() {
    return $(this.el).html(_.template(this.template, {customer: this.model.attributes}));
  }
});




App.Views.Customers = Backbone.View.extend({
 render: function() {
   var list = "<ul><%_.each(customers, function(customer){%><li><%= customer.attributes.name %></li><%}) %></ul>";
   $(this.el).html(_.template(list, {customers: this.collection.models})); 
    $("#content").html(this.el);}
});

App.Views.Customer = Backbone.View.extend({
  render: function() {
    $(this.el).html(this.template({name: this.model.attributes.name}));
  },
  template: _.template('<li><%= name %></li>')
});




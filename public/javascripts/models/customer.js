App.Models.Customer = Backbone.Model.extend({
  urlRoot: 'customers'
});

App.Models.Customers = Backbone.Collection.extend({
  model: App.Models.Customer,
  url: '/customers'
});

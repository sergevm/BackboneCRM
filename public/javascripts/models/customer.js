App.Models.Customer = Backbone.Model.extend({
  url:function() {
    if(this.isNew()) {
      return '/customers';
    }

    return '/customers/' + this.id;
  }
});

App.Models.Customers = Backbone.Collection.extend({
  model: App.Models.Customer,
  url: '/customers'
});

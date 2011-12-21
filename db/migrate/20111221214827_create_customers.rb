class CreateCustomers < ActiveRecord::Migration
  def change
    create_table :customers do |t|
      t.string :name
      t.string :legal_form
      t.date :since

      t.timestamps
    end
  end
end

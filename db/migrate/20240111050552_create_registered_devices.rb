class CreateRegisteredDevices < ActiveRecord::Migration[7.1]
  def change
    create_table :registered_devices do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.string :endpoint
      t.string :p256dh
      t.string :auth

      t.timestamps
    end
  end
end

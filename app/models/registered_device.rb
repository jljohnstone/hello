class RegisteredDevice < ApplicationRecord
  belongs_to :user
  encrypts :endpoint, deterministic: true
  encrypts :p256dh
  encrypts :auth
end

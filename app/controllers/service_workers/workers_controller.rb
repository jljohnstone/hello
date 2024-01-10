module ServiceWorkers
  class WorkersController < ApplicationController
    protect_from_forgery except: :index
    before_action :authenticate_user!, except: :index

    def index
    end

    def create
      device = current_user.registered_devices.find_or_initialize_by(
        endpoint: params.dig(:worker, :endpoint)
      )
      if device.new_record?
        device.p256dh = params.dig(:worker, :keys, :p256dh)
        device.auth = params.dig(:worker, :keys, :auth)
        device.save
      end
      head :ok
    end
  end
end

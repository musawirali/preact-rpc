require 'preact_rpc_client'

# Configure connection
PreactRpcClient.configure do |config|
  config.socket_type = 'unix'
  config.socket_file = 'tmp/server.sock'
end

# Send render request
resp = PreactRpcClient.render_component('hello', {
  toWhat: 'Ruby World',
})

# Print the HTML response
puts resp["html"]

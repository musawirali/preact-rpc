require 'json'
require 'socket'

# A module that wraps socket server interaction with the preact-rpc server
module PreactRpcClient
  extend self

  # Default configuration
  @max_data_buffer_size = 2048
  @data_end_marker = "\r\n."

  # Configure block
  class << self
    attr_accessor :data_end_marker, :socket_type, :socket_file, :server_host, :server_port
    def configure
      yield self
      @sock = nil
    end
  end

  # Render function
  def render_component(component_name, props)
    # Construct payload JSON
    payload = {
      id: next_request_id,
      component: component_name,
      props: props,
    }.to_json + @data_end_marker

    # Send request to server
    conn.send(payload, 0)

    # Receive response
    resp = ""
    while true
      val = conn.recv(@max_data_buffer_size)
      is_end = val.match(@data_end_marker)
      val = val.split(@data_end_marker).first if is_end
      resp += val
      break if is_end
    end

    # Parse JSON response and return
    begin
      return JSON.parse(resp)
    rescue
      return {
        error: 'Invalid server response'
      }
    end
  end

  private

  def conn
    if @socket_type == 'unix'
      @sock ||= UNIXSocket.new @socket_file
    else
      @sock ||= TCPSocket.new @server_host, @server_port
    end
    return @sock
  end

  def next_request_id
    @req_id ||= 0
    @req_id += 1
  end
end

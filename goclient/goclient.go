// Package goclient provides functions to interact with the preact-rpc server.
// The Connect function needs to be called first, which will open a socket to
// the server. Then any RenderComponent calls can be made.
package goclient

import (
  "bufio"
  "bytes"
  "encoding/json"
  "fmt"
  "net"
)

// Buffer data marker
const data_end_marker = "\r\n."

// The connection to the RPC server
var conn net.Conn
// Request ID
var reqId int = 0

// Split function for the Scanner to create response tokens from the
// connection read buffer.
func split(data []byte, atEOF bool) (advance int, token []byte, err error) {
  idx := bytes.Index(data, []byte(data_end_marker))
  if idx > -1 {
    return idx + len(data_end_marker), data[:idx], nil
  }

  // If we reach EOF before getting the data end marker we have an error.
  if atEOF {
    return 0, nil, fmt.Errorf("Bad output")
  }

  // Data end marker not found, read more bytes.
  return 0, nil, nil
}

// An RpcResponse is returned for a RenderComponent() call.
// It consists of an Id, the rendered HTML, the html for hydrating
// the redux store and an error message from the server.
// The Id is the same value sent in the request, and is used to
// match the response to the request.
type RpcResponse struct {
  Id int `json:"id"`
  Html string `json:"html"`
  HydrateHtml string `json:"hydrate_html"`
  Error string `json:"error"`
}

// Connect to RPC server.
// The parameters are the same as that of net.Dial(), and depend
// on where the preact-rpc server is listening.
func Connect(network string, address string) error {
  var err error
  conn, err = net.Dial(network, address)
  return err
}

// Send render request for a component and associated props, and get HTML response.
// The Connect() function must be called before calling this function.
func RenderComponent(componentName string, storeName *string, props interface{}) (*RpcResponse, error) {
  // Increment request ID
  reqId += 1

  // Render request to RPC server.
  payload := map[string]interface{}{
    "id": reqId,
    "component": componentName,
  }

  // Add props if there are any
  if props != nil {
    payload["props"] = props
  }

  // Add store name if provided
  if storeName != nil {
    payload["store"] = *storeName
  }

  jsonPayload, err := json.Marshal(payload)
  if err != nil {
    return nil, err
  }

  fmt.Fprintf(conn, string(jsonPayload) + data_end_marker)

  // Parse JSON response.
  scanner := bufio.NewScanner(bufio.NewReader(conn))
  scanner.Split(split)
  scanner.Scan()
  jsonBlob := scanner.Bytes()

  // Error reading buffer ...
  if err := scanner.Err(); err != nil {
    return nil, err
  }
  // Error parsing JSON
  var resp RpcResponse
  if err := json.Unmarshal(jsonBlob, &resp); err != nil {
    return nil, err
  }

  // Add hydration html if store was provided
  if storeName != nil && props != nil {
    jsonProps, _ := json.Marshal(props)

    resp.HydrateHtml = fmt.Sprintf(`
      <div
        class='preact-rpc-store'
        data-props='%s'
        data-store-name='%s'
        style='display: none'>
      </div>
    `, jsonProps, *storeName)
  }

  return &resp, nil
}

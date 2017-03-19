package main

import (
    "bufio"
    "encoding/json"
    "fmt"
    "net"
    "net/http"
)

// RPC response structure
type RpcResponse struct {
  Id int `json:"id"`
  Html string `json:"html"`
  Error string `json:"error"`
}

// The connection to the RPC server
var conn net.Conn

// Split function for the Scanner to create response tokens from the
// connection read buffer.
func split(data []byte, atEOF bool) (advance int, token []byte, err error) {
  // The data end marker is: \r\n.
  for i := 3; i < len(data); i++ {
    if data[i - 2] == '\r' && data[i - 1] == '\n' && data[i] == '.' {
      return i + 1, data[:(i-1)], nil
    }
  }
  // If we reach EOF before getting the data end marker we have an error.
  if atEOF {
    return 0, nil, fmt.Errorf("Bad output")
  }

  // Data end marker not found, read more bytes.
  return 0, nil, nil
}

// HTTP request handler
func handler(w http.ResponseWriter, r *http.Request) {
  // Send Render request to RPC server.
  fmt.Fprintf(conn, `{
    "id": 1,
    "component": "hello",
    "props": {
      "toWhat": "Universe"
    }
  }
  ` + "\r\n.")

  // Parse JSON response.
  scanner := bufio.NewScanner(bufio.NewReader(conn))
  scanner.Split(split)
  scanner.Scan()
  jsonBlob := scanner.Bytes()

  // Error reading buffer ...
  var err error
  if err = scanner.Err(); err != nil {
    fmt.Println("Error reading buffer:", err)
  }
  // Error parsing JSON
  var resp RpcResponse
  err = json.Unmarshal(jsonBlob, &resp)
	if err != nil {
		fmt.Println("Error parsing JSON:", err)
	}

  // All good, we can use resp.Html
  fmt.Fprintf(w, resp.Html)
}

/**
 * Test Go app that renders React component via Preact-RPC server.
 */
func main() {
  var err error

  // Connect to the port the preact-rpc server is listening on.
  conn, err = net.Dial("unix", "tmp/server.sock")
  if err != nil {
    panic(err)
  }

  http.HandleFunc("/", handler)
  http.ListenAndServe(":8080", nil)
}

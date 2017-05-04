package main

import (
    "fmt"
    "net/http"

    "github.com/musawirali/preact-rpc/goclient"
)

// HTTP request handler
func handler(w http.ResponseWriter, r *http.Request) {
  // Send render request to RPC server
  resp, err := goclient.RenderComponent("counter", map[string](interface{}){
    "toWhat": "Universe",
  })
  if err != nil {
    panic(err)
  }
  // All good, we can use resp.Html
  fmt.Fprintf(w, resp.Html)
}

// Test Go app that renders React component via Preact-RPC server.
func main() {
  // Connect to the port the preact-rpc server is listening on.
  if err := goclient.Connect("unix", "tmp/server.sock"); err != nil {
    panic(err)
  }

  http.HandleFunc("/", handler)
  http.ListenAndServe(":8080", nil)
}

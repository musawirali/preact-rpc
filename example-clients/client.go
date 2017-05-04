package main

import (
    "fmt"
    "net/http"

    "github.com/musawirali/preact-rpc/goclient"
)

// HTTP request handler
func handler(w http.ResponseWriter, r *http.Request) {
  // Send render request to RPC server
  storeName := "counter"
  resp, err := goclient.RenderComponent("counter", &storeName, map[string]int{
    "count": 5,
  })
  if err != nil {
    panic(err)
  }
  // All good, we can use resp.Html
  fmt.Fprintf(w, "<div id='counter'>" + resp.Html + "</div>")
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

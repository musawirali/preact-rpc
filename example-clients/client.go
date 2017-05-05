package main

import (
    "fmt"
    "io/ioutil"
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
  tmpl := `
    <html>
      <body>
        %s
        <div id='counter'>%s</div>

        <script type='text/javascript' src='/client.js'></script>
      </body>
    </html>
  `
  fmt.Fprintf(w, tmpl, resp.HydrateHtml, resp.Html)
}

// Test Go app that renders React component via Preact-RPC server.
func main() {
  // Connect to the port the preact-rpc server is listening on.
  if err := goclient.Connect("unix", "tmp/server.sock"); err != nil {
    panic(err)
  }

  // Load client.js file
  clientJS, err := ioutil.ReadFile("./lib/example/client.js")
  if err != nil {
    panic(err)
  }

  http.HandleFunc("/", handler)
  http.HandleFunc("/client.js", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprint(w, string(clientJS))
  })

  http.ListenAndServe(":8080", nil)
}

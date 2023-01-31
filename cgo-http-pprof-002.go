package main

// A cgo program with a noop call into C from Go. 
// 
// ## Hypothesis: 
// 
// This SHOULD NOT be leaking memory. 
// 
// ##Compare-To:
//
// - nnn-http-pprof-001: Go http server without cgo
// - cgo-http-pprof-002: Go http server with cgo BUT no leaky call

import (
  "fmt"
  "os"
  "log"
  "net/http"
  "net/http/pprof"
  "runtime"
)

/*
#include <stdlib.h>
#include <stdio.h>

void noop() {
  printf("cgo. noop\n");
}

*/
import "C"

func withCors(next http.Handler) http.HandlerFunc {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Access-Control-Allow-Origin", "*")
    next.ServeHTTP(w, r);
  })
}

// GET /
func handleRoot(w http.ResponseWriter, req *http.Request) {
  w.Header().Set("Access-Control-Allow-Origin", "*")
  log.Println("GET /. handleRoot")
  fmt.Fprintf(w, "root")
}

// GET /x/leak1
func handleLeak1(w http.ResponseWriter, req *http.Request) {
  log.Println("GET /x/leak1")
  w.Header().Set("Access-Control-Allow-Origin", "*")
  C.noop()
  fmt.Fprintf(w, "C.noop() called")
}

// GET /x/gc
func handleGc(w http.ResponseWriter, req *http.Request) {
  w.Header().Set("Access-Control-Allow-Origin", "*")
  runtime.GC();
  fmt.Fprintf(w, "runtime.GC() called")
}

func main() {
  fmt.Println("---", os.Args[0], "---")

  http.HandleFunc("/", handleRoot)
  http.HandleFunc("/x/leak1", handleLeak1)
  http.HandleFunc("/x/gc", handleGc)
  //http.HandleFunc("/debug/pprof", withCors(pprof.Handler("")))
  http.HandleFunc("/debug/pprof/heap", withCors(pprof.Handler("heap")))
  http.ListenAndServe("localhost:3030", nil)
  log.Println("goodbye!")
}

package main

import (
  "fmt"
  "os"
  "flag"
  "log"
  "runtime/pprof"
)

/*
#include <stdlib.h>
#include <stdio.h>

void hello() {
  printf("calling malloc()...\n");
  void *ptr = malloc(1000);
  printf("NOT calling free()!\n");
}

*/
import "C"

func main() {
  fmt.Println("---", os.Args[0], "---")
  var cpuprofile = flag.String("cpuprofile", "", "Write cpu profile to file")
  var memprofile = flag.String("memprofile", "", "Write mem profile to file")
  flag.Parse()

  if(*cpuprofile != "") {
    fmt.Println("cpuprofile:", *cpuprofile);
    f, err := os.Create(*cpuprofile)
    if err != nil {
      log.Fatal("could not create CPU profile: ", err)
    }
    defer f.Close() // error handling omitted for example
    if err := pprof.StartCPUProfile(f); err != nil {
      log.Fatal("could not start CPU profile: ", err)
    }
    defer pprof.StopCPUProfile()
  }

  C.hello();

  if(*memprofile != "") {
    fmt.Println("memprofile:", *memprofile);
    f, err := os.Create(*memprofile)
    if err != nil {
      log.Fatal("could not create memory profile: ", err)
    }
    defer f.Close() // error handling omitted for example
    //runtime.GC() // get up-to-date statistics
    if err := pprof.WriteHeapProfile(f); err != nil {
      log.Fatal("could not write memory profile: ", err)
    }
  }
}

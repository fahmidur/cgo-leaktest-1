package main

// ## Hypothesis: 
//
// This SHOULD NOT have bytes on the heap at exit. 
// Whatever <leak-detection-tool> used SHOULD NOT detect a leak
// in running this program.
//
// ## Modifications:
// This has been modified to run jemalloc, see helper script
// `./scripts/with-jemalloc-1.sh`.
// We are calling C.exit(0) in order to trigger the atexit handlers
// likely registered by jemalloc.

/*
#include <stdlib.h>
#include <stdio.h>

void hello() {
  printf("calling malloc() ...\n");
  void *ptr = malloc(1000);
  printf("calling free() ...\n");
  free(ptr);
}

*/
import "C"

func main() {
  C.hello()
  C.exit(0)
}

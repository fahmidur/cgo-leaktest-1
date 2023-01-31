package main


// ## Hypothesis: 
// This SHOULD have bytes left on the heap at exit.
// Whatever <leak-detection-tool> used SHOULD detect a leak
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
  malloc(1000);
}

*/
import "C"

func main() {
	C.hello()
  C.exit(0)
}

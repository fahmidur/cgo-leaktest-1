package main


// ## Hypothesis: 
// This SHOULD NOT have bytes left on the heap at exit.
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
  printf("calling malloc/free many times\n");
  int i;
  void *ptr;
  for(i = 0; i < 100; i++) {
    ptr = malloc(10);
    printf("malloc ptr=%p\n", ptr);
    printf("calling free(%p)\n", ptr);
    free(ptr);
  }
}

*/
import "C"

func main() {
	C.hello()
  C.exit(0)
}

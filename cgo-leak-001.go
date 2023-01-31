package main

// hypothesis: This SHOULD have bytes left on the heap at exit.

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
}

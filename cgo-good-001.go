package main

// hypothesis: this should have no bytes on the heap at exit. 

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
}

#include <stdio.h>
#include <stdlib.h>

/**
 * ## Hypothesis: 
 *
 * This SHOULD be detected as a leak
 * because it DOES leak memory.
 * 
 */

int main() {
  printf("--- c-good-002 ---\n\n");
  /*printf("calling malloc() ...\n");*/
  /*void* ptr = malloc(1000);*/
  printf("calling malloc many times\n");
  int i;
  void *ptr;
  for(i = 0; i < 100; i++) {
    printf(".");
    ptr = malloc(10);
    free(ptr);
  }
  printf("\n");
  return 0;
}

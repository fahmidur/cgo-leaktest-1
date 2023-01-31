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
  printf("--- c-leak-002 ---\n\n");
  /*printf("calling malloc() ...\n");*/
  /*void* ptr = malloc(1000);*/
  printf("calling malloc many times\n");
  void *ptr;
  int i;
  for(i = 0; i < 100; i++) {
    ptr = malloc(10);
    printf("malloc ptr=%p\n", ptr);
  }
  printf("\n");
  return 0;
}

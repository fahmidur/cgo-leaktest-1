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
  printf("calling malloc() ...\n");
  void* ptr = malloc(1000);
  return 0;
}

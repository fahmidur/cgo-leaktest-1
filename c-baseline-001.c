#include <stdio.h>

/**
 * ## Hypothesis: 
 *
 * This SHOULD NOT be detected as a leak.
 */
int main() {
  printf("--- c-baseline-001 ---\n\n");
  return 0;
}

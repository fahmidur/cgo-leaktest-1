#include <stdio.h>

#define BUFSIZE 256
/**
 * ## Hypothesis: 
 *
 * This SHOULD NOT be detected as a leak.
 * 
 */
int main() {
  char buf[BUFSIZE];
  printf("--- c-baseline-001 ---\n\n");
  printf("Press enter to continue.");
  fgets(buf, BUFSIZE, stdin);
  return 0;
}

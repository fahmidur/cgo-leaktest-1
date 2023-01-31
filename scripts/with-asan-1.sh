#!/bin/bash

CC="clang" CGO_CFLAGS="-O0 -g -fsanitize=leak" CGO_LDFLAGS="-fsanitize=address" go run $1

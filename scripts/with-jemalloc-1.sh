#!/bin/bash

##
# Execute a program $1 using jemalloc as the malloc implementation.
##

mkdir -p tmp
export MALLOC_CONF="prof_leak:true,lg_prof_sample:0,prof_final:true,prof_prefix:tmp/jeprof" 
export LD_PRELOAD=./sub/jemalloc/lib/libjemalloc.so.2
exec $1

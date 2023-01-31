default:
	./scripts/build-all.rb

clean: jeprof_clean
	./scripts/clean.sh

jeprof_clean:
	rm -f *.heap

.PHONY: clean jeprof_clean default

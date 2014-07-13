@echo start build service...
@echo off
java -jar compiler.jar --js=../src/log.js --js_output_file=../dist/log.js --charset=utf-8 --externs=./externs.js --compilation_level=ADVANCED_OPTIMIZATIONS

@echo complete build!!!

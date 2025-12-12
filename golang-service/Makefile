.PHONY: help run build test clean install

help:
	@echo "Available commands:"
	@echo "  make install  - Download Go dependencies"
	@echo "  make run      - Run the service"
	@echo "  make build    - Build binary"
	@echo "  make test     - Run tests"
	@echo "  make clean    - Clean build artifacts"

install:
	go mod download
	go mod verify

run:
	go run main.go

build:
	go build -o resume-parser

build-linux:
	GOOS=linux GOARCH=amd64 go build -o resume-parser-linux

build-windows:
	GOOS=windows GOARCH=amd64 go build -o resume-parser.exe

build-mac:
	GOOS=darwin GOARCH=amd64 go build -o resume-parser-mac

test:
	./test.sh

clean:
	rm -f resume-parser resume-parser-linux resume-parser.exe resume-parser-mac
	go clean

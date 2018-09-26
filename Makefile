all:
#bash -c "if [[ -z \"$(REACT_APP_BACKEND_URL)\" ]]; then echo 'Error: \$$REACT_APP_BACKEND_URL not set.'; exit 1; fi"
	cd frontend && npm install && npm run build
	cd backend && npm install

.PHONY: all

run: all
	forever stopall
	cd backend && PG_CONN_STRING=blah forever start src/app.js

.PHONY: run

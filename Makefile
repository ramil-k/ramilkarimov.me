deploy:
	git push gandi master
	ssh 5346670@git.dc2.gpaas.net deploy default.git

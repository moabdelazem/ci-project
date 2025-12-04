# This Makefile made to automate some stuff
.PHONY: jenkins-up jenkins-down

jenkins-up:
	echo "Starting Jenkins..."
	docker compose -f utils/jenkins/compose.yaml up -d

jenkins-down:
	echo "Stopping Jenkins..."
	docker compose -f utils/jenkins/compose.yaml down

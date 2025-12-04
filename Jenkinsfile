pipeline {
    agent any

    environment {
        COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        DOCKER_REGISTRY = 'docker.io'
        IMAGE_NAME = 'moabdelazem/ci-project'
        VERSION = "v1.0.${BUILD_NUMBER}-${COMMIT_HASH}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    /* groovylint-disable-next-line NestedBlockDepth */
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'dockerhub-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${VERSION}").push()
                    }
                }
            }
        }
    }
}

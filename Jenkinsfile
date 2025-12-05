pipeline {
    agent any

    environment {
        IMAGE_NAME = 'moabdelazem/ci-project'
        DOCKER_REGISTRY = 'https://index.docker.io/v1/'
    }

    options {
        timeout(time: 10, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prepare') {
            steps {
                script {
                    env.COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    env.VERSION = "v1.0.${BUILD_NUMBER}-${env.COMMIT_HASH}"
                }
            }
        }

        stage('Lint') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            agent {
                docker {
                    image 'node:22-alpine'
                    reuseNode true
                }
            }
            steps {
                sh 'npm test'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("${IMAGE_NAME}:${VERSION}")
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, 'dockerhub-credentials') {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
    }

    post {
        always {
            sh "docker rmi ${IMAGE_NAME}:${VERSION} || true"
            sh "docker rmi ${IMAGE_NAME}:latest || true"
            cleanWs()
        }
        success {
            echo "Pipeline completed successfully! Image: ${IMAGE_NAME}:${VERSION}"
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}

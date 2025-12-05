pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Custom image tag (leave empty for auto-generated)')
        booleanParam(name: 'SKIP_TESTS', defaultValue: false, description: 'Skip running tests')
        booleanParam(name: 'SKIP_LINT', defaultValue: false, description: 'Skip linting')
        booleanParam(name: 'PUSH_IMAGE', defaultValue: true, description: 'Push image to Docker registry')
        booleanParam(name: 'PUSH_LATEST', defaultValue: true, description: 'Also push as latest tag')
        choice(name: 'NODE_VERSION', choices: ['22-alpine', '20-alpine', '18-alpine'], description: 'Node.js version for build')
    }

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
                    // Use custom tag if provided, otherwise auto-generate
                    env.VERSION = params.IMAGE_TAG?.trim() ? params.IMAGE_TAG : "v1.0.${BUILD_NUMBER}-${env.COMMIT_HASH}"
                }
            }
        }

        stage('Lint') {
            when {
                expression { return !params.SKIP_LINT }
            }
            agent {
                docker {
                    image "node:${params.NODE_VERSION}"
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
                sh 'npm run lint'
            }
        }

        stage('Test') {
            when {
                expression { return !params.SKIP_TESTS }
            }
            agent {
                docker {
                    image "node:${params.NODE_VERSION}"
                    reuseNode true
                }
            }
            steps {
                sh 'npm ci'
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
            when {
                expression { return params.PUSH_IMAGE }
            }
            steps {
                script {
                    docker.withRegistry(DOCKER_REGISTRY, 'dockerhub-credentials') {
                        dockerImage.push()
                        if (params.PUSH_LATEST) {
                            dockerImage.push('latest')
                        }
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

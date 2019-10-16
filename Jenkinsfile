pipeline {
  agent {
    docker {
      image 'node:8'
    }

  }
  stages {
    stage('install') {
      steps {
        sh 'npm install'
      }
    }
    stage('compile') {
      steps {
        sh 'npm run compile'
      }
    }
    stage('cleandoc') {
      steps {
        sh 'npm run cleandoc'
      }
    }
    stage('lint') {
      steps {
        sh 'npm run lint'
      }
    }
    stage('test') {
      steps {
        sh 'wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb'
        sh 'apt update'
        sh 'apt install -y ./google*.deb'
        sh 'npm run test'
      }
    }
    stage('doc') {
      steps {
        sh 'npm run doc'
      }
    }
    stage('Build WAR') {
      steps {
        sh 'apt install -y maven'
        sh 'mvn clean install'
      }
    }
  }
  environment {
    NPM_CONFIG_PROGRESS = 'false'
  }
}
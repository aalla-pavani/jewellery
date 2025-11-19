**WEEK 9**
pipeline {
    agent any
    tools {
        maven 'MAVEN-HOME'
    }
    stages {
        stage('git repo & clean') {
            steps {
                bat '''
                    rmdir /s /q project 2>nul || echo no old folder
                    git clone https://github.com/aalla-pavani/project.git
                    mvn clean -f project/pom.xml
                '''
            }
        }
        stage('install') {
            steps {
                bat 'mvn install -f project/pom.xml'
            }
        }
        stage('test') {
            steps {
                bat 'mvn test -f project/pom.xml'
            }
        }
        stage('package') {
            steps {
                bat 'mvn package -f project/pom.xml'
            }
        }
    }
}
**WEEK 10**
minikube start
kubectl create deployment mynginx --image=nginx
if already created then 
kubectl set image deployment/myngnix nginx=nginx:latest
kubectl get deployments
kubectl get pods
kubectl describe pods
kubectl expose deployment mynginx --type=NodePort --port=80 --target-port=80
kubectl scale deployment mynginx --replicas=4
kubectl get svc
kubectl get service mynginx
kubectl port-forward svc/mynginx 8081:80
minikube tunnel
minikube service mynginx --url
Minikube dashboard
**for stop and clean**
kubectl delete deployment mynginx
kubectl delete service mynginx
minikube stop
minikube delete
**Nagios Automation Steps**
docker pull jasonrivers/nagios:latest
docker run --name nagiosdemo -p 8888:80 jasonrivers/nagios:latest
Open your browser and navigate to:http://localhost:8888
Login Credentials:
Username: nagiosadmin
Password: nagios
docker stop nagiosdemo
docker rm nagiosdemo
docker images
docker rmijasonrivers/nagios:latest

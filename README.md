**#maven java automation**
Maven Java Automation Steps:

 Step 1: Open Jenkins (localhost:8080)
   	
	 ├── Click on "New Item" (left side menu
Step 2: Create Freestyle Project (e.g., MavenJava_Build)
 
			├── Enter project name (e.g., MavenJava_Build)
        	├── Click "OK"
└── Configure the project:
 
					├── Description: "Java Build demo"
            		├── Source Code Management:
         
						└── Git repository URL: [GitMavenJava repo URL]
            		├── Branches to build: */Main   or  */master
  		└── Build Steps:
               	     ├── Add Build Step -> "Invoke top-level Maven targets"
                  		└── Maven version: MAVEN_HOME
                 		└── Goals: clean
                	├── Add Build Step -> "Invoke top-level Maven targets"
                		└── Maven version: MAVEN_HOME
                		└── Goals: install
                	└── Post-build Actions:
                    	       ├── Add Post Build Action -> "Archive the artifacts"
                    			└── Files to archive: */
                    	     ├── Add Post Build Action -> "Build other projects"
                    			└── Projects to build: MavenJava_Test
         
								└── Trigger: Only if build is stable
                    	     └── Apply and Save
    └── Step 3: Create Freestyle Project (e.g., MavenJava_Test)
        	├── Enter project name (e.g., MavenJava_Test)
        	├── Click "OK"
              └── Configure the project:
             ├── Description: "Test demo"
             ├── Build Environment:
            		└── Check: "Delete the workspace before build starts"
            ├── Add Build Step -> "Copy artifacts from another project"
            		└── Project name: MavenJava_Build
            		└── Build: Stable build only  // tick at this
            		└── Artifacts to copy: */
            ├── Add Build Step -> "Invoke top-level Maven targets"
            		└── Maven version: MAVEN_HOME
            		└── Goals: test
            		└── Post-build Actions:
                ├── Add Post Build Action -> "Archive the artifacts"
                	└── Files to archive: */
                	└── Apply and Save

    └── Step 4: Create Pipeline View for Maven Java project
        ├── Click "+" beside "All" on the dashboard
        ├── Enter name: MavenJava_Pipeline
        ├── Select "Build pipeline view"         // tick here
         |--- create
        └── Pipeline Flow:
            ├── Layout: Based on upstream/downstream relationship
            ├── Initial job: MavenJava_Build
            └── Apply and Save OK

    └── Step 5: Run the Pipeline and Check Output
        ├── Click on the trigger to run the pipeline
        ├── click on the small black box to open the console to check if the build is success
            Note : 
            
   1.If build is success and the test project is also automatically triggered with name       
                      “MavenJava_Test”
2.The pipeline is successful if it is in green color as shown ->check the console of the test project
The test project is successful and all the artifacts are archived successfully
**PIPELINE**
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
**MINICUBE**
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

**WEBHOOK**
https://ngrok.com
download for windows
copy token (ngrok config add-authtoken 35h4iXUDZeteX0x4M6VTAB1uHze_81s2w7u267bUcZbcwrd6t)
open file in file exploler 
->paste above token(ngrok config add-authtoken 35h4iXUDZeteX0x4M6VTAB1uHze_81s2w7u267bUcZbcwrd6t)
->ngork http 8081
->copy forwarding url (https://coralie-seminomadic-critically.ngrok-free.dev)

git->repository->settings->
web-hook->URL(https://coralie-seminomadic-critically.ngrok-free.dev/git-webhook)
	->/json
create

open Jenkins
->open a pipeline/free-style
-> add GitHub hook trigger in trigger
->apply and save
->build now

open git
->pom.xml change code
->commit
->open web hook
greeeen colour in web hook and jenkins

**GOOGLE TWO STEP**
Go to: https://myaccount.google.com
ii. Enable 2-Step Verification
Navigate to:
oSecurity → 2-Step Verification
oTurn it ON
oComplete the OTP verification process (via phone/email)
iii. Generate App Password for Jenkins
Go to:
oSecurity → App passwords
Select:
oApp: Other (Custom name)
oName: Jenkins-Demo
Click Generate
Copy the 16-digit app password
oSave it in a secure location (e.g., Notepad)
                 2.  Jenkins Plugin Installation
i. Open Jenkins Dashboard
ii. Navigate to:
Manage Jenkins → Manage Plugins
iii. Install Plugin:
Search for and install:
oEmail Extension Plugin

3. Configure Jenkins Global Email Settings
i. Go to:
Manage Jenkins → Configure System

A. E-mail Notification Section
Field	Value
SMTP Server	smtp.gmail.com
Use SMTP Auth	✅ Enabled
User Name	Your Gmail ID (e.g., archanareddykmit@gmail.com)
Password	Paste the 16-digit App Password
Use SSL	✅ Enabled
SMTP Port	465
Reply-To Address	Your Gmail ID (same as above)
➤ Test Configuration
Click: Test configuration by sending test e-mail
Provide a valid email address to receive a test mail
✅ Should receive email from Jenkins

B. Extended E-mail Notification Section
Field	Value
SMTP Server	smtp.gmail.com
SMTP Port	465
Use SSL	✅ Enabled
Credentials	Add Gmail ID and App Password as Jenkins credentials
Default Content Type	text/html or leave default
Default Recipients	Leave empty or provide default emails
Triggers	Select as per needs (e.g., Failure)

4.  Configure Email Notifications for a Jenkins Job
i. Go to:
Jenkins → Select a Job → Configure

ii. In the Post-build Actions section:
Click: Add post-build action → Editable Email Notification
A. Fill in the fields:
Field	Value
Project Recipient List	Add recipient email addresses (comma-separated)
Content Type	Default (text/plain) or text/html
Triggers	Select events (e.g., Failure, Success, etc.)
Attachments	(Optional) Add logs, reports, etc.

iii. Click Save

**AWS**
open aws acedamy
press green button(Aws)
open EC2->Launch instance
name:MyExampleWebServer 
ubuntu
instance type-t2.micro
create key pair
->MyExampleKeyPair
->RSA
->pem
Allow hhtps
Allow http
launch instance
connect to instance
ssh client link copy
public ip
connect
create a empty floder(pem file should be in this floder(WEB))
OPEN POWERSHELL
copy ssh client link copy(Here copy the ssh – i command from SSH client connect tab)
sudo apt update
sudo apt-get install docker.io
sudo apt install git
Sudo apt install nano
:-  git clone <paste the github link of maven-web-java project>(project repo with index.html)
FROM THE PROJECT FLODER(WEB) OPEN GIT BASH
nano Dockerfile 
FROM nginx:alpine
COPY index.html /usr/share/nginx/html/index.html
ctrl+s
ctrl+x
sudo docker build -t mywebapp . (or) docker build -t mywebapp . 
sudo docker run -d -p 80:80 mywebapp (or) docker run -d -p 80:80 mywebapp
OPEN DOCKER AND OPEN WITH IP ADDRESS AND YOU GET HELLO WORLD.

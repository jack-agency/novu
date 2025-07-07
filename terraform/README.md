# 🚀 Terraform Deployment for Novu in GCP

Welcome to the Terraform documentation for deploying the open source notification solution **novu** to Google Cloud Platform (GCP). This project uses a modular Terraform approach to deploy and manage the various components of novu in a secure, scalable, and reproducible manner.

---

## 🎯 The Goal

The goal of this Terraform work was to deploy the open source notification solution **novu** into our GCP environment. Using the self-hosting architecture documentation for docker compose and novu's source code for the 2.1.0 release, we evaluated the required resources and built modular Terraform configurations for each component of the notififcation system. Cloud run has been asked for the deployment of the solution to GCP. 

---

## 📦 The Novu Components

The main components of the novu notification system architecture have specific dependencies. And according to [documentation](https://docs.novu.co/community/self-hosting-novu/deploy-with-docker#required-variables), the required variables for their deployment with a docker-compose setup are:
  - ```JWT_SECRET```: Used by the API to generate JWT keys.
  - ```STORE_ENCRYPTION_KEY```: Used to encrypt/decrypt the provider credentials. It must be 32 characters long.
  - ```HOST_NAME```: Host name of your installation:
    - For local development: http://localhost
    - For VPS deployment: Your server's IP address (e.g., http://<vps-ip-address>) or domain name
  - ```REDIS_CACHE_SERVICE_HOST``` and ```REDIS_HOST``` can have same value for small deployments. For larger deployments, it is recommended to use separate Redis instances for caching and queue management.

The core components for a deployment of Novu are:
- **Mongo**: as a Database
- **Redis**: for cache and queue management
- **API**: a NestJS application that requires several dependencies provided via environment variables. The variables seem to vary depending on the the type of environment the solution is deployed to. But since we're using the self-host documentation that only references a local installation with docker compose, we're using the environment variables for a docker-compose setup. They're not all required.
- **Worker**: a NestJS application responsible for processing, dispatching events. It shares the same MongoDB database as the API.
- **WS**: the web socket
- **Web**:t he react app web ui

---

## 🗂️ Terraform Project Structure

Our Terraform code is organized to maximize reusability and clarity. Here’s a high-level overview of the directory structure:

```
terraform/
├── environments/ 
├    │ ├── dev/
├    │ ├── staging/ 
├    │ └── prod/ 
└── modules/ 
├    ├── api/     
├    ├── redis/   
├    ├── secrets/   
├    ├── service_account/
├    ├── web/ 
├    ├── worker/ 
├    └── ws/
├──backend.tf 
├──provider.tf 
├──variables.tf 
├──README.md
```

Each module is meant to deploy the necessary resources to host Novu on Cloud run services.

**_Notes_:** There's no mongodb module because a mongodb atlas database was provided in the first place, for the development and test phases.


---

## 🔍 Deep Dive into Each Module

### ⚙️ api Module
- **Purpose:**  
  Deploys the Novu API (NestJS application) as a Cloud Run service.
- **Configuration Highlights:**  
  - Requires some environment variables. They're not all required. See the notes at the bugs and notes section.
  - Deployed in a private VPC network to secure access from the internet.
  - For test purposes when proxying to localhost, the API service allow ingress from everywhere. This behavior is to be changed for production.

### 🌐 web Module
- **Purpose:**  
  Deploys the Novu frontend (a React app) as a Cloud Run service.
- **Configuration Highlights:**  
  - Deployed in a private VPC and using a Serverless VPC Access Connector.
  - Ingress rule allowing all traffic for testing (can be tightened in production).

### ⚙️ ws Module
- **Purpose:**  
  Deploys the Novu websocket as a Cloud Run service.
- **Configuration Highlights:**  
  - Requires some environment variables. They're not all required.
  - Deployed in a private VPC using a Serverless VPC Access Connector.

### 📝 redis Module
- **Purpose:**  
  Deploys a redis instance as a GCP Memorystore for redis.
- **Configuration Highlights:**  
  - Requires authentication with auth string.

### 🛠️ worker Module
- **Purpose:**  
  Deploys the worker as a Cloud Run service.
- **Configuration Highlights:**  
  - Since the worker is a background process and doesn’t listen on an HTTP port, a lightweight sidecar container is included to respond to Cloud Run’s health checks.
  - Environment variables are almost the same as the APIs.

### 🔐 secrets Module
- **Purpose:**  
  Creates and manages sensitive values in Secret Manager.
  
### 👤 service_account Module
- **Purpose:**  
  Creates a service account with the necessary IAM roles that Cloud Run services use to interact with the Secret Manager and the Redis instance.


---

## 🚀 Deployment to GCP

### **Manual Deployment**
1. **Pull the Terraform Code:**  
   Clone the repository containing your Terraform configuration.
2. **Configure Variables:**  
   In your chosen environment (e.g., `terraform/environments/dev`), define your variables in a `terraform.tfvars` file. This includes:
   - `vpc_network`
   - `repository_id`
   - `repository_project_id`
   - `vpc_connector`
   - `mongodb_url`
   - `store_encryption_key`
   - `novu_secret_key`
   - `jwt_secret`
3. **Initialize and Validate:**  
   Run:
   ```bash
   terraform init
   terraform fmt -check
   terraform validate
   ```
4. **Plan and Apply:**
    
    Run:
    ```bash 
    terraform plan -out plan.tfplan
    terraform apply "plan.tfplan"
    ```

### **Automatic Deployment**

Because of the current bugs on the solution deployment, there's no automatic deployment for now.

### **Local Testing**

- For local testing of Cloud Run services, you can use the gcloud run services proxy command:

  ```bash
  gcloud run services proxy <service-name> --port=<local-port> --region=<project-region>
  ```
- This allows you to test API calls with tools like Postman or through your browser with the UI.

---

## 🐛 Bugs & Notes

- There are a lot more environment variables in the [docker-compose file](https://github.com/novuhq/novu/blob/v2.1.0/docker/community/docker-compose.yml) used for the self-host setup.
- Since we've been asked to use Cloud Run for these deployments, we don't manage the underlying infrastructure of the host running our containers. So the variables using the ```HOSTNAME``` variable will simply replaced by a full URL provided by Cloud Run after a deployment. For example instead of a variable ```API_ROOT_URL=$HOST_NAME:3000```, we'll simply have ```API_ROOT_URL=https://cloud_run_service_generated_url.com```.
- During the deployment, despite the fact that the ```STORE_ENCRYPTION_KEY``` was 32 characters long, an range error was leverage for an invalid key length. So after looking at the [code](https://github.com/novuhq/novu/blob/18eab69d7ca15c9b4dadb4a843b262ba46402671/libs/application-generic/src/encryption/cipher.ts#L7) and understanding that the code must be 32 bytes long, the store encryption key was replaced by a 32 bytes long secret generated using randomBytes fonction. But the error was still there. So in the current api deployment, there's no store encryption key and the api is deployed with a running container.
- For test purposes in the first place, we used the same Redis instance from GCP Memorystore for redis, for both cache and queue management.
- The storage related variables on AWS S3 were not filled in because we don't have access to a S3 bucket on AWS. I discovered looking at the [code](https://github.com/novuhq/novu/blob/18eab69d7ca15c9b4dadb4a843b262ba46402671/apps/api/src/config/env.validators.ts#L84) that we could use instead GCS with the 3 variables ```STORAGE_SERVICE``` at the value ```GCS```, ```GCS_DOMAIN``` and ```GCS_BUCKET```. However, I didn't find exactly what the ```GCS_DOMAIN``` variable was about. And since it doesn't seems to be mandatory for the docker-compose setup, I didn't add it to the deployment in the first place.
- The NOVU_SECRET_KEY environment variable isn't supposed to be mandatory according to the documentation. But as the deployment goes, it leverages error with a 'Missing NOVU_SECRET_KEY'. The variable is actually an API key necessary for the instance deployment in the beginning. And at the registration of a new user, a new key is generated. So a work around for this error was to add a 32 characters long key for the deployment to be done, and then replace it after with the actual API key generated by the user registration.
- After the deployment, there's no possibility for a newly registered user to create a workflow. But we found that there's actually a possibility to create a workflow calling the ```/workflows/create``` route of the API through the UI. This also open the Integration Store at ```/integrations``` for the user to be able to add providers.
- A main branch was created from the 2.1.0 release of Novu with the terraform configuration. Every push to the main branch is triggering a bunch of workflows with the majority of them failing. So the whole .github/workflows directory might be deleted.


---

## 📚 References
- [Novu Documentation](https://docs.novu.co/platform/overview)
- [GitHub Repository](https://github.com/novuhq/novu/tree/v2.1.0)
- [Terraform Google Module Docs](https://registry.terraform.io/modules/GoogleCloudPlatform)

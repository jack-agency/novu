## Project 
variable "project_id" {
  description = "The project ID to work in"
  type        = string
  default     = "neil-lucius-prod"
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "novu_bucket" {
  description = "The name of the Cloud Storage bucket"
  type        = string
  default     = "novu-storage"
}

## Redis
variable "location_id" {
  description = "The location id to deploy the redis instance in"
  type        = string
  default     = "europe-west1-c"
}

variable "instance_name" {
  description = "The name of the Redis instance"
  type        = string
  default     = "novu-redis-instance"
}

variable "tier" {
  description = "The tier of the Redis instance"
  type        = string
  default     = "BASIC"
}

variable "memory_size_gb" {
  description = "The memory size of the Redis instance"
  type        = number
  default     = 1
}

variable "redis_version" {
  description = "The Redis version to use"
  type        = string
  default     = "REDIS_7_0"
}

variable "redis_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 6379

}

## Worker
variable "worker_worker_pool_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-worker-wp"
}

variable "worker_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-worker:v2.3.0"
}

variable "novu_worker_container_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 3004
}

variable "novu_cloudrun_service_account" {
  description = "The name of the Cloud Run service account"
  type        = string
  default     = "novu-cloudrun-sa"
}

variable "node_env" {
  description = "The environment of the Cloud Run service"
  type        = string
  default     = "production"
}

## Dashboard
variable "dashboard_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-dashboard"
}

variable "dashboard_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-dashboard:v2.3.0"
}

variable "dashboard_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 4000
}

## Web
variable "web_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-web"
}

variable "web_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-web:v0.24.7"
}

variable "web_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 4200
}

## WS

variable "ws_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-ws"
}

variable "ws_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-ws:v2.3.0"
}

variable "novu_ws_container_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 3002
}


## API

variable "api_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-api"
}

variable "api_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-api:v2.3.0"
}

variable "novu_api_container_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 3000
}


## Bridge

variable "bridge_service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "novu-bridge"
}

variable "bridge_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
  default     = "novu-bridge:latest"

}
## Artifact Registry

variable "repository_id" {
  description = "The id of the Artifact Registry repository"
  type        = string
}

variable "repository_project_id" {
  description = "The project id of the Artifact Registry repository"
  type        = string
}

## VPC
variable "vpc_connector" {
  description = "The name of the serverless VPC Access connector"
  type        = string
}

variable "vpc_network" {
  description = "The name of the VPC network"
  type        = string
}

## Secrets
variable "mongodb_url_secret_id" {
  description = "The name of the MongoDB connection string secret"
  type        = string
  default     = "novu-mongodb-url"
}

variable "redis_url_secret_id" {
  description = "The name of the Redis connection string secret"
  type        = string
  default     = "novu-redis-url"
}

variable "redis_host_secret_id" {
  description = "The Redis host"
  type        = string
  default     = "novu-redis-host"
}

variable "redis_password_secret_id" {
  description = "The name of the Redis password secret"
  type        = string
  default     = "novu-redis-password"
}

variable "store_encryption_key_secret_id" {
  description = "The name of the store encryption key secret"
  type        = string
  default     = "novu-store-encryption-key"
}

variable "store_encryption_key" {
  description = "The store encryption key"
  type        = string
  sensitive   = true
}

variable "jwt_secret_secret_id" {
  description = "The name of the JWT secret"
  type        = string
  default     = "novu-jwt-secret"
}

variable "jwt_secret" {
  description = "The JWT secret"
  type        = string
  sensitive   = true
}

variable "novu_secret_key_secret_id" {
  description = "The name of the Novu secret key secret"
  type        = string
  default     = "novu-secret-key"
}

variable "novu_secret_key" {
  description = "The Novu secret key"
  type        = string
  sensitive   = true
}

## MongoDB

variable "atlas_region" {
  description = "Provider region (Atlas region name), e.g. europe-west1 for Belgium"
  type        = string
  default     = "WESTERN_EUROPE"
  
}
variable "atlas_project_id" {
  description = "Atlas project ID where the cluster and networking resources will be created."
  type        = string
}

variable "cluster_name" {
  description = "Name for the Atlas cluster"
  type        = string
  default     = "novu"
}

variable "mongo_version" {
  description = "MongoDB major/minor version"
  type        = string
  default     = "8.0.13"
}

variable "provider_name" {
  description = "Cloud provider for the Atlas cluster"
  type        = string
  default     = "GCP"
}

variable "instance_size" {
  description = "Atlas instance size (cluster tier), e.g. M10"
  type        = string
  default     = "M10"
}

variable "max_instance_size" {
  description = "Maximum instance size for auto-scaling (if enabled)"
  type        = string
  default     = "M20"
}

variable "atlas_cidr_block" {
  description = "CIDR block that Atlas will use for its VPC/container for peering (e.g. 192.168.240.0/22). Required when creating peering if no Atlas container exists."
  type        = string
}

variable "network_container_id" {
  description = "ID of an existing Atlas network container (VPC) to use for peering. If not provided, a new container will be created using the provided atlas_cidr_block."
  type        = string
  default     = "68d14f5daf92771b0483c10a"
}

variable "gcp_cidr_block" {
  description = "CIDR block of the GCP VPC you want to peer with (e.g. 10.0.0.0/16)."
  type        = string
}

variable "serverless_connector_cidr_block" {
  description = "CIDR block of the GCP Serverless VPC Access Connector subnet (e.g. 10.7.0.0/28)."
  type        = string
}

variable "gcp_project_id" {
  description = "GCP project id that owns the VPC you want to peer with."
  type        = string
}

variable "gcp_vpc_name" {
  description = "Name of the GCP VPC network to peer with."
  type        = string
}

variable "db_username" {
  description = "The username for the database user."
  type        = string
  default     = "novu"
}

variable "db_password" {
  description = "The password for the database user."
  type        = string
  sensitive   = true # Mark as sensitive to prevent it from being shown in logs
}

variable "environment" {
  description = "Environment tag to apply to resources"
  type        = string
  default     = "production"
}

variable "public_key" {
  description = "MongoDB Atlas Public Key"
  type        = string
}

variable "private_key" {
  description = "MongoDB Atlas Private Key"
  type        = string
  sensitive   = true
}

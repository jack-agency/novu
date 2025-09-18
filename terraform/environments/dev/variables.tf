## Project 
variable "project_id" {
  description = "The project ID to work in"
  type        = string
  default     = "jack-lucius-dev"
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

variable "mongodb_url" {
  description = "The MongoDB connection string"
  type        = string
  sensitive   = true
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

variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "region" {
  description = "The region to to deploy ressources in"
  type        = string
  default     = "europe-west1"
}

variable "worker_worker_pool_name" {
  description = "The name of the Cloud Run service"
  type        = string
}

variable "worker_image" {
  description = "The fully qualified image URL to deploy from Artifact Registry"
  type        = string
}

variable "novu_worker_container_port" {
  description = "The port to expose on the Cloud Run service"
  type        = number
  default     = 3004
}

variable "novu_cloudrun_service_account" {
  description = "The name of the Cloud Run service account"
  type        = string
}

variable "node_env" {
  description = "The environment of the Cloud Run service"
  type        = string
  default     = "production"
}

variable "api_root_url" {
  description = "The root URL of the API"
  type        = string  
  
}

## MongoDB

variable "mongodb_url" {
  description = "The MongoDB connection string secret name"
  type        = string
  sensitive   = true
}

variable "mongo_max_pool_size" {
  description = "The MongoDB max pool size"
  type        = number
  default     = 200
}

## Redis

variable "redis_url" {
  description = "The Redis connection string"
  type        = string
  sensitive   = true
}

variable "redis_port" {
  description = "The Redis port"
  type        = number
  default     = 6379
}

variable "redis_password" {
  description = "The Redis password secret name"
  type        = string
  sensitive   = true
}

## Encryption

variable "store_encryption_key" {
  description = "The store encryption key secret name"
  type        = string
  sensitive   = true
}

## VPC

variable "vpc_connector" {
  description = "The id of the serverless VPC Access connector"
  type        = string
}

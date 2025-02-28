variable "project_id" {
  description = "The project ID to work in"
  type        = string
}

variable "region" {
  description = "The region to to deploy the redis instance in"
  type        = string
  default     = "europe-west1"
}

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

variable "vpc_network" {
  description = "The name of the VPC authorized network"
  type        = string
}

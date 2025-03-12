variable "project_id" {
  description = "The project ID to work in"
  type        = string
  default     = "jack-lucius-dev"
}

## MongoDB
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

## Redis
variable "redis_host_secret_id" {
  description = "The name of the Redis host secret"
  type        = string
  default     = "novu-redis-url"
}

variable "redis_host" {
  description = "The Redis host"
  type        = string
  sensitive   = true
}

variable "redis_password_secret_id" {
  description = "The name of the Redis password secret"
  type        = string
  default     = "novu-redis-password"
}

variable "redis_password" {
  description = "The Redis password"
  type        = string
  sensitive   = true
}

## Encryption
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

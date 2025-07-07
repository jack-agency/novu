output "mongodb_url" {
  description = "The MongoDB connection string"
  value       = google_secret_manager_secret.mongodb_url.name
}

output "mongodb_url_id" {
  description = "The MongoDB connection string secret id"
  value       = google_secret_manager_secret.mongodb_url.id
}

output "redis_host" {
  description = "The Redis host"
  value       = google_secret_manager_secret.redis_host.name
}

output "redis_host_id" {
  description = "The Redis host secret id"
  value       = google_secret_manager_secret.redis_host.id
}

output "redis_password" {
  description = "The Redis password"
  value       = google_secret_manager_secret.redis_password.name
}

output "redis_password_id" {
  description = "The Redis password secret id"
  value       = google_secret_manager_secret.redis_password.id
}

output "store_encryption_key" {
  description = "The store encryption key"
  value       = google_secret_manager_secret.store_encryption_key.name

}

output "store_encryption_key_id" {
  description = "The store encryption key secret id"
  value       = google_secret_manager_secret.store_encryption_key.id
}

output "jwt_secret" {
  description = "The JWT secret"
  value       = google_secret_manager_secret.jwt_secret.name
}

output "jwt_secret_id" {
  description = "The JWT secret id"
  value       = google_secret_manager_secret.jwt_secret.id
}

output "novu_secret_key" {
  description = "The Novu secret key"
  value       = google_secret_manager_secret.novu_secret_key.name
}

output "novu_secret_key_id" {
  description = "The Novu secret key secret id"
  value       = google_secret_manager_secret.novu_secret_key.id
}

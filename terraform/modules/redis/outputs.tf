output "redis_host" {
  description = "The host address (IP) of the Redis instance."
  value       = google_redis_instance.novu_redis.host
}

output "redis_auth_string" {
  description = "The Redis authentication string (password)."
  value       = google_redis_instance.novu_redis.auth_string
  sensitive   = true
}

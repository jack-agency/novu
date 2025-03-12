## Secret for MongoDB
resource "google_secret_manager_secret" "mongodb_url" {
  secret_id = var.mongodb_url_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "mongodb_url_version" {
  secret      = google_secret_manager_secret.mongodb_url.id
  secret_data = var.mongodb_url
}

## Secrets for Redis
resource "google_secret_manager_secret" "redis_host" {
  secret_id = var.redis_host_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "redis_host_version" {
  secret      = google_secret_manager_secret.redis_host.id
  secret_data = var.redis_host
}

resource "google_secret_manager_secret" "redis_password" {
  secret_id = var.redis_password_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "redis_password_version" {
  secret      = google_secret_manager_secret.redis_password.id
  secret_data = var.redis_password
}

## Secrets for encryption

resource "google_secret_manager_secret" "store_encryption_key" {
  secret_id = var.store_encryption_key_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "store_encryption_key_version" {
  secret      = google_secret_manager_secret.store_encryption_key.id
  secret_data = var.store_encryption_key
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = var.jwt_secret_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt_secret_version" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = var.jwt_secret
}

resource "google_secret_manager_secret" "novu_secret_key" {
  secret_id = var.novu_secret_key_secret_id
  project   = var.project_id
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "novu_secret_key_version" {
  secret      = google_secret_manager_secret.novu_secret_key.id
  secret_data = var.novu_secret_key
}

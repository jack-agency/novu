resource "google_cloud_run_v2_service" "novu_api" {
  name                = var.api_service_name
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  template {

    service_account = var.novu_cloudrun_service_account

    containers {
      image = var.api_image

      ports {
        container_port = var.novu_api_container_port
      }

      env {
        name  = "NODE_ENV"
        value = var.node_env
      }

      env {
        name = "MONGO_URL"
        value_source {
          secret_key_ref {
            secret  = var.mongodb_url
            version = "latest"
          }
        }
      }

      env {
        name  = "MONGO_MIN_POOL_SIZE"
        value = var.mongo_min_pool_size
      }

      env {
        name  = "MONGO_MAX_POOL_SIZE"
        value = var.mongo_max_pool_size
      }

      env {
        name = "REDIS_HOST"
        value_source {
          secret_key_ref {
            secret  = var.redis_url
            version = "latest"
          }
        }
      }

      env {
        name = "REDIS_CACHE_SERVICE_HOST"
        value_source {
          secret_key_ref {
            secret  = var.redis_url
            version = "latest"
          }
        }
      }

      env {
        name  = "REDIS_PORT"
        value = var.redis_port
      }

      env {
        name  = "REDIS_CACHE_SERVICE_PORT"
        value = var.redis_port
      }

      env {
        name  = "REDIS_DB_INDEX"
        value = 2
      }

      env {
        name = "REDIS_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = var.redis_password
            version = "latest"
          }
        }
      }

      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = var.jwt_secret
            version = "latest"
          }
        }
      }

      env {
        name = "STORE_ENCRYPTION_KEY"
        value_source {
          secret_key_ref {
            secret  = var.store_encryption_key
            version = "latest"
          }
        }
      }

      env {
        name = "NOVU_SECRET_KEY"
        value_source {
          secret_key_ref {
            secret  = var.novu_secret_key
            version = "latest"
          }
        }
      }

      env {
        name  = "DISABLE_USER_REGISTRATION"
        value = false
      }

      env {
        name  = "SUBSCRIBER_WIDGET_JWT_EXPIRATION_TIME"
        value = "15 days"
      }

      env {
        name  = "FRONT_BASE_URL"
        value = var.front_base_url
      }

      env {
        name  = "API_ROOT_URL"
        value = var.api_root_url
      }

      env {
        name  = "IS_V2_ENABLED"
        value = "true"
      }

      env {
        name  = "IS_NEW_MESSAGES_API_RESPONSE_ENABLED"
        value = "true"
      }

      env {
        name  = "IS_API_IDEMPOTENCY_ENABLED"
        value = "false"
      }

      env {
        name  = "IS_API_RATE_LIMITING_ENABLED"
        value = "false"
      }

      env {
        name  = "NEW_RELIC_APP_NAME"
        value = "novu-api"
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  depends_on = [var.novu_cloudrun_service_account, var.mongodb_url, var.redis_url]
}

data "google_iam_policy" "public_iam_policy" {
  binding {
    role = "roles/run.invoker"
    members = ["allUsers"]
  }
}


resource "google_cloud_run_v2_service_iam_policy" "allow_unauthenticated" {
  location = google_cloud_run_v2_service.novu_api.location
  name     = google_cloud_run_v2_service.novu_api.name
  policy_data   = data.google_iam_policy.public_iam_policy.policy_data
}

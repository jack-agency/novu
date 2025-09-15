resource "google_cloud_run_v2_worker_pool" "novu_worker" {
  name                = var.worker_service_name
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  launch_stage = "BETA"
  template {

    service_account = var.novu_cloudrun_service_account

    containers {
      image = var.worker_image

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
        name  = "API_ROOT_URL"
        value = var.api_root_url
      }

      env {
        name  = "LOG_LEVEL"
        value = "debug"
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
        name  = "REDIS_PORT"
        value = var.redis_port
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
        name  = "REDIS_DB_INDEX"
        value = 2
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
        name  = "REDIS_CACHE_SERVICE_PORT"
        value = var.redis_port
      }

      env {
        name  = "BROADCAST_QUEUE_CHUNK_SIZE"
        value = 100
      }

      env {
        name  = "MULTICAST_QUEUE_CHUNK_SIZE"
        value = 100
      }

      env {
        name  = "SUBSCRIBER_WIDGET_JWT_EXPIRATION_TIME"
        value = "15 days"
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
    }

    vpc_access {
      # connector = var.vpc_connector # To configure when worker is deployed.
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }

  depends_on = [var.novu_cloudrun_service_account, var.mongodb_url, var.redis_url]
}

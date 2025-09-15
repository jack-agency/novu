## Create the Cloud Run service for the Novu Bridge app.

resource "google_cloud_run_v2_service" "novu_bridge" {
  name                = "novu-bridge"
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  template {

    containers {
      image = var.bridge_image
      ports {
        container_port = "8080"
      }

      env {
        name  = "NOVU_SECRET_KEY"
        value = null
        value_source {
          secret_key_ref {
            secret  = "novu-secret-key"
            version = "latest"
          }
        }
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "PRIVATE_RANGES_ONLY"
    }
  }
}

data "google_iam_policy" "public_iam_policy" {
  binding {
    role = "roles/run.invoker"
    members = ["allUsers"]
  }
}

resource "google_cloud_run_v2_service_iam_policy" "allow_unauthenticated" {
  location = google_cloud_run_v2_service.novu_bridge.location
  name     = google_cloud_run_v2_service.novu_bridge.name
  policy_data   = data.google_iam_policy.public_iam_policy.policy_data
}

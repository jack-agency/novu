## Create the Cloud Run service for the Novu Bridge app.

resource "google_cloud_run_v2_service" "novu_bridge" {
  name                = "novu-bridge"
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  invoker_iam_disabled = true
  template {

    service_account = var.novu_cloudrun_service_account

    containers {
      image = var.bridge_image
      ports {
        container_port = "8080"
      }

      env {
        name  = "NOVU_SECRET_KEY"
        value_source {
          secret_key_ref {
            secret  = var.novu_secret_key
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
  project = var.project_id
}

# Adding NEG for Load Balancer integration.
resource "google_compute_region_network_endpoint_group" "novu_bridge_neg" {
  name        = "${var.bridge_service_name}-neg"
  region    = var.region
  project     = var.project_id
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.novu_bridge.name
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [ google_cloud_run_v2_service.novu_bridge ]
}

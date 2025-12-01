## Create the Cloud Run service for the Novu Dashboard app.

resource "google_cloud_run_v2_service" "novu_dashboard" {
  provider            = google-beta
  name                = "novu-dashboard"
  location            = var.region
  project             = var.project_id
  deletion_protection = false
  ingress             = "INGRESS_TRAFFIC_ALL"
  launch_stage        = "BETA"
  iap_enabled         = true
  invoker_iam_disabled = true
  template {

    containers {
      image = var.dashboard_image
      ports {
        container_port = var.dashboard_port
      }

      env {
        name  = "VITE_API_HOSTNAME"
        value = var.vite_api_hostname
      }

      env {
        name  = "VITE_LEGACY_DASHBOARD_URL"
        value = var.vite_legacy_dashboard_url
      }

      env {
        name  = "VITE_SELF_HOSTED"
        value = "true"
      }

      env {
        name  = "VITE_WEBSOCKET_HOSTNAME"
        value = var.vite_websocket_hostname
      }
    }

    vpc_access {
      connector = var.vpc_connector
      egress    = "ALL_TRAFFIC"
    }
  }
}

data "google_project" "project" {
  project_id = var.project_id
}

resource "google_cloud_run_v2_service_iam_member" "iap_invoker" {
  provider = google-beta
  project = google_cloud_run_v2_service.novu_dashboard.project
  location = google_cloud_run_v2_service.novu_dashboard.location
  name = google_cloud_run_v2_service.novu_dashboard.name
  role   = "roles/run.invoker"
  member = "serviceAccount:service-${data.google_project.project.number}@gcp-sa-iap.iam.gserviceaccount.com"
}

# Adding NEG for Load Balancer integration.
resource "google_compute_region_network_endpoint_group" "novu_dashboard_neg" {
  name        = "${var.dashboard_service_name}-neg"
  region    = var.region
  project     = var.project_id
  network_endpoint_type = "SERVERLESS"
  cloud_run {
    service = google_cloud_run_v2_service.novu_dashboard.name
  }
  lifecycle {
    create_before_destroy = true
  }
  depends_on = [ google_cloud_run_v2_service.novu_dashboard ]
}

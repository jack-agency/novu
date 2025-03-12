resource "google_service_account" "novu_cloudrun_sa" {
  account_id  = var.account_id
  description = "Service account for Novu Cloud Run services to be able to access secrets, Redis instance and MongoDB"
  project     = var.project_id
}

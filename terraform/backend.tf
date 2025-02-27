terraform {
  backend "gcs" {
    bucket = "ja-novu-terraform-state"
    prefix = "terraform/state"
  }
}

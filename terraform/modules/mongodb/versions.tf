terraform {
  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
    }

    google = {
      source  = "hashicorp/google"
    }

    google-beta = {
      source  = "hashicorp/google-beta"
    }
  }
}

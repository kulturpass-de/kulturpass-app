#!/bin/bash
set -e  # Exit on error

# Firebase App IDs
ios_firebase_app_id="1:697405331428:ios:89feff5d2d01b6b807d9f1"
android_firebase_app_id="1:697405331428:android:0ea052e2122ca9e007d9f1"

# Firebase tester groups 
ios_tester_groups=("activetestergroup" "upload-automation")
android_tester_groups=("activetestergroup" "upload-automation")

# Read version details from package.json
if [[ ! -f package.json ]]; then
    echo "Error: package.json not found!"
    exit 1
fi

# Extract version details
version=$(cat package.json | jq '.version')
version=$(echo ${version} | cut -d'"' -f2)
echo "version: " ${version}

major_version=$(echo ${version} | cut -d'.' -f1 )
echo "major_version: " ${major_version}
minor_version=$(echo ${version} | cut -d'.' -f2 )
echo "minor_version: " ${minor_version}
patch_version=$(echo ${version} | cut -d'.' -f3 )
echo "patch_version: " ${patch_version}

build_number=$(cat package.json | jq '.buildNumber' | cut -d'"' -f2)
echo "build_number: " ${build_number}

rc_full_version="${version}-rc${build_number}"
echo "rc_full_version: " ${rc_full_version}

# Process release notes 
sed "s,VERSION,$rc_full_version,g" scripts/firebase-rel-notes-template.md > scripts/firebase-rel-notes.md

release_notes=$(cat scripts/firebase-rel-notes.md)
echo "release notes: ${release_notes}"

# Hardcoded Firebase Project ID
PROJECT_ID="697405331428"

# Define installation directory and filename
GCLOUD_INSTALL_DIR="$PWD/gcloud-sdk"
GCLOUD_ARCHIVE="google-cloud-sdk-453.0.0-linux-x86_64.tar.gz"

# Create installation directory
mkdir -p "$GCLOUD_INSTALL_DIR"
cd "$GCLOUD_INSTALL_DIR"

# Install Google Cloud SDK
echo "⚙️ Installing Google Cloud SDK to $GCLOUD_INSTALL_DIR..."
curl -O "https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/$GCLOUD_ARCHIVE"
tar -xf "$GCLOUD_ARCHIVE"

# Store the actual gcloud binary path
GCLOUD_BIN="$GCLOUD_INSTALL_DIR/google-cloud-sdk/bin/gcloud"
SERVICE_ACCOUNT_PATH="$GCLOUD_INSTALL_DIR/google-cloud-sdk/bin/service_account.json" 

# Verify installation
if [[ ! -f "$GCLOUD_BIN" ]]; then
    echo "❌ Error: gcloud executable not found at $GCLOUD_BIN"
    # Debug information
    echo "Contents of $GCLOUD_INSTALL_DIR:"
    ls -la "$GCLOUD_INSTALL_DIR"
    echo "Contents of google-cloud-sdk directory (if it exists):"
    ls -la "$GCLOUD_INSTALL_DIR/google-cloud-sdk" 2>/dev/null || echo "Directory doesn't exist"
    exit 1
fi

# Set permissions
chmod +x "$GCLOUD_BIN"
echo "✅ Google Cloud SDK installed at: $GCLOUD_BIN"

# Decode Firebase service account credentials
echo "🔐 Decoding Firebase service account JSON..."
echo "Debug: First 100 chars of FIREBASE_SERVICEACCOUNT: ${FIREBASE_SERVICEACCOUNT:0:100}"

echo "$FIREBASE_SERVICEACCOUNT" | base64 --decode > "$SERVICE_ACCOUNT_PATH"

if [[ -s "$SERVICE_ACCOUNT_PATH" ]]; then
    echo "Debug: service_account.json created and not empty."
    echo "Debug: SERVICE_ACCOUNT_PATH: $SERVICE_ACCOUNT_PATH" # Print the full path
else
    echo "❌ Error: Firebase service account file creation failed or file is empty!"
    exit 1
fi

if [[ ! -f "$SERVICE_ACCOUNT_PATH" ]]; then
    echo "❌ Error: Firebase service account file not found!"
    exit 1
fi

echo "✅ Successfully retrieved Firebase service account for project $PROJECT_ID"



# Authenticate using service account directly
echo "🔐 Authenticating with Firebase..."
"$GCLOUD_BIN" auth activate-service-account --key-file="$SERVICE_ACCOUNT_PATH"

# Get access token
echo "🔑 Getting access token..."
ACCESS_TOKEN=$("$GCLOUD_BIN" auth print-access-token)

if [[ -z "$ACCESS_TOKEN" ]]; then
    echo "❌ Error: Unable to fetch OAuth token!"
    exit 1
fi

echo "✅ Successfully authenticated with Firebase API"

# Fetch latest iOS release ID
echo "📢 Fetching latest iOS release..."
curl -X GET "https://firebaseappdistribution.googleapis.com/v1/projects/$PROJECT_ID/apps/$ios_firebase_app_id/releases" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -o firebase_ios_releases.json

ios_release_id=$(jq -r '.releases[0].name | split("/")[-1]' firebase_ios_releases.json)

if [[ -z "$ios_release_id" ]]; then
    echo "❌ Error: No matching iOS release found!"
    exit 1
fi

echo "✅ Latest iOS Release ID: $ios_release_id"

# Fetch latest Android release ID
echo "📢 Fetching latest Android release..."
curl -X GET "https://firebaseappdistribution.googleapis.com/v1/projects/$PROJECT_ID/apps/$android_firebase_app_id/releases" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -o firebase_android_releases.json

android_release_id=$(jq -r '.releases[0].name | split("/")[-1]' firebase_android_releases.json)

if [[ -z "$android_release_id" ]]; then
    echo "❌ Error: No matching Android release found!"
    exit 1
fi

echo "✅ Latest Android Release ID: $android_release_id"

# Update release notes for iOS
echo "📢 Updating iOS release notes..."
curl -X PATCH "https://firebaseappdistribution.googleapis.com/v1/projects/$PROJECT_ID/apps/$ios_firebase_app_id/releases/$ios_release_id?updateMask=releaseNotes" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "releaseNotes": {
      "text": "'"$release_notes"'"
    }
  }'

echo "✅ iOS release notes updated!"

# Update release notes for Android
echo "📢 Updating Android release notes..."
curl -X PATCH "https://firebaseappdistribution.googleapis.com/v1/projects/$PROJECT_ID/apps/$android_firebase_app_id/releases/$android_release_id?updateMask=releaseNotes" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "releaseNotes": {
      "text": "'"$release_notes"'"
    }
  }'

echo "✅ Android release notes updated!"

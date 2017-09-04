case "$CONFIGURATION" in
  Debug)
    # Speed up build times by skipping the creation of the offline package for debug
    # builds on the simulator since the packager is supposed to be running anyways.
    # if [[ "$PLATFORM_NAME" == *simulator ]]; then
    #   echo "Skipping bundling for Simulator platform"
    #   exit 0;
    # fi

    DEV=true
    ;;
  "")
    echo "$0 must be invoked by Xcode"
    exit 1
    ;;
  *)
    DEV=false
    ;;
esac

# Path to lab4 folder inside node_modules
LAB_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Xcode project file for React Native apps is located in ios/ subfolder
cd ..

# Print commands before executing them (useful for troubleshooting)
set -x
DEST=$CONFIGURATION_BUILD_DIR/$UNLOCALIZED_RESOURCES_FOLDER_PATH

$NODE_BINARY "$LAB_DIR/local-cli/index.js" build \
  --build-type "$CONFIGURATION" \
  --platform ios \
  --module "$LAB_TARGET_NAME" \
  --config-only \
  --output-dir "$DEST" \

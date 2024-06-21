#!/usr/bin/env bash

# Root directory of app
ROOT_DIR=$(git rev-parse --show-toplevel)

# Path to Protoc Plugin
PROTOC_GEN_TS_PATH="${ROOT_DIR}/schema/node_modules/.bin/protoc-gen-ts_proto"

# Directory holding all .proto files
SRC_DIR="${ROOT_DIR}/schema"

# Directory to write generated code (.d.ts files)
OUT_DIR="${ROOT_DIR}/frontend/src/generated"

# Clean all existing generated files
rm -r "${OUT_DIR}"
mkdir "${OUT_DIR}"

# Generate all messages
# protoc \
#     --plugin="${PROTOC_GEN_TS_PATH}" \
#     # --ts_opt=esModuleInterop=true \
#     # --js_out="import_style=commonjs,binary:${OUT_DIR}" \
#     --ts_out="${OUT_DIR}" \
#     # --proto_path="${SRC_DIR}" \
#     $(find "${SRC_DIR}" -iname "*.proto")
protoc \
    --plugin="./node_modules/.bin/protoc-gen-ts_proto" \
    --ts_proto_opt=esModuleInterop=true \
    --ts_proto_out="../frontend/src/generated/" \
    transaction.proto
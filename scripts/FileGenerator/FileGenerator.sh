#!/bin/bash

# Determine script directory
script_dir=$(dirname "$0")

# Source necessary imports
source "$script_dir/src/imports.sh"

# Function to generate file based on type
generateFile() {
    local type=$1
    local name=$2
    local options=$3

    # Main logic
    for ((i = 0; i < ${#TYPES_NAMES[@]}; i++)); do
        if [ "$type" == ${TYPES_NAMES[$i]} ]; then
            # Call the corresponding function
            echo ${TYPES_PATHS[$i]}
            ${TYPES_BUILDERS[$i]} "$type" "$name" ${TYPES_PATHS[$i]} "$options"
            exit 0
        fi
    done

    # If no type matched echo in red
    echo "\033[0;31mError: Unknown type '$type'\033[0m"
    help
    exit 1
}
help() {
    echo "\n--- File Generator Help ---\n"
    echo "\033[0;34mDisplay this help message with \"yarn new --help\"\n\033[0m"

    echo "Usage: FileGenerator.sh <type> <name> [options]"
    echo "  \033[0;33mtype:\033[0m The type of file to generate"
    for type in ${TYPES_NAMES[@]}; do
        echo "\t- $type"
    done
    echo "  \033[0;33mname:\033[0m The name of the file to generate"
    echo "  \033[0;33moptions:\033[0m Additional options for the file generation\n"
    echo "Examples:"
    echo "  - yarn new atom User"
    echo "  - yarn new type TUser"
    echo "  - yarn new service User"
    echo "\n--- End of File Generator Help ---\n"
}

# Main logic
main() {
    # Check if second argument is "help"
    if [ "$1" == "--help" ]; then
        help
        exit 0
    fi

    # Check for correct argument count, between 2 and 3
    if [ $# -lt 2 ] || [ $# -gt 3 ]; then
        help
        exit 1
    fi

    local type=$1
    local name=$2
    local options=$3

    # Generate file
    generateFile "$type" "$name" "$options"
}
# Execute main function with all script arguments
main "$@"

is_macos() {
    [[ "$OSTYPE" == "darwin"* ]]
}

# Function to check if the input ($1) is in the array ($2)
containsElement () {
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done
  return 1
}

# Function to replace a string ($2) by another ($3) in a file ($1)
replaceInFile() {
    local file_path="$1"
    local search="$2"
    local replace="$3"

    if is_macos; then
        sed -i '' "s/$search/$replace/ig" "$file_path"
    else
        sed -i "s/$search/$replace/ig" "$file_path"
    fi
}

# Function to put the first letter of a string ($1) in uppercase
ucFirst() {
    local string="$1"
    local first_letter=$(echo "${string:0:1}" | tr '[:lower:]' '[:upper:]')
    local rest_of_name="${string:1}"
    local formatted_name="$first_letter$rest_of_name"

    echo $formatted_name
}

exists() {
    local file_path="$1"
    if [ -f "$file_path" ]; then
        return 0
    elif [ -d "$file_path" ]; then
        return 0
    else
        return 1
    fi
}

checkExistAndConfirm() {
    local file_path="$1"
    local exit_on_cancel="$2"

    file_check=$(exists "$file_path")

   if [ $? -eq 0 ]; then
        echo "\033[0;33mWarning: \"$file_path\" already exists.\033[0m\n\nDo you want to overwrite it? (y/n)"
        read -r user_response
        
        if [ "$user_response" != "y" ]; then
            if [ "$exit_on_cancel" == "false" ]; then
                return 1
            fi
            echo "\033[0;30mOperation cancelled by user.\n"
            exit 1
        fi

        return 0
    fi
    return 0
}
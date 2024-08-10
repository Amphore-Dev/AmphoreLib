createUtil() {
    local util_name="U$(ucFirst $2)"
    local utils_path="$3"

    folder_path=$utils_path
    file_path=$folder_path/$util_name

    checkExistAndConfirm "$file_path.ts"

    echo "export const $util_name = () => {};" >> $file_path.ts
    # update the file index.ts
    echo "\nexport * from './$util_name';" >> $folder_path/index.ts

    npx prettier --write $file_path.ts $folder_path/index.ts
}
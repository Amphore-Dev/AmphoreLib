createType() {
    local type_name="T$(ucFirst "$2")"
    local types_path="$3"

    folder_path=$types_path
    file_path=$folder_path/$type_name

    checkExistAndConfirm "$file_path.ts"

    echo "export type $type_name = {};" >> $file_path.ts
    # update the file index.ts
    echo "\nexport * from './$type_name';" >> $folder_path/index.ts

    npx prettier --write $file_path.ts $folder_path/index.ts
}
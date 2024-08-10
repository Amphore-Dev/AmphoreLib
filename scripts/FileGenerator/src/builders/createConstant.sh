createConstant() {
    local constant_name="C$2"
    local constants_path="$3"

    folder_path=$constants_path
    file_path=$folder_path/$constant_name

    checkExistAndConfirm "$file_path.ts"

    echo "export const $constant_name = {};" >> $file_path.ts
    # update the file index.ts
    echo "\nexport * from './$constant_name';" >> $folder_path/index.ts

    npx prettier --write $file_path.ts $folder_path/index.ts
}
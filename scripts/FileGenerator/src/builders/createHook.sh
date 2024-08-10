createHook() {
    local hook_name="$2"
    local hooks_path="$3"

    folder_path=$hooks_path
    file_path=$folder_path/$hook_name

    checkExistAndConfirm "$file_path.ts"

    echo "export const $hook_name = () => {};" >> $file_path.ts
    # update the file index.ts
    echo "\nexport * from './$hook_name';" >> $folder_path/index.ts

    npx prettier --write $file_path.ts $folder_path/index.ts
}
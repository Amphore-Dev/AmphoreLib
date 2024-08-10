createService() {
    local service_name=$(ucFirst "$2")
    local services_path="$3"

    local folder_path=$services_path/
    local file_path=$folder_path/
    local file_name=$service_name\Service

    checkExistAndConfirm "$file_path/$file_name.ts"

    cp $script_dir/templates/service.template $file_path/$file_name.ts

    replaceInFile "$file_path/$file_name.ts" "{SERVICE_NAME}" "$service_name"
 
    # update the file index.ts
    echo "\nexport * from './$service_name/$service_name';" >> $folder_path/index.ts
    
    npx prettier --write $file_path/$file_name.ts $folder_path/index.ts

}
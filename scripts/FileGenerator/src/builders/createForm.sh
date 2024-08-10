createForm() {
    local form_name=$(ucFirst "$2")
    local forms_path="$3"

    local folder_path=$forms_path
    local file_path=$folder_path/$form_name\Form
    local file_name=$form_name\Form.tsx

    local validation_file_name=$form_name\FormValidation.ts

    local full_path=$file_path/$file_name
    local validation_full_path=$file_path/$validation_file_name

    mkdir -p $file_path
    cp $script_dir/templates/form/form.template $file_path/$form_name\Form.tsx
    cp $script_dir/templates/form/formValidation.template $file_path/$form_name\FormValidation.ts

    replaceInFile "$file_path/$file_name" "{FORM_NAME}" "$form_name"
    replaceInFile "$file_path/$validation_file_name" "{FORM_NAME}" "$form_name"

    # update the file index.ts
    echo "\nexport * from './$form_name\Form/$form_name\Form';" >> $folder_path/index.ts

    npx prettier --write $full_path $validation_full_path  $folder_path/index.ts
}
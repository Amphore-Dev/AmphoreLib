createComponent() {
	local component_type="$1"
	local component_name=$(ucFirst "$2")
	local components_path="$3"
	local options="$4"

	# if the component type is template, add "Layout" to the name
	if [[ "$component_type" == "template" ]]; then
		component_name="$component_name"Template
	fi

	if [[ "$component_type" == "screen" ]]; then
		folder_path=$VIEWS_PATHS
	else
		folder_path=$components_path/$component_type\s
	fi

	local file_path=$folder_path/$component_name
	local file_name=$component_name
	local template_path=$script_dir/templates/component.template

	mkdir -p $file_path

	if [[ "$options" == "test" ]]; then
		file_name="$component_name.cy.tsx"
		template_path=$script_dir/templates/cypressTest.template
	else
		file_name="$component_name.tsx"
		template_path=$script_dir/templates/component.template
	fi

	checkExistAndConfirm "$file_path/$file_name"

	cp $template_path $file_path/$file_name

	replaceInFile "$file_path/$file_name" "{COMPONENT_NAME}" "$component_name"

	# if its not for test, update the index.ts file
	if [[ "$options" != "test" ]]; then
		# update the file index.ts
		echo "\nexport * from './$component_name/$component_name';" >>$folder_path/index.ts

		cp $script_dir/templates/componentStory.template $file_path/$component_name.stories.tsx
		# gen storybook
		replaceInFile "$file_path/$component_name.stories.tsx" "{COMPONENT_NAME}" "$component_name"
	fi

	npx prettier --write $file_path/$file_name $folder_path/index.ts

}

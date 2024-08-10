IMPORT_SRC_PATH="$script_dir/src"
IMPORT_BUILDERS_PATH="$script_dir/src/builders"

source "$IMPORT_SRC_PATH/utils.sh"
source "$IMPORT_SRC_PATH/paths.sh"
source "$IMPORT_SRC_PATH/types.sh"

# builders
source "$IMPORT_BUILDERS_PATH/createComponent.sh"
source "$IMPORT_BUILDERS_PATH/createConstant.sh"
source "$IMPORT_BUILDERS_PATH/createForm.sh"
source "$IMPORT_BUILDERS_PATH/createUtil.sh"
source "$IMPORT_BUILDERS_PATH/createType.sh"
source "$IMPORT_BUILDERS_PATH/createService.sh"
source "$IMPORT_BUILDERS_PATH/createHook.sh"
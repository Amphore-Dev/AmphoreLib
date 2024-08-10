# define types
ATOM_NAME="atom"
MOLECULE_NAME="molecule"
ORGANISM_NAME="organism"
TEMPLATE_NAME="template"
VIEW_NAME="screen"

CONSTANT_NAME="constant"
FORM_NAME="form"
UTIL_NAME="util"
TYPE_NAME="type"
SERVICE_NAME="service"
HOOK_NAME="hook"


# Define component types and other types
TYPES_NAMES=(\
    "$ATOM_NAME"\
    "$MOLECULE_NAME"\
    "$ORGANISM_NAME"\
    "$TEMPLATE_NAME"\
    "$VIEW_NAME"\
    "$CONSTANT_NAME"\
    "$FORM_NAME"\
    "$UTIL_NAME"\
    "$TYPE_NAME"\
    "$SERVICE_NAME"\
    "$HOOK_NAME"
)

TYPES_PATHS=(\
    "$COMPONENTS_PATH"\
    "$COMPONENTS_PATH"\
    "$COMPONENTS_PATH"\
    "$COMPONENTS_PATH"\
    "$VIEWS_PATH"\
    "$CONSTANTS_PATH"\
    "$FORMS_PATH"\
    "$UTILS_PATH"\
    "$TYPES_PATH"\
    "$SERVICES_PATH"\
    "$HOOKS_PATH"
)

TYPES_BUILDERS=(\
    createComponent\
    createComponent\
    createComponent\
    createComponent\
    createComponent\
    createConstant\
    createForm\
    createUtil\
    createType\
    createService\
    createHook
)
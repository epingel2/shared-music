# Keys
ERROR_KEY = "error"
SUCCESS_KEY = "success"

# Messages
ROOM_NOT_FOUND = "Room not found."
LISTENER_ADDED = "Listener added."
LISTENER_REMOVED = "Listener removed."
USER_ALREADY_IN_ROOM = "User has already connected. Refresh the page."
ROOM_NOT_ALLOWED_MSG = "You do not have permissions."
PERMISSIONS_CHANGED_MSG = "Permissions changed."
GET_TRACK_FROM_LISTENERS = "Get track from listeners."
HOST_CHANGED = "Host changed."
# Format: "<username> has disconnected."
USER_DISCONNECTED = "has disconnected."

# Group prefixes
# Format: "<prefix>_<name>"
ROOM_GROUP_PREFIX = "room"
USER_GROUP_PREFIX = "user"


# Events

# Connection
CONNECT_EVENT = "CONNECT"
DISCONNECT_EVENT = "DISCONNECT"
ALREADY_CONNECTED_EVENT = "ALREADY_CONNECTED"

# Set track
SEND_TRACK_TO_NEW_USER = "SEND_TRACK_TO_NEW_USER"
GET_TRACK_FROM_LISTENERS_EVENT = "GET_TRACK_FROM_LISTENERS"
SET_CURRENT_TRACK_EVENT = "SET_CURRENT_TRACK"

# Tracks
CHANGE_TRACK_EVENT = "CHANGE_TRACK"
CHANGE_TIME_EVENT = "CHANGE_TIME"
ADD_TRACK_EVENT = "ADD_TRACK"
DELETE_TRACK_EVENT = "DELETE_TRACK"
PAUSE_TRACK_EVENT = "PAUSE"
TRACK_ENDED_EVENT = "TRACK_ENDED"
VOTE_FOR_SKIP_EVENT = "VOTE_FOR_SKIP"

# Permissions and user interactions
CHANGE_HOST_EVENT = "CHANGE_HOST"
HOST_CHANGED_EVENT = "HOST_CHANGED"
CHANGE_PERMISSIONS_EVENT = "CHANGE_PERMISSIONS"


# Permissions

# Levels
ROOM_ALLOW_ANY = 1
ROOM_ADMIN_ONLY = 5

# Errors
ROOM_NOT_ALLOWED_EVENT = "ROOM_NOT_ALLOWED"

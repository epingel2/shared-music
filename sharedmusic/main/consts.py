# Keys
ERROR_KEY = "error"
SUCCESS_KEY = "success"

# Messages
ROOM_NOT_FOUND = "Room not found."
LISTENER_ADDED = "Listener added."
LISTENER_REMOVED = "Listener removed."
USER_ALREADY_IN_ROOM = "User has already connected. Refresh the page."
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
TRACK_ENDED_EVENT = "TRACK_ENDED"

# Permissions and user interactions
CHANGE_HOST_EVENT = "CHANGE_HOST"
HOST_CHANGED_EVENT = "HOST_CHANGED"
CHANGE_ROOM_SETTINGS_EVENT = "CHANGE_ROOM_SETTINGS"

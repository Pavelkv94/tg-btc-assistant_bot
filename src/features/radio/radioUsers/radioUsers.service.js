import { usersService } from "../../users/users.service.js";

// Radio users service extends the common users service
// This module specifically handles radio-related user operations
export const radioUsersService = {
  ...usersService,
};


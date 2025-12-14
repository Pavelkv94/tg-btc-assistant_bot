import { usersRepository } from "../../users/users.repository.js";

// Radio users repository extends the common users repository
// This module specifically handles radio-related user operations
export const radioUsersRepository = {
  ...usersRepository,
};


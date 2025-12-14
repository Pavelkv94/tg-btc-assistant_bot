import { Router } from "express";
import { radioUsersController } from "./radioUsers.controller.js";

export const radioUsersRouter = Router();

radioUsersRouter.get("/:user_id/favorites", radioUsersController.getFavoriteStations);
radioUsersRouter.post("/:user_id/addFavorites", radioUsersController.addFavoriteStation);
radioUsersRouter.post("/:user_id/removeFavorites", radioUsersController.removeFavoriteStation);


import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.js";
import { 
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteAllNotification,
    deleteNotification, 
} from "../controller/notification.controller.js";
import { notificationParamSchema } from "../validators/notification.validator.js";
import { notificationIdParamSchema } from "../validators/user.validator.js";

const router = Router();

router.get(
    "/",
    authenticate,
    getNotifications
);

router.patch(
    "/:notificationId/read",
    authenticate,
    validate(notificationParamSchema, "params"),
    markNotificationAsRead
);

router.patch(
    "/read-all",
    authenticate,
    markAllNotificationsAsRead
);

router.delete(
    "/",
    authenticate,
    deleteAllNotification,
);

router.delete(
    "/:notificationId",
    authenticate,
    validate(notificationIdParamSchema, "params"),
    deleteNotification,
)

export default router;
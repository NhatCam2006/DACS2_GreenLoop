import { Router } from "express";
import { donationRequestController } from "../modules/donations/donation-request.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// All routes require authentication
router.use(authMiddleware());

// Donor routes
router.get("/my-requests", donationRequestController.getMyRequests);
router.post("/", authMiddleware(["DONOR"]), donationRequestController.create);
router.put("/:id", authMiddleware(["DONOR"]), donationRequestController.update);
router.post(
  "/:id/cancel",
  authMiddleware(["DONOR"]),
  donationRequestController.cancel
);

// Collector routes
router.get(
  "/",
  authMiddleware(["COLLECTOR", "ADMIN"]),
  donationRequestController.getAll
);
router.get(
  "/my-collections",
  authMiddleware(["COLLECTOR"]),
  donationRequestController.getMyCollections
);
router.post(
  "/:id/accept",
  authMiddleware(["COLLECTOR"]),
  donationRequestController.accept
);
router.post(
  "/:id/complete",
  authMiddleware(["COLLECTOR"]),
  donationRequestController.complete
);

// Common routes
router.get("/:id", donationRequestController.getById);

export const donationRequestRouter = router;

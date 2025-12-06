import { Router } from "express";
import { addressController } from "../modules/addresses/address.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware());

router.get("/", addressController.getMyAddresses);
router.get("/:id", addressController.getById);
router.post("/", addressController.create);
router.put("/:id", addressController.update);
router.delete("/:id", addressController.delete);

export const addressRouter = router;


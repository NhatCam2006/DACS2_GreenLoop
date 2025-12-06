import { Request, Response, NextFunction } from "express";
import { addressService } from "./address.service";
import { createAddressSchema, updateAddressSchema } from "../../schemas/address.schema";

export const addressController = {
  getMyAddresses: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const addresses = await addressService.findByUserId(req.user.id);
      res.json({ addresses });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Address ID is required" });
      }
      const address = await addressService.findById(id, req.user.id);
      res.json({ address });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const payload = createAddressSchema.parse(req.body);
      const address = await addressService.create(req.user.id, payload);
      res.status(201).json({ address });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Address ID is required" });
      }
      const payload = updateAddressSchema.parse(req.body);
      const address = await addressService.update(id, req.user.id, payload);
      res.json({ address });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Address ID is required" });
      }
      await addressService.delete(id, req.user.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};


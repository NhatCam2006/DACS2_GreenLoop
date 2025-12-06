import { Request, Response, NextFunction } from "express";
import { donationRequestService } from "./donation-request.service";
import {
  createDonationRequestSchema,
  updateDonationRequestSchema,
  acceptDonationRequestSchema,
  completeDonationRequestSchema,
} from "../../schemas/donation-request.schema";

export const donationRequestController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, wasteCategoryId, district } = req.query;
      const filters: any = {};

      if (status) filters.status = status as string;
      if (wasteCategoryId) filters.wasteCategoryId = wasteCategoryId as string;
      if (district) filters.district = district as string;

      const requests = await donationRequestService.findAll(filters);
      res.json({ requests });
    } catch (error) {
      next(error);
    }
  },

  getMyRequests: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const requests = await donationRequestService.findAll({
        donorId: req.user.id,
      });
      res.json({ requests });
    } catch (error) {
      next(error);
    }
  },

  getMyCollections: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const requests = await donationRequestService.findAll({
        collectorId: req.user.id,
      });
      res.json({ requests });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }
      const request = await donationRequestService.findById(id);
      res.json({ request });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const payload = createDonationRequestSchema.parse(req.body);
      const request = await donationRequestService.create(req.user.id, payload);
      res.status(201).json({ request });
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
        return res.status(400).json({ error: "Request ID is required" });
      }
      const payload = updateDonationRequestSchema.parse(req.body);
      const request = await donationRequestService.update(
        id,
        req.user.id,
        payload
      );
      res.json({ request });
    } catch (error) {
      next(error);
    }
  },

  cancel: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }
      const request = await donationRequestService.cancel(id, req.user.id);
      res.json({ request });
    } catch (error) {
      next(error);
    }
  },

  accept: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }
      const result = await donationRequestService.accept(id, req.user.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  complete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Request ID is required" });
      }
      const payload = completeDonationRequestSchema.parse(req.body);
      const result = await donationRequestService.complete(
        id,
        req.user.id,
        payload
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

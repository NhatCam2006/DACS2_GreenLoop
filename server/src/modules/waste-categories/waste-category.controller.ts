import { Request, Response, NextFunction } from "express";
import { wasteCategoryService } from "./waste-category.service";
import { createWasteCategorySchema, updateWasteCategorySchema } from "../../schemas/waste-category.schema";

export const wasteCategoryController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const activeOnly = req.query.activeOnly !== "false";
      const categories = await wasteCategoryService.findAll(activeOnly);
      res.json({ categories });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      const category = await wasteCategoryService.findById(id);
      res.json({ category });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = createWasteCategorySchema.parse(req.body);
      const category = await wasteCategoryService.create(payload);
      res.status(201).json({ category });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      const payload = updateWasteCategorySchema.parse(req.body);
      const category = await wasteCategoryService.update(id, payload);
      res.json({ category });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Category ID is required" });
      }
      await wasteCategoryService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};


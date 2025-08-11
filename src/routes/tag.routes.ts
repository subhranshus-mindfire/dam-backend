import { Router } from "express";
import { createTag, getAllTags, getTagById, deleteTag } from "../controllers/tag.controller";

const router = Router();

/**
 * @swagger
 * /tags:
 *   post:
 *     summary: Create a new tag
 *   get:
 *     summary: Get all tags
 */
router.post("/", createTag);
router.get("/", getAllTags);

/**
 * @swagger
 * /tags/{id}:
 *   get:
 *     summary: Get a tag by ID
 *   delete:
 *     summary: Delete a tag by ID
 */
router.get("/:id", getTagById);
router.delete("/:id", deleteTag);

export default router;

import express from "express";
import {
  addNoteController,
  getNotesController,
  removeNoteController,
  updateNoteController,
} from "./note.controller";

const noteRouter = express.Router();

noteRouter.get("/", getNotesController);
noteRouter.post("/", addNoteController);
noteRouter.patch("/:id", updateNoteController);
noteRouter.delete("/:id", removeNoteController);

export default noteRouter;

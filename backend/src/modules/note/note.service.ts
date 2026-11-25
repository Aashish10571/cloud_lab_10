import { Note } from "./note.model";
import { noteData } from "./note.types";

export const getAllNotes = async (userId: string) => {
  const notes = await Note.find({ user: userId })
    .select("-__v")
    .sort({ updatedAt: -1 });

  return notes;
};

export const createNote = async (data: noteData, userId: string) => {
  const { title, content, isBookmark, category, completed } = data;

  const newNote = await Note.create({
    title,
    content,
    isBookmark,
    category,
    completed,
    user: userId,
  });

  return newNote;
};

export const updateNote = async (
  noteId: string,
  data: noteData,
  userId: string,
) => {
  const { title, content, isBookmark, category, completed } = data;

  const updatedNote = await Note.findOneAndUpdate(
    { _id: noteId, user: userId },
    { title, content, isBookmark, category, completed },
    { returnDocument: "after" },
  ).select("-__v");

  if (!updatedNote) {
    throw new Error("Note not found");
  }

  return updatedNote;
};

export const deleteNote = async (noteId: string, userId: string) => {
  const note = await Note.findOneAndDelete({
    _id: noteId,
    user: userId,
  }).select("-__v");

  if (!note) {
    throw new Error("Note not found");
  }

  return note;
};

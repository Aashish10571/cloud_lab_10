export const CATEGORIES = ["Personal", "Work", "Health", "Fun"] as const;

// Match these to your Mongo note model.
export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  completed: boolean;
  favorite: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type NoteInput = Pick<Note, "title" | "content" | "category" | "completed" | "favorite">;

import { Router } from 'express';
import {
  createNewNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from '../controllers/notesController';

const router = Router();

router
  .route('/')
  .get(getAllNotes)
  .post(createNewNote)
  .patch(updateNote)
  .delete(deleteNote);

export default router;

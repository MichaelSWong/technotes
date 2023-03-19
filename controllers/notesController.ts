import { Request, Response } from 'express';
import Note from '../models/Note';
import User from '../models/User';
import asyncHandler from 'express-async-handler';

//  @desc Get all notes
// @route GET / notes
// @access Private

const getAllNotes = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const notes = await Note.find().lean();

    if (!notes?.length) {
      return res.status(400).json({ message: 'No notes found' });
    }

    // Add userName to the Notes before sending response
    const notesWithUser = await Promise.all(
      notes.map(async (note) => {
        const user = await User.findById(note.user).lean().exec();
        return { ...note, userName: user.userName };
      })
    );
    res.json(notesWithUser);
  }
);

//  @desc Create new note
// @route POST / notes
// @access Private

const createNewNote = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { user, title, text } = req.body;
    console.log(user);

    // Confirm data
    if (!user || !title || !text) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();

    if (duplicate) {
      return res.status(409).json({ message: 'Duplicate note title' });
    }

    // Create and store the new user
    const note = await Note.create({ user, title, text });

    if (note) {
      // Created
      return res.status(201).json({ message: 'New note created' });
    } else {
      return res.status(400).json({ message: 'Invalid note data received' });
    }
  }
);

//  @desc Update note
// @route PATCH / notes
// @access Private

const updateNote = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id, user, title, text, completed } = req.body;

    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== 'boolean') {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Confirm note exits
    const note = await Note.findById(id).exec();

    if (!note) {
      return res.status(400).json({ message: 'Note note found' });
    }

    // Check for duplicate title
    const duplicate = await Note.findOne({ title }).lean().exec();

    // Allow renaming of the original note
    //@ts-ignore
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: 'Duplicate note title' });
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;

    const updatedNote = await note.save();

    res.json(`${updatedNote.title} updated`);
  }
);

//  @desc Delete note
// @route DELETE / notes
// @access Private

const deleteNote = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Note ID Required' });
    }

    // Confirm note exists to delete
    const note = await Note.findById(id).exec();

    if (!note) {
      return res.status(400).json({ message: 'Note not found' });
    }
    const result = await note.deleteOne();
    const reply = `Note ${result.title} with ID ${result._id} deleted`;
    res.json(reply);
  }
);

export { getAllNotes, createNewNote, updateNote, deleteNote };

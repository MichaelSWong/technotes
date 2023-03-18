import mongoose, { Schema, Document } from 'mongoose';

const AutoIncrement = require('mongoose-sequence')(mongoose);

export interface INote extends Document {
  user: string;
  title: string;
  text: string;
  completed: boolean;
}

const noteSchema: Schema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500,
});

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;

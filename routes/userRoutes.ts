import { Router } from 'express';
import {
  getAllUsers,
  createNewUser,
  deleteUser,
  updateUser,
} from '../controllers/usersControllers';
const router = Router();

router
  .route('/')
  .get(getAllUsers)
  .post(createNewUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;

import { Router } from 'express';
import { CourseController } from '../controllers/course.controller';

const router = Router();
router.post('/', CourseController.createCourse);
router.delete('/:id', CourseController.deleteCourse);
router.put('/:id', CourseController.updateCourse);
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourseById);
router.get('/course_name/:course_name', CourseController.getCoursesByCourseName);
export default router;

import app, { todo } from '../app';
import { CREATE_TODO, Completed, EDIT_TODO, Id } from 'types';
import requireAuth from '../strategies/requireAuth';
import { ResponseError, ValidationError } from '../utils/error';

const router = app.createRouter();

router
    .post('/create', requireAuth, async (req, res) => {
        const userId = req.userId;
        const result = CREATE_TODO.safeParse(req.body);
        if (!result.success)
            throw new ValidationError('A title, content, and completed fields must be provided!');

        await todo.create({
            data: {
                ...result.data,
                author: { connect: { id: userId } }
            }
        });

        const todos = await todo.findMany({
            where: {
                authorId: userId
            },
            orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }]
        });

        return res.status(201).json({
            todos,
            message: `Successfully created ${result.data.title}`
        });
    })
    .get('/all', requireAuth, async (req, res) => {
        const userId = req.userId;

        const todos = await todo.findMany({
            where: {
                authorId: userId
            },
            orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }]
        });

        return res.status(200).send(todos);
    })
    .get('/find/:id', requireAuth, async (req, res) => {
        const userId = req.userId;
        const result = Id.safeParse(req.params);
        if (!result.success) throw new ValidationError('A todo id field must be provided!');

        const { id: todoId } = result.data;

        const foundTodo = await todo.findUnique({
            where: {
                id: todoId,
                authorId: userId
            }
        });
        if (!foundTodo)
            throw new ResponseError(404, 'Unable to locate a todo matching the provided id.');

        return res.status(200).send(foundTodo);
    })
    .put('/complete/:id', requireAuth, async (req, res) => {
        const userId = req.userId;
        const param = Id.safeParse(req.params);
        if (!param.success) throw new ValidationError('A todo id field must be provided!');

        const { id: todoId } = param.data;

        const updatedTodo = await todo.update({
            where: { id: todoId, authorId: userId },
            data: {
                completed: true
            }
        });
        if (!updatedTodo)
            throw new ResponseError(404, 'Unable to locate a todo matching the provided id.');

        const todos = await todo.findMany({
            where: {
                authorId: userId
            },
            orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }]
        });

        return res.status(200).json({
            todos,
            message: `${updatedTodo.title} has been completed!`
        });
    })
    .put('/update/:id', requireAuth, async (req, res) => {
        const userId = req.userId;
        const param = Id.safeParse(req.params);
        const editTodo = EDIT_TODO.safeParse(req.body);
        if (!param.success) throw new ValidationError('A todo id field must be provided!');
        if (!editTodo.success)
            throw new ValidationError(
                "The todo's title, content, and completed fields must be provided!"
            );

        const { id: todoId } = param.data;
        const { data } = editTodo;

        const updatedTodo = await todo.update({
            where: { id: todoId, authorId: userId },
            data
        });
        if (!updatedTodo)
            throw new ResponseError(404, 'Unable to locate a todo matching the provided id.');

        const todos = await todo.findMany({
            where: {
                authorId: userId
            },
            orderBy: [{ completed: 'asc' }, { createdAt: 'desc' }]
        });

        return res.status(200).json({
            todos,
            message: `${updatedTodo.title} has been successfully updated!`
        });
    })
    .delete('/delete/:id', requireAuth, async (req, res) => {
        const userId = req.userId;
        const param = Id.safeParse(req.params);
        if (!param.success) throw new ValidationError('A todo id field must be provided!');

        const { id: todoId } = param.data;

        const foundTodo = await todo.findUnique({
            where: {
                id: todoId,
                authorId: userId
            }
        });
        if (!foundTodo)
            throw new ResponseError(404, 'Unable to locate a todo matching the provided id.');

        const deletedTodo = await todo.delete({
            where: { id: foundTodo.id, authorId: userId }
        });

        return res
            .status(200)
            .json({
                id: foundTodo.id,
                message: `${deletedTodo.title} has been successfully deleted!`
            })
    })
    .use('/todo');

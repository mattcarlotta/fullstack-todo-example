import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { LOGIN, SIGNUP } from 'types';
import app, { user } from '../app';
import { ValidationError } from '../utils/error';

const router = app.createRouter();

router
    .post('/signup', async (req, res) => {
        const result = SIGNUP.safeParse(req.body);

        if (!result.success)
            throw new ValidationError('An email, password, and name must be provided!');

        const { data } = result;

        const userExists = await user.findUnique({ where: { email: data.email } });
        if (userExists) return res.status(202).end();

        const salt = await bcrypt.genSalt(12);
        const password = await bcrypt.hash(data.password, salt);

        const newUser = await user.create({
            data: { ...data, password }
        });

        return res.status(201).json(newUser);
    })
    .post('/login', async (req, res) => {
        const result = LOGIN.safeParse(req.body);
        if (!result.success) throw new ValidationError('An email and password must be provided!');

        const { email, password } = result.data;

        const userExists = await user.findUnique({ where: { email } });
        const isValidPassword = await bcrypt.compare(password, userExists?.password || '');
        if (!userExists || !isValidPassword)
            throw new ValidationError('The email and/or password is not valid.');

        const jwtToken = jwt.sign({ userId: userExists.id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        const expDate = new Date();
        expDate.setDate(expDate.getDate() + 30);

        return res
            .status(200)
            .cookie('SESSION_TOKEN', jwtToken, { path: '/', expires: expDate })
            .end();
    })
    .post('/signout', async (_req, res) => {
        return res.status(202).clearCookie('SESSION_TOKEN').end();
    })
    .use();

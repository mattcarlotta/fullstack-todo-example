import * as z from 'zod';

const Email = z.object({ email: z.string().min(1) });
const Name = z.object({ name: z.string().min(1) });
const Password = z.object({ password: z.string().min(5) });

export const SIGNUP = Email.merge(Name).merge(Password);
export const LOGIN = Email.merge(Password);

export const Id = z.object({ id: z.string() });
const Title = z.object({ title: z.string().min(1).max(300) });
const Content = z.object({ content: z.string().min(1).max(1000) });
const Completed = z.object({ completed: z.boolean() });

export const CREATE_TODO = Title.merge(Content).merge(Completed);
export const EDIT_TODO = CREATE_TODO;

export const SESSION_PAYLOAD = z.object({
    userId: z.string(),
    iat: z.number(),
    exp: z.number()
});
export type SESSION_PAYLOAD_TYPE = z.infer<typeof SESSION_PAYLOAD>;
export const SESSION_TOKEN = z.object({ SESSION_TOKEN: z.string() });

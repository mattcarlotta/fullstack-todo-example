import * as z from "zod";
export declare const SIGNUP: z.ZodObject<{
    email: z.ZodString;
    name: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    password: string;
}, {
    email: string;
    name: string;
    password: string;
}>;
export declare const LOGIN: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const Id: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const CREATE_TODO: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    completed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    completed: boolean;
}, {
    title: string;
    content: string;
    completed: boolean;
}>;
export declare const EDIT_TODO: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
    completed: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    completed: boolean;
}, {
    title: string;
    content: string;
    completed: boolean;
}>;

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EDIT_TODO = exports.CREATE_TODO = exports.Id = exports.LOGIN = exports.SIGNUP = void 0;
const z = __importStar(require("zod"));
const Email = z.object({ email: z.string().min(1) });
const Name = z.object({ name: z.string().min(1) });
const Password = z.object({ password: z.string().min(5) });
exports.SIGNUP = Email.merge(Name).merge(Password);
exports.LOGIN = Email.merge(Password);
exports.Id = z.object({ id: z.string() });
const Title = z.object({ title: z.string().min(1).max(300) });
const Content = z.object({ content: z.string().min(1).max(1000) });
const Completed = z.object({ completed: z.boolean() });
exports.CREATE_TODO = Title.merge(Content).merge(Completed);
exports.EDIT_TODO = exports.CREATE_TODO;

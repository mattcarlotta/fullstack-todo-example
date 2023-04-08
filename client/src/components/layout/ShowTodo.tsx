import type { Todo, TodoId, Todos } from "types"
import { Show, createSignal } from "solid-js";
import clsx from "../../utils/clsx";
import CompleteIcon from "../../icons/CompleteIcon";
import EditIcon from "../../icons/EditIcon";
import DeleteIcon from "../../icons/DeleteIcon";
import EditTodoForm from "./EditTodoForm";
import timeSince from "../../utils/timeSince";
import { client } from "../../utils/client";
import { dispatchToastEvent } from "./Toast";

export type ShowTodoProps = {
    token: string
    todo: Todo
    handleDeleteTodo: (id: TodoId) => void;
    handleUpdateTodos: (todos: Todos) => void;
}

export default function ShowTodo(props: ShowTodoProps) {
    const [showEditForm, setEditForm] = createSignal(false);

    const toggleEditForm = () => {
        setEditForm(p => !p)
    }

    const completedTodo = async ({ id }: TodoId) => {
        try {
            const res = await client.completeTodo.query({ id, token: props.token })
            dispatchToastEvent({ type: 'success', message: res.message });
            props.handleUpdateTodos(res.todos)
        } catch (error: any) {
            dispatchToastEvent({ type: 'error', message: error?.message });
        }
    }

    return (
        <Show when={!showEditForm()} fallback={<EditTodoForm toggleEditForm={toggleEditForm} todo={props.todo} token={props.token} handleUpdateTodos={props.handleUpdateTodos} />}>
            <div class="rounded bg-primary-400 p-4 flex justify-between items-center">
                <div class={clsx(props.todo.completed && "line-through text-gray-400", "flex flex-col space-y-1")}>
                    <h2 class="text-2xl">{props.todo.title}{props.todo.completed && <CompleteIcon className="w-8 inline text-green-500" />}
                    </h2>
                    <p>{props.todo.content}</p>
                    <p class="text-sm">{new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(props.todo.createdAt))} (updated {timeSince(props.todo.updatedAt)})</p>
                </div>
                <div class="flex items-center space-x-2">
                    <button type="button" onClick={toggleEditForm}><EditIcon className="w-9" /></button>
                    {!props.todo.completed && <button type="button" onClick={() => completedTodo({ id: props.todo.id })}><CompleteIcon className="w-12 text-green-500" /></button>}
                    <button type="button" onClick={() => props.handleDeleteTodo({ id: props.todo.id })}><DeleteIcon className="w-10 text-red-500" /></button>
                </div>
            </div>
        </Show>
    )
}

import type { Todo, TodoId, Todos } from 'types';
import { Show, createSignal } from 'solid-js';
import clsx from '../../utils/clsx';
import CompleteIcon from '../../icons/CompleteIcon';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import EditTodoForm from './EditTodoForm';
import timeSince from '../../utils/timeSince';

export type ShowTodoProps = {
    token: string;
    todo: Todo;
    handleCompletedTodo: (id: TodoId) => void;
    handleDeleteTodo: (id: TodoId) => void;
    handleUpdateTodos: (todos: Todos) => void;
};

export default function ShowTodo(props: ShowTodoProps) {
    const [showEditForm, setEditForm] = createSignal(false);

    const toggleEditForm = () => {
        setEditForm((p) => !p);
    };

    return (
        <Show
            when={!showEditForm()}
            fallback={
                <EditTodoForm
                    toggleEditForm={toggleEditForm}
                    todo={props.todo}
                    token={props.token}
                    handleUpdateTodos={props.handleUpdateTodos}
                />
            }
        >
            <div
                class={clsx(
                    props.todo.completed ? 'bg-primary-900' : 'bg-primary-800',
                    'rounded p-4'
                )}
            >
                <div
                    class={clsx(
                        props.todo.completed && 'text-gray-400 line-through',
                        'flex space-x-1'
                    )}
                >
                    <h2 class="line-clamp-1 flex-1 break-all text-3xl">
                        {props.todo.title}
                        {props.todo.completed && (
                            <CompleteIcon className="ml-2 inline w-4 text-green-500" />
                        )}
                    </h2>
                    <div class="flex items-center space-x-2">
                        <button
                            type="button"
                            class="rounded p-1 transition-[background] hover:bg-primary-900"
                            onClick={toggleEditForm}
                        >
                            <EditIcon className="text-yellow-500" />
                        </button>
                        {!props.todo.completed && (
                            <button
                                type="button"
                                class="rounded p-1 transition-[background] hover:bg-primary-900"
                                onClick={() => props.handleCompletedTodo({ id: props.todo.id })}
                            >
                                <CompleteIcon className="text-green-500" />
                            </button>
                        )}
                        <button
                            type="button"
                            class="rounded p-1 transition-[background] hover:bg-primary-900"
                            onClick={() => props.handleDeleteTodo({ id: props.todo.id })}
                        >
                            <DeleteIcon className="text-red-500" />
                        </button>
                    </div>
                </div>
                <div class={clsx(props.todo.completed && 'text-gray-400 line-through')}>
                    <p class="break-all">{props.todo.content}</p>
                    <p class="text-sm">
                        {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                        }).format(new Date(props.todo.createdAt))}
                        (updated {timeSince(props.todo.updatedAt)})
                    </p>
                </div>
            </div>
        </Show>
    );
}

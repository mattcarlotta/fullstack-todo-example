import type { Todo, TodoId } from "types"

export type ShowTodoProps = {
    todo: Todo
    handleDeleteTodo: (id: any) => void;
    handleEditTodo: (id: TodoId) => void;
}

export default function ShowTodo(props: ShowTodoProps) {
    return (<div class="rounded bg-primary-400 p-4 flex justify-between items-center">
        <div class="flex flex-col">
            <h2 class="text-2xl">{props.todo.title}</h2>
            <p>{props.todo.content}</p>
        </div>
        <div class="flex space-x-2">
            <button type="button">Edit</button>
            <button type="button">Complete</button>
            <button type="button" onClick={() => props.handleDeleteTodo({ id: props.todo.id })}>Delete</button>
        </div>
    </div>
    )
}

import { For, Show, createSignal, onMount } from "solid-js"
import Cookie from 'js-cookie'
import type { TodoId, Todos } from "types"
import ShowTodo from "./ShowTodo"
import { client } from "../../utils/client"
import AddTodoForm from "./AddTodoForm"
import { dispatchToastEvent } from "./Toast"

type ShowTodoProps = {
    todos?: Todos
}

export default function ShowTodos(props: ShowTodoProps) {
    // eslint-disable-next-line solid/reactivity
    const [todos, setTodos] = createSignal(props.todos || [])
    const [token, setToken] = createSignal('');

    const handleUpdateTodos = (newTodos: Todos) => {
        setTodos(newTodos)
    }

    const handleDeleteTodo = async ({ id }: TodoId) => {
        try {
            const res = await client.deleteTodo.query({ id, token: token() })
            setTodos(todos => todos.filter(todo => todo.id !== res.id))
            dispatchToastEvent({ type: 'success', message: res.message });
        } catch (error: any) {
            dispatchToastEvent({ type: 'error', message: error?.message });
        }
    }

    onMount(() => {
        const token = Cookie.get("SESSION_TOKEN");
        setToken(token || '')
    })


    return (
        <Show when={todos().length} fallback={<AddTodoForm token={token()} handleUpdateTodos={handleUpdateTodos} />
        }>
            <section class="flex flex-col justify-center">
                <AddTodoForm token={token()} handleUpdateTodos={handleUpdateTodos} />
                <div class="mt-6 space-y-2">
                    <For each={todos()}>{(todo) => (
                        <ShowTodo token={token()} todo={todo} handleUpdateTodos={handleUpdateTodos} handleDeleteTodo={handleDeleteTodo} />
                    )}</For>
                </div>
            </section>
        </Show>
    )
}

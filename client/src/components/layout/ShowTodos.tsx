import { For, Show, createSignal, onMount } from "solid-js"
import Cookie from 'js-cookie'
import type { TodoId, Todos } from "types"
import ShowTodo from "./ShowTodo"
import { client } from "../../utils/client"

type ShowTodoProps = {
    todos?: Todos
}

export default function ShowTodos(props: ShowTodoProps) {
    // eslint-disable-next-line solid/reactivity
    const [todos, setTodos] = createSignal(props.todos || [])
    const [token, setToken] = createSignal('');

    const handleAddTodo = async () => {
        try {
            setTodos([])
        } catch (error) {
            console.error(error)
        }
    }

    const handleEditToto = async (todo: any) => {
        try {
            setTodos([])
        } catch (error) {
            alert(error?.toString())
        }
    }

    const handleDeleteTodo = async ({ id }: TodoId) => {
        try {
            const res = await client.deleteTodo.query({ id, token: token() })
            setTodos(todos => todos.filter(todo => todo.id !== res.id))
            alert(res.message)
        } catch (error: any) {
            alert(error?.message)
        }
    }

    onMount(() => {
        const token = Cookie.get("SESSION_TOKEN");
        setToken(token || '')
    })


    return (
        <Show when={todos().length} fallback={<p>Add Todo</p>}>
            <section class="flex flex-col justify-center">
                <div class="mt-6 bg-primary-400 p-4 rounded">
                    <h1 class="text-3xl">Add Todo</h1>
                </div>
                <div class="mt-6 space-y-2">
                    <For each={todos()}>{(todo) => (
                        <ShowTodo todo={todo} handleEditTodo={handleEditToto} handleDeleteTodo={handleDeleteTodo} />
                    )}</For>
                </div>
            </section>
        </Show>
    )
}

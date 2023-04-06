import { For, Show, createSignal } from "solid-js"
import type { Todos } from "types"

type ShowTodoProps = {
    todos?: Todos
}

export default function ShowTodos(props: ShowTodoProps) {
    // eslint-disable-next-line solid/reactivity
    const [todos, setTodos] = createSignal(props.todos || [])

    const handleAddTodo = async () => {
        try {
            setTodos([])
        } catch (error) {

            console.error(error)
        }
    }


    return (
        <Show when={todos().length} fallback={<p>Add Todo</p>}>
            <section class="flex flex-col justify-center">
                <div class="mt-6 bg-primary-400 p-4 rounded">
                    <h1 class="text-3xl">Add Todo</h1>
                </div>
                <div class="mt-6 space-y-2">
                    <For each={todos()}>{(todo) => (
                        <div class="rounded bg-primary-400 p-4 flex justify-between items-center">
                            <div class="flex flex-col">
                                <h2 class="text-2xl">{todo.title}</h2>
                                <p>{todo.content}</p>
                            </div>
                            <div class="flex space-x-2">
                                <button type="button">Edit</button>
                                <button type="button">Complete</button>
                                <button type="button">Delete</button>
                            </div>
                        </div>
                    )}</For>
                </div>
            </section>
        </Show>
    )
}

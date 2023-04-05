export default function ShowTodos({ todos }: { todos: any }) {
    if (!todos?.length) return <p>Add Todo</p>

    return (<pre>{JSON.stringify(todos, null, 4)}</pre>)
}

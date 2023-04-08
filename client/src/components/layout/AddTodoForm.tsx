import { createStore } from 'solid-js/store';
import { batch, createSignal } from 'solid-js';
import clsx from '../../utils/clsx';
import type { Todos } from 'types';
import { client } from '../../utils/client';
import { dispatchToastEvent } from './Toast';

type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement | HTMLTextAreaElement;
    target: HTMLInputElement | HTMLTextAreaElement;
};

type Store = {
    title: {
        value: string;
        error: string;
    };
    content: {
        value: string;
        error: string;
    };
    isSubmitting: boolean;
    formError: string;
};

export type AddTodoFormProps = {
    token: string,
    handleUpdateTodos: (todos: Todos) => void;
}

export default function AddTodoForm(props: AddTodoFormProps) {
    const [store, setStore] = createStore<Store>({
        title: { value: '', error: '' },
        content: { value: '', error: '' },
        isSubmitting: false,
        formError: ''
    });

    const [completed, setCompleted] = createSignal(false)

    const handleInputChange = (e: InputChangeEvent) => {
        setStore(e.target.name as keyof Store, { value: e.target.value, error: '' });
        setStore('formError', '');
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setStore('formError', '');
        setStore('isSubmitting', true);
        try {
            const res = await client.createTodo.query({ title: store.title.value, content: store.content.value, completed: completed(), token: props.token })
            dispatchToastEvent({ type: 'success', message: res.message })
            props.handleUpdateTodos(res.todos)
            batch(() => {
                setStore('title', { value: '', error: '' });
                setStore('content', { value: '', error: '' });
                setStore('isSubmitting', false);
                setCompleted(false);
            })
        } catch (error: any) {
            setStore('formError', String(error));
            setStore('isSubmitting', false);
        }
    };

    return (
        <div class="flex flex-col space-y-4 p-8 bg-primary-400 rounded text-white">
            <h1 class="text-3xl">Add Todo</h1>
            <div class="flex space-x-2">
                <form class="w-full" onSubmit={handleSubmit}>
                    <div class="flex flex-col space-y-1 h-24">
                        <label class="block" html-for="title">
                            Title
                        </label>
                        <input
                            class="px-1.5 py-2 rounded text-black"
                            type="text"
                            name="title"
                            id="title"
                            placeholder="Enter todo title..."
                            value={store.title.value}
                            onInput={handleInputChange}
                        />
                        {store.title.error && <p>{store.title.error}</p>}
                    </div>
                    <div class="flex flex-col space-y-1 h-48">
                        <label class="block" html-for="content">
                            Content
                        </label>
                        <textarea
                            class="px-1.5 py-2 rounded text-black"
                            name="content"
                            id="content"
                            rows="4"
                            cols="50"
                            placeholder="Enter a todo description..."
                            value={store.content.value}
                            onInput={handleInputChange}
                        />
                        {store.content.error && <p>{store.content.error}</p>}
                    </div>
                    <div class="flex flex-col space-y-1 h-10">
                        <label class="flex space-x-1">
                            <p>Completed</p>
                            <input
                                class="block"
                                type="checkbox"
                                checked={completed()}
                                onChange={() => setCompleted((p) => !p)}
                            />
                        </label>
                    </div>
                    <div>
                        <button
                            disabled={store.isSubmitting}
                            class={clsx(
                                store.isSubmitting ? 'text-gray' : 'text-primary',
                                'w-full bg-white p-2 rounded'
                            )}
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                    {store.formError && <p class="text-fire">{store.formError}</p>}
                </form>
            </div >
        </div >
    );
}


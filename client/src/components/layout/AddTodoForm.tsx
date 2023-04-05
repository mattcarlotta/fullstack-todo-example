import { createStore } from 'solid-js/store';
import { createSignal } from 'solid-js';
import clsx from '../../utils/clsx';

type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
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
    completed: {
        value: boolean;
        error: string;
    };
    isSubmitting: boolean;
    formError: string;
};

export default function LoginForm() {
    const [store, setStore] = createStore<Store>({
        title: { value: '', error: '' },
        content: { value: '', error: '' },
        completed: { value: true, error: '' },
        isSubmitting: false,
        formError: ''
    });
    const [passwordVisible, setPasswordVisibility] = createSignal(false);

    const handleInputChange = (e: InputChangeEvent) => {
        setStore(e.target.name as keyof Store, { value: e.target.value, error: '' });
        setStore('formError', '');
    };

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        setStore('formError', '');
        setStore('isSubmitting', true);
        try {
            const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/create`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ title: store.title.value, content: store.content.value, completed: store.completed.value }),
                credentials: 'include'
            });
            if (!res.ok) {
                const error = await res.text();
                throw error;
            }

            // update todos parent state
        } catch (error) {
            setStore('formError', String(error));
            setStore('isSubmitting', false);
        }
    };

    return (
        <div class="flex flex-col p-8 bg-primary-400 rounded text-white w-full max-w-screen-xs">
            <form class="flex flex-col space-y-2" onSubmit={handleSubmit}>
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
                <div class="flex flex-col space-y-1 h-24">
                    <label class="block" html-for="content">
                        Content
                    </label>
                    <input
                        class="px-1.5 py-2 rounded text-black"
                        type="text"
                        name="content"
                        id="content"
                        placeholder="Enter a todo description..."
                        value={store.content.value}
                        onInput={handleInputChange}
                    />
                    {store.content.error && <p>{store.content.error}</p>}
                </div>
                <div class="flex flex-col space-y-1 h-20">
                    <label class="flex space-x-1">
                        <p>Completed</p>
                        <input
                            class="block"
                            type="checkbox"
                            onChange={() => setPasswordVisibility((p) => !p)}
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
                        Add Todo
                    </button>
                </div>
                {store.formError && <p class="text-fire">{store.formError}</p>}
            </form>
        </div>
    );
}


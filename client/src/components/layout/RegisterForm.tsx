import { createStore } from 'solid-js/store';
import LogoIcon from '../../icons/LogoIcon';
import { createSignal } from 'solid-js';
import clsx from '../../utils/clsx';

type InputChangeEvent = InputEvent & {
    currentTarget: HTMLInputElement;
    target: HTMLInputElement;
};

type Store = {
    email: {
        value: string;
        error: string;
    };
    name: {
        value: string;
        error: string;
    };
    password: {
        value: string;
        error: string;
    };
    isSubmitting: boolean;
    formError: string;
};

export default function RegisterForm() {
    const [store, setStore] = createStore<Store>({
        email: { value: '', error: '' },
        name: { value: '', error: '' },
        password: { value: '', error: '' },
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
            const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/signup`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({
                    email: store.email.value,
                    name: store.name.value,
                    password: store.password.value
                })
            });
            if (!res.ok) {
                const error = await res.text();
                throw error;
            }

            window.location.pathname = '/login';
        } catch (error) {
            setStore('formError', String(error));
            setStore('isSubmitting', false);
        }
    };

    return (
        <div class="flex w-full max-w-screen-xs flex-col space-y-8 rounded bg-primary-400 p-8 text-white">
            <form class="flex flex-col space-y-2" onSubmit={handleSubmit}>
                <h1 class="flex items-center justify-center text-white">
                    <LogoIcon className="h-[40px]" />
                    <span class="text-2xl uppercase leading-none tracking-wider">Todo App</span>
                </h1>
                <h2 class="text-center text-lg">Register</h2>
                <div class="flex h-24 flex-col space-y-1">
                    <label class="block" html-for="user-name">
                        Dipslay Name
                    </label>
                    <input
                        class="rounded px-1.5 py-2 text-black"
                        type="text"
                        name="name"
                        id="user-name"
                        placeholder="Enter a display name..."
                        value={store.name.value}
                        onInput={handleInputChange}
                    />
                    {store.name.error && <p>{store.name.error}</p>}
                </div>
                <div class="flex h-24 flex-col space-y-1">
                    <label class="block" html-for="email">
                        Email
                    </label>
                    <input
                        class="rounded px-1.5 py-2 text-black"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter an email..."
                        value={store.email.value}
                        onInput={handleInputChange}
                    />
                    {store.email.error && <p>{store.email.error}</p>}
                </div>
                <div class="flex h-32 flex-col space-y-1">
                    <label class="block" html-for="password">
                        Password
                    </label>
                    <input
                        class="rounded px-1.5 py-2 text-black"
                        type={passwordVisible() ? 'text' : 'password'}
                        name="password"
                        id="password"
                        min={5}
                        placeholder="Enter a password..."
                        value={store.password.value}
                        onInput={handleInputChange}
                    />
                    <label class="flex space-x-1">
                        <p>Show Password</p>
                        <input
                            class="block"
                            type="checkbox"
                            onChange={() => setPasswordVisibility((p) => !p)}
                        />
                    </label>
                    {store.password.error && <p>{store.password.error}</p>}
                </div>
                <div>
                    <button
                        disabled={store.isSubmitting}
                        class={clsx(
                            store.isSubmitting ? 'text-gray' : 'text-primary',
                            'w-full rounded bg-white p-2'
                        )}
                        type="submit"
                    >
                        Register
                    </button>
                </div>
                {store.formError && <p class="text-fire">{store.formError}</p>}
            </form>
            <hr class="border-t border-gray-300" />
            <p>
                Already have an account?&nbsp;
                <a class="text-white underline" href="/login">
                    Log In
                </a>
            </p>
        </div>
    );
}

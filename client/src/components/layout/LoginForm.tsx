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
    password: {
        value: string;
        error: string;
    };
    isSubmitting: boolean;
    formError: string;
};

export default function LoginForm() {
    const [store, setStore] = createStore<Store>({
        email: { value: '', error: '' },
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
            const res = await fetch(`${import.meta.env.PUBLIC_API_URL}/login`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ email: store.email.value, password: store.password.value }),
                credentials: 'include'
            });
            if (!res.ok) {
                const error = await res.text();
                throw error;
            }

            window.location.pathname = '/todo';
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
                <h2 class="text-center text-lg">Log In</h2>
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
                        Login
                    </button>
                </div>
                {store.formError && <p class="text-fire">{store.formError}</p>}
            </form>
            <hr class="border-t border-gray-300" />
            <p>
                Don't have an account?&nbsp;
                <a class="text-white underline" href="/signup">
                    Sign Up
                </a>
            </p>
        </div>
    );
}

import { Show, batch, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import CloseIcon from "../../icons/CloseIcon";

export type ToastEvent = {
    message: string;
    type: "success" | "error" | ''
};

type ToastNotifcationStore = {
    show: boolean;
} & ToastEvent

interface ReceivedToastEvent extends CustomEvent<ToastEvent> { }

export function dispatchToastEvent(event: ToastEvent) {
    window.dispatchEvent(
        new CustomEvent("toast", {
            detail: event
        })
    );
}

export default function Toast() {
    const [toast, setToast] = createStore<ToastNotifcationStore>({
        show: false,
        message: '',
        type: '',
    })

    const resetToast = () => {
        batch(() => {
            setToast('show', false)
            setToast('message', "")
            setToast('type', "")
        })

    }

    const handleToastNotification = (event: Event) => {
        const { detail } = event as ReceivedToastEvent;
        if (toast.show) {
            resetToast();
        }

        batch(() => {
            setToast('type', detail.type)
            setToast('message', detail.message)
            setToast('show', true)
        })
    }

    onMount(() => {
        window.addEventListener('toast', handleToastNotification);

        onCleanup(() => {
            window.removeEventListener('toast', handleToastNotification);
        });
    });


    return (
        <Show when={toast.show} fallback={null}>
            <div class="rounded bg-green-500 fixed top-10 right-10 w-72">
                <div class="relative flex space-x-2 p-4 font-bold">
                    <h1>{toast.message}</h1>
                    <button class="absolute top-2 right-2" type="button" onClick={resetToast}>
                        <CloseIcon className="h-6 text-red-500" />
                    </button>
                </div>
            </div>
        </Show>
    )
}

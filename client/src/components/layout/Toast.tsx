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
    /* eslint-disable-next-line prefer-const */
    let toastRef: HTMLDivElement | undefined = undefined;
    let timerRef: NodeJS.Timeout | null = null;
    const [toast, setToast] = createStore<ToastNotifcationStore>({
        show: false,
        message: '',
        type: '',
    })

    const setTimer = () => {
        timerRef = setTimeout(() => resetToast(), 3000);
    }

    const clearTimer = () => {
        if (timerRef) {
            clearInterval(timerRef);
            timerRef = null;
            toastRef = undefined;
        }
    }

    const resetToast = () => {
        if (toast.show) {
            clearTimer();
            batch(() => {
                setToast('show', false)
                setToast('message', "")
                setToast('type', "")
            })
        }
    }

    const handleMouseOver = () => {
        if (toastRef && toast.show) {
            clearTimer();
        }
    }

    const handleMouseLeave = () => {
        if (!timerRef && toastRef && toast.show) {
            setTimer();
        }
    }

    const handleToastNotification = (event: Event) => {
        const { detail } = event as ReceivedToastEvent;

        resetToast();

        setTimer();

        batch(() => {
            setToast('type', detail.type)
            setToast('message', detail.message)
            setToast('show', true)
        })
    }

    onMount(() => {
        window.addEventListener('toast', handleToastNotification);

        onCleanup(() => {
            if (timerRef) clearInterval(timerRef)
            window.removeEventListener('toast', handleToastNotification);
        });
    });


    return (
        <Show when={toast.show} fallback={null}>
            <div onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} ref={toastRef} class="rounded bg-green-500 fixed top-4 right-10 w-72">
                <div class="flex space-x-2 p-4 font-bold">
                    <h1 class="flex-1 break-all">{toast.message}</h1>
                    <button class="flex-initial self-start" type="button" onClick={resetToast}>
                        <CloseIcon className="h-6 text-red-500" />
                    </button>
                </div>
            </div>
        </Show>
    )
}

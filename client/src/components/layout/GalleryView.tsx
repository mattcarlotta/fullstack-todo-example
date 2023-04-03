import { For, Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import ImagesIcon from '../../icons/ImagesIcon';
import calculateScale from '../../utils/calculateScale';
import clsx from '../../utils/clsx';
import type { TCONTENTFUL_IMAGE } from '../../utils/types';
import FocusTrapper from './FocusTrapper';

export type ModalDialogState = {
    currentIndex: number;
    open: boolean;
};

export default function GalleryView(props: { snapshots: Array<TCONTENTFUL_IMAGE> }) {
    // eslint-disable-next-line solid/reactivity
    const snapsLength = props.snapshots.length;
    const [state, setState] = createStore<ModalDialogState>({
        currentIndex: 0,
        open: false
    });

    const closeModal = () => {
        setState({ open: false, currentIndex: 0 });
    };

    const handleSelectImage = (idx: number) => {
        setState({ open: true, currentIndex: idx });
    };

    const handleNextImage = () => {
        const nextIndex = state.currentIndex + 1;
        handleSelectImage(nextIndex <= snapsLength - 1 ? nextIndex : 0);
    };

    const handlePrevImage = () => {
        const prevIndex = state.currentIndex - 1;
        handleSelectImage(prevIndex < 0 ? snapsLength - 1 : prevIndex);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            handlePrevImage();
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            handleNextImage();
        }
    };

    return (
        <>
            <section>
                <header>
                    <h2 id="snapshots" class="mt-5 text-xl font-bold text-gray-200 md:text-2xl">
                        Snapshots:
                    </h2>
                </header>
                <div class="my-4 flex flex-wrap items-center justify-center px-2.5">
                    <For each={props.snapshots}>
                        {(s, idx) => (
                            <button
                                aria-label={s.description}
                                type="button"
                                class="gallery"
                                onClick={() => handleSelectImage(idx())}
                            >
                                <h2
                                    id={s.title}
                                    data-title="card-title"
                                    class="m-0 bg-primary-800 p-0.5 text-base font-bold uppercase leading-4 text-white"
                                >
                                    {s.title}
                                </h2>
                                <div
                                    style={{
                                        'background-image': `url(${
                                            s.url
                                        }?fm=webp&h=${calculateScale(
                                            s.height,
                                            25
                                        )}&w=${calculateScale(s.width, 25)})`
                                    }}
                                    class="h-full w-full bg-cover bg-center bg-no-repeat"
                                />
                            </button>
                        )}
                    </For>
                </div>
            </section>
            <Show when={state.open} fallback={null}>
                <div class="fixed top-0 right-0 bottom-0 left-0 z-[1300]" role="presentation">
                    {props.snapshots[state.currentIndex].description && (
                        <p aria-live="polite" id="modal-description" class="fixed top-0 opacity-0">
                            {props.snapshots[state.currentIndex].description}
                        </p>
                    )}
                    <div
                        data-title="backdrop"
                        class="fixed top-0 right-0 bottom-0 left-0 z-[-1] flex items-center justify-center bg-primary-1000"
                    />
                    <FocusTrapper
                        class="h-full overflow-y-auto overflow-x-hidden text-center outline-0 after:inline after:h-full after:w-0 after:align-middle after:content-['']"
                        onEscapePress={closeModal}
                    >
                        <div
                            id="snapshot-gallery"
                            class="h-full"
                            role="dialog"
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                            aria-modal="true"
                            tabIndex={0}
                        >
                            <div class="fixed top-0 w-full">
                                <div class="absolute top-5 left-5 text-2xl text-white">
                                    <ImagesIcon class="mr-2.5 align-middle" />
                                    {state.currentIndex + 1} of {snapsLength}
                                </div>
                                <h2
                                    role="presentation"
                                    class="mt-10 p-5 text-center text-md uppercase text-white sm:mt-0 sm:text-2xl"
                                    id="modal-title"
                                >
                                    {props.snapshots[state.currentIndex].title}
                                </h2>
                                <button
                                    aria-label="close modal"
                                    class="pointer absolute top-2 right-3 rounded border border-solid border-transparent bg-transparent py-1.5 px-3 text-3xl text-gray-100 transition-[color] duration-300 ease-in-out hover:text-fire focus:border focus:border-solid focus:border-primary-100 focus:text-fire"
                                    type="button"
                                    onClick={closeModal}
                                >
                                    &#10006;
                                </button>
                            </div>
                            <div class="fixed left-1 top-[calc(50%-35px)]">
                                <button
                                    aria-label="View previous image"
                                    type="button"
                                    disabled={snapsLength <= 1}
                                    class={clsx(
                                        'rotate-180 rounded border border-solid border-transparent bg-transparent p-4 text-3xl transition-[color] duration-300 ease-in-out focus:border focus:border-solid focus:border-primary-100 sm:text-[3rem]',
                                        snapsLength > 1
                                            ? 'cursor-pointer text-white hover:text-primary-25 focus:text-primary-25'
                                            : 'hidden'
                                    )}
                                    onClick={handlePrevImage}
                                >
                                    &#10144;
                                </button>
                            </div>
                            <div class="fixed bottom-24 left-20 right-20 top-20">
                                <div
                                    style={{
                                        'background-image': `url(${
                                            props.snapshots[state.currentIndex].url
                                        }?fm=webp)`
                                    }}
                                    class="absolute top-0 bottom-0 right-0 left-0 flex items-center justify-center bg-contain bg-center bg-no-repeat"
                                />
                            </div>
                            <div class="fixed right-1 top-[calc(50%-35px)]">
                                <button
                                    aria-label="View next image"
                                    type="button"
                                    disabled={snapsLength <= 1}
                                    class={clsx(
                                        'rounded border border-solid border-transparent bg-transparent p-4 text-3xl transition-[color] duration-300 ease-in-out focus:border focus:border-solid focus:border-primary-100 sm:text-[3rem]',
                                        snapsLength > 1
                                            ? 'cursor-pointer text-white hover:text-primary-25 focus:text-primary-25'
                                            : 'hidden'
                                    )}
                                    onClick={handleNextImage}
                                >
                                    &#10144;
                                </button>
                            </div>
                            <div class="fixed left-0 bottom-0 w-full">
                                <div
                                    role="listbox"
                                    aria-activedescendant={`button-preview-${
                                        props.snapshots[state.currentIndex].title
                                    }`}
                                    aria-labelledby={`button-preview-${
                                        props.snapshots[state.currentIndex].title
                                    }`}
                                    tabIndex={snapsLength <= 1 ? -1 : 0}
                                    onKeyDown={handleKeyDown}
                                    class="overflow-y-auto whitespace-nowrap text-center"
                                >
                                    <For each={props.snapshots}>
                                        {(s, idx) => (
                                            <button
                                                role="option"
                                                aria-selected={
                                                    state.currentIndex === idx() ? 'true' : 'false'
                                                }
                                                aria-label={s.title}
                                                id={`button-preview-${s.title}`}
                                                style={{
                                                    'background-image': `url(${
                                                        s.url
                                                    }?fm=webp&h=${calculateScale(
                                                        s.height,
                                                        10
                                                    )}&w=${calculateScale(s.width, 10)})`
                                                }}
                                                type="button"
                                                class={clsx(
                                                    'mx-1.5 mb-2.5 h-preview min-w-preview cursor-pointer overflow-hidden rounded border-[0.1875rem] bg-cover bg-center bg-no-repeat p-0 duration-300 ease-in-out hover:opacity-100',
                                                    state.currentIndex === idx()
                                                        ? 'border-primary-25 opacity-100'
                                                        : 'border-gray-200 opacity-40'
                                                )}
                                                tabIndex={-1}
                                                onClick={() => handleSelectImage(idx())}
                                            />
                                        )}
                                    </For>
                                </div>
                            </div>
                        </div>
                    </FocusTrapper>
                </div>
            </Show>
        </>
    );
}

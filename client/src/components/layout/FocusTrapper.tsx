import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import type { AccessibleElement, Children } from '../../types';
import { ACCESSIBLE_ELEMENTS, isFocusable } from '../../utils/accessibilityHelpers';

export type FocusTrapperProps = Children & {
    class?: string;
    onEscapePress: () => void;
};

export default function FocusTrapper(props: FocusTrapperProps) {
    let tabbableItems: Array<HTMLElement> = [];
    let lastActiveElement: HTMLElement | undefined = undefined;
    /* eslint-disable-next-line prefer-const */
    let focusTrapRef: HTMLDivElement | undefined = undefined;
    const [tabIndex, setTabIndex] = createSignal(-1);

    const handleClick = (event: MouseEvent) => {
        const tabbableItemIndex =
            tabbableItems?.findIndex((node) => node.isEqualNode(event.target as HTMLElement)) || 0;

        setTabIndex(tabbableItemIndex >= 0 ? tabbableItemIndex : 0);
    };

    const handleFocusTrap = (event: KeyboardEvent) => {
        const { key, shiftKey } = event;
        const tabPress = key === 'Tab';
        const escKey = key === 'Escape' || key === 'Esc';
        const tabItemsLength = tabbableItems.length - 1;

        if (shiftKey && tabPress) {
            event.preventDefault();
            const prevIndex = tabIndex() - 1;
            const currentIndex = prevIndex < 0 ? tabItemsLength : prevIndex;
            setTabIndex(currentIndex);
        } else if (tabPress) {
            event.preventDefault();
            const nextIndex = tabIndex() + 1;
            const currentIndex = nextIndex > tabItemsLength ? 0 : nextIndex;
            setTabIndex(currentIndex);
        } else if (escKey) {
            event.stopPropagation();
            props.onEscapePress();
        }
    };

    onMount(() => {
        if (focusTrapRef) {
            lastActiveElement = document.activeElement as HTMLElement;

            tabbableItems = Array.from(
                focusTrapRef.querySelectorAll(ACCESSIBLE_ELEMENTS.join(','))
            ).filter((element) => isFocusable(element as AccessibleElement)) as HTMLElement[];

            if (tabbableItems.length) {
                setTabIndex(0);
            }
        }
    });

    createEffect(() => {
        tabbableItems[tabIndex()]?.focus();
    });

    onCleanup(() => {
        lastActiveElement?.focus();
    });

    return (
        <div
            role="presentation"
            class={props.class}
            ref={focusTrapRef}
            onKeyDown={handleFocusTrap}
            onClick={handleClick}
        >
            {props.children}
        </div>
    );
}

export default function CompleteIcon(props: { className: string }) {
    return (
        <svg
            class={props.className}
            height="1.225em"
            width="1.225em"
            fill="currentColor"
            role="img"
            viewBox="0 2 24 24"
        >
            <title>Complete Todo</title>
            <polyline fill="none" stroke="currentColor" stroke-line-cap="rounded" stroke-line-join="round" stroke-width="2" points="21 5 12 14 8 10" />
            <path d="M21,11v9a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V4A1,1,0,0,1,4,3H16" fill="none" stroke="currentColor" stroke-line-cap="rounded" stroke-line-join="round" stroke-width="2" />
        </svg>
    )
}

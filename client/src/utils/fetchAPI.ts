
async function tryJSON(res: Response) {
    try {
        const data = await res.json()
        return data
    } catch (error) {
        return null
    }
}
type Method = 'GET' | 'POST' | 'PUT' | 'DELETE'

export type FetchAPIArgs = {
    method: Method
    url: string
    headers?: HeadersInit
    body?: Record<string, unknown>
}

async function fetchAPI({ method, url, headers, body }: FetchAPIArgs) {
    const res = await fetch(
        `${import.meta.env.PUBLIC_API_URL}${url}`,
        {
            method,
            headers,
            body: JSON.stringify(body),
        }
    )

    const json = await tryJSON(res)

    if (!res.ok || json.errors) {
        const err = String(json?.errors?.[0]?.message || json?.message)
        console.error(
            `Error: Unable to complete the request to API endpoint. Reason: ${err}`
        )

        return Promise.reject(err)
    }

    return json
}

export function fetchGET(args: Pick<FetchAPIArgs, 'url' | 'headers'>) {
    return fetchAPI({ method: 'GET', ...args })
}

export function fetchPOST(args: Pick<FetchAPIArgs, 'url' | 'headers' | 'body'>) {
    return fetchAPI({ method: 'POST', ...args })
}

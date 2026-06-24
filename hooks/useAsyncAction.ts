import React from "react";

export function useAsyncAction() {
    const [running, setRunning] = React.useState(false);
    const [error, setError] = React.useState<Error | null | unknown>(null);
    const run = React.useCallback(
        async <TResult,>(fn: () => Promise<TResult>): Promise<TResult> => {
            setRunning(true);
            setError(null);

            try {
                return await fn();
            } catch (err) {
                setError(err);
                throw err; // preserve existing behavior
            } finally {
                setRunning(false);
            }
        },
        []
    );

    return {
        running,
        setRunning,
        error,
        setError,
        run,
    };
}
import { ValueRef } from '@holoflows/kit/es'
import { safeReact } from '../safeRequire'

export function useValueRef<T>(ref: ValueRef<T>) {
    const { useState, useEffect } = safeReact()

    const [value, setValue] = useState<T>(ref.value)
    useEffect(() => {
        if (ref.isEqual(value, ref.value) === false) {
            // The state is outdated before the useEffect runs
            setValue(ref.value)
        }
        return ref.addListener(v => setValue(v))
    }, [ref, value])
    return value
}

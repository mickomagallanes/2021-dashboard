import { useEffect, useRef } from 'react'

// TODO: move into its own module
function useDidUpdateEffect(fn, inputs) {
    const didMountRef = useRef(false);

    useEffect(() => {
        if (didMountRef.current)
            fn();
        else
            didMountRef.current = true;
    }, inputs);
}

export default useDidUpdateEffect;
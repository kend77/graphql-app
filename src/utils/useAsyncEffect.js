import { useEffect } from "react";

export default function useAsyncEffect(effect, deps) {
  useEffect(() => {
    effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effect, ...deps]);
}

import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

/**
 * The IntersectionObserver triggers if the element is off the viewport, so we have
 * to set top="-1px" or bottom="-1px" on the sticky element instead of 0
 */
const useIsStuck = () => {
  const ref = useRef(null)
  const [isStuck, setIsStuck] = useState(false)
  const { isReady } = useRouter()

  useEffect(() => {
    const cachedRef = ref.current
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const topOffsetPx = parseInt(getComputedStyle(cachedRef).top) + 1
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    const bottomOffsetPx = parseInt(getComputedStyle(cachedRef).bottom) + 1

    const observer = new IntersectionObserver(
      ([e]) => {
        setIsStuck(
          !e.isIntersecting &&
            (e.boundingClientRect.top < topOffsetPx ||
              e.boundingClientRect.bottom > bottomOffsetPx)
        )
      },
      {
        threshold: [1],
        rootMargin: `-${topOffsetPx || 0}px 0px 0px ${bottomOffsetPx || 0}px`,
      }
    )
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    observer.observe(cachedRef)
    // @ts-expect-error TODO: fix this error originating from strictNullChecks
    return () => observer.unobserve(cachedRef)
  }, [ref, isReady])

  return { ref, isStuck }
}

export default useIsStuck

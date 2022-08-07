import { useEffect, useState } from 'react'
import { throttle } from '@fishballer/bui'

function useHeightKeep (ref) {
  const [height, setHeight] = useState(0)
  useEffect(() => {
    const el = ref.current
    if (el) {
      const handleResize = throttle(() => {
        setHeight(preValue => el.clientHeight ? el.clientHeight : preValue)
      }, 60)

      window.addEventListener('resize', handleResize)
      setHeight(el.clientHeight)
      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
    return null
  }, [ref, ref.current])

  return height
}

export default useHeightKeep

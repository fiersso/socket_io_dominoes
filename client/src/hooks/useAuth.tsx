import { ReactElement } from "react"






function useAuth(child: ReactElement) {
  return (
    <>
        {child}
    </>
  )
}

export default useAuth
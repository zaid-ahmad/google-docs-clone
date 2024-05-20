import Quill from "quill"
import "quill/dist/quill.snow.css"
import { useCallback, useEffect } from "react"
import {io} from "socket.io-client"

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
]

export default function TextEditor() { 

  useEffect(() => {
    const socket = io("https://3000-idx-google-docs-clone-1716226088741.cluster-t23zgfo255e32uuvburngnfnn4.cloudworkstations.dev/")
    
    return () => {
      socket.disconnect()
    }
  }, [])

  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return

    wrapper.innerHTML = ""
    const editor = document.createElement("div")
    wrapper.append(editor)
    new Quill(editor, {theme: "snow", modules: { toolbar: TOOLBAR_OPTIONS }}, )
  }, [])
  
    return (
    <div id="container" ref={wrapperRef}></div>
  )
}

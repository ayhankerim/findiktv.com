import { useSelector, useDispatch } from "react-redux"
import { addFavourite, toggleSettingsModal } from "@/store/progress"

export default function MyComponent(comment) {
  const dispatch = useDispatch()
  const favouriteNotes = useSelector((state) => state.progress.favouriteNotes)
  const settingsModalOpen = useSelector(
    (state) => state.progress.settingsModalOpen
  )
  console.log(favouriteNotes)
  return (
    <>
      <section>
        <ul>
          {favouriteNotes.map((note) => {
            ;<li key={note}>{note[comment]}</li>
          })}
        </ul>
        <button type="button" onClick={() => dispatch(addFavourite(comment))}>
          Add Favourite
        </button>
      </section>

      <section>
        <button type="button" onClick={() => dispatch(toggleSettingsModal())}>
          Toggle Settings Modal
        </button>
      </section>

      {settingsModalOpen && (
        <div>
          <h2>Settings</h2>
          <button type="button" onClick={() => dispatch(toggleSettingsModal())}>
            Close
          </button>
        </div>
      )}
    </>
  )
}

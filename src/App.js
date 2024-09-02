import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState(null);

  // Charger les notes depuis l'API
  useEffect(() => {
    fetch("http://localhost:5000/notes")
      .then((response) => response.json())
      .then((data) => setNotes(data));
  }, []);

  const addNote = () => {
    if (noteText.trim() !== "") {
      if (isEditing) {
        // Modifier la note via l'API
        fetch(`http://localhost:5000/notes/${currentNoteId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: noteText }),
        })
          .then((response) => response.json())
          .then((updatedNote) => {
            const updatedNotes = notes.map((note) =>
              note.id === currentNoteId ? updatedNote : note
            );
            setNotes(updatedNotes);
            setIsEditing(false);
            setCurrentNoteId(null);
            setNoteText("");
          });
      } else {
        // Ajouter une nouvelle note via l'API
        fetch("http://localhost:5000/notes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: noteText }),
        })
          .then((response) => response.json())
          .then((newNote) => {
            setNotes([...notes, newNote]);
            setNoteText("");
          });
      }
    }
  };

  const deleteNote = (id) => {
    // Supprimer la note via l'API
    fetch(`http://localhost:5000/notes/${id}`, {
      method: "DELETE",
    }).then(() => {
      const newNotes = notes.filter((note) => note.id !== id);
      setNotes(newNotes);
    });
  };

  const editNote = (id, text) => {
    setNoteText(text);
    setIsEditing(true);
    setCurrentNoteId(id);
  };

  return (
    <div className="App">
      <h1>Notes</h1>
      <input
        type="text"
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Ajouter une nouvelle note..."
      />
      <button onClick={addNote}>{isEditing ? "Modifier" : "Ajouter"}</button>
      <TransitionGroup component="ul">
        {notes.map((note) => (
          <CSSTransition key={note.id} timeout={500} classNames="note">
            <li>
              {note.text}{" "}
              <button onClick={() => editNote(note.id, note.text)}>Éditer</button>
              <button onClick={() => deleteNote(note.id)}>Supprimer</button>
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
}

export default App;

import React, { useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css"; // Draft.js'in varsayılan stilleri için

const MyEditor = () => {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    // Text değiştikçe EditorState güncelleme fonksiyonu
    const handleEditorChange = (newState: EditorState) => {
        setEditorState(newState);
    };

    // Inline stil uygulamak için fonksiyon
    const toggleInlineStyle = (style: string) => {
        const newState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(newState);
    };

    // Klavye komutlarını işleme
    const handleKeyCommand = (command: string) => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            setEditorState(newState);
            return "handled";
        }
        return "not-handled";
    };

    return (
        <div>
            <h1>Rich Text Editor</h1>
    <div style={{ border: "1px solid #ddd", padding: "10px", minHeight: "100px" }}>
    {/* Draft.js Editor Bileşeni */}
    <Editor
        editorState={editorState}
    onChange={handleEditorChange}
    handleKeyCommand={handleKeyCommand} // Klavye komutlarını bağlama
    />
    </div>
    {/* Stil butonları */}
    <div style={{ marginTop: "10px" }}>
    <button onClick={() => toggleInlineStyle("BOLD")}>Bold</button>
    <button onClick={() => toggleInlineStyle("ITALIC")}>Italic</button>
    <button onClick={() => toggleInlineStyle("UNDERLINE")}>Underline</button>
    </div>
    </div>
);
};

export default MyEditor;

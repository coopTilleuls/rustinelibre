import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorProps {
    content: string|null;
    setContent: (value: string) => void;
}

const Editor = ({content, setContent}: EditorProps): JSX.Element => {
    let [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(true);
    }, []);


    if (loaded) {
        return (
            <div style={{ minHeight: '225px' }}>
                <CKEditor
                    editor={ClassicEditor}
                    data={content}
                    onChange={(event, editor) => {
                        const data: string = editor.getData();
                        setContent(data);
                    }}
                    config={{
                        toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', '|', 'undo', 'redo']
                    }}
                />
            </div>
        );
    } else {
        return <p> Editor is loading </p>;
    }
}

export default Editor;

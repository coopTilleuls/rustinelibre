import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface EditorProps {
    content: string|null;
    setContent: React.Dispatch<React.SetStateAction<string>>;
}

const Editor = ({content, setContent}: EditorProps): JSX.Element => {
    let [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    if (loaded) {
        return (
            <CKEditor
                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data: string = editor.getData();
                    setContent(data);
                }}
            />
        );
    } else {
        return <p> Editor is loading </p>;
    }
}

export default Editor;

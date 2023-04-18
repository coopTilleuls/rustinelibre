import React, { useEffect, useState } from "react";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// import dynamic from 'next/dynamic';
// const Editor = dynamic(() => import("@components/form/Editor"), {
//     ssr: false
// });

import dynamic from 'next/dynamic';

const ClassicEditor = dynamic(() => import('@ckeditor/ckeditor5-build-classic'), {
    ssr: false
});

const CKEditor = dynamic(() => import('@ckeditor/ckeditor5-react'), {
    ssr: false
});


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
            <CKEditor

                editor={ClassicEditor}
                data={content}
                onChange={(event, editor) => {
                    const data: string = editor.getData();
                    setContent(data);
                }}
                config={{
                    toolbar: ['heading', '|', 'bold', 'italic', 'blockQuote', 'link', 'numberedList', 'bulletedList', 'imageUpload', 'insertTable',
                        'tableColumn', 'tableRow', 'mergeTableCells', 'mediaEmbed', '|', 'undo', 'redo']
                }}
            />
        );
    } else {
        return <p> Editor is loading </p>;
    }
}

export default Editor;

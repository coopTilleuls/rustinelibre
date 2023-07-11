import React, {useEffect, useState} from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {Box} from '@mui/material';

interface EditorProps {
  content: string | null;
  setContent: (value: string) => void;
}

const Editor = ({content, setContent}: EditorProps): JSX.Element => {
  let [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  if (loaded) {
    return (
      <Box sx={{mt: 2, mb: 1}}>
        <CKEditor
          editor={ClassicEditor}
          data={content ? content : 'Description...'}
          onChange={(event, editor) => {
            const data: string = editor.getData();
            setContent(data);
          }}
          config={{
            toolbar: [
              'heading',
              '|',
              'bold',
              'italic',
              'blockQuote',
              'link',
              'numberedList',
              'bulletedList',
              '|',
              'undo',
              'redo',
            ],
          }}
        />
      </Box>
    );
  } else {
    return <p> Editor is loading </p>;
  }
};

export default Editor;

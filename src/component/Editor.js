import React, { useEffect, useRef } from 'react';
import CodeMirror, { changeEnd } from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/edit/closetag';
//import 'codemirror/addon/edit/'

function Editor({socketRef , roomId, onCodeChange}) {
    const editorRef = useRef(null);

    useEffect(() =>{

        const init = async () => {

            const editor = CodeMirror.fromTextArea(document.getElementById('realtimeeditor'), {
                mode: {name:'javascript', json:true},
                theme:'dracula',
                autoCloseTags:true,
                lineNumbers:true,
                autoCloseBrackets:true,
            });
            editorRef.current = editor;

            editor.setSize(null, '100%');
            editor.on('change', (instance, changes) => {
                const { origin } = changes;
                const code = instance.getValue();
                onCodeChange(code);

                if(origin !== 'setValue'){
                    socketRef.current.emit('code-change', {
                        roomId,
                        code,
                    });
                }
            });

            
        };
        init();
    }, []);

    useEffect(() => {
        if(socketRef.current){
        socketRef.current.on('code-change', ({code}) => {
            if(code !== null){
                editorRef.current.setValue(code);
            }
        
        });

        return () => {
            socketRef.current.off('code-change')
        };
    }}, [socketRef.current]);

  return (
    <div style={{height:'98vh',margin:'5px 4px'}}>
        <textarea id='realtimeeditor'></textarea>
      
    </div>
  )
}

export default Editor

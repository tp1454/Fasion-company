import React, { useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function RichTextEditor({ content, onChange, placeholder = "Nhập nội dung..." }) {
    // Quill modules configuration
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['blockquote'],
            ['link'],
            ['clean']
        ],
    }), []);

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet',
        'align',
        'blockquote',
        'link'
    ];

    return (
        <div className="rich-text-editor">
            <ReactQuill
                theme="snow"
                value={content || ''}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="bg-white"
            />
        </div>
    );
}

export default RichTextEditor;

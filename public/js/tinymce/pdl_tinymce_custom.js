function pdl_image_upload_handler(blobInfo, success, failure, progress) {
    var xhr, formData;

    xhr = new XMLHttpRequest();
    xhr.withCredentials = false;
    xhr.open('POST', 'api/baseActions/notes/UPLOAD_IMAGE_paste.json');

    xhr.upload.onprogress = function (e) {
        progress(e.loaded / e.total * 100);
    };

    xhr.onload = function () {
        var json;

        if (xhr.status === 403) {
            failure('HTTP Error: ' + xhr.status, { remove: true });
            return;
        }

        if (xhr.status < 200 || xhr.status >= 300) {
            failure('HTTP Error: ' + xhr.status);
            return;
        }

        json = JSON.parse(xhr.responseText);

        if (!json || typeof json.location != 'string') {
            failure('Invalid JSON: ' + xhr.responseText);
            return;
        }
        success(json.location);
    };

    xhr.onerror = function () {
        failure('Image upload failed due to a XHR Transport error. Code: ' + xhr.status);
    };

    formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());

    xhr.send(formData);
};

function pdl_tinymce_reset(editor) {
    tinymce.get(editor).setContent('');
    pdl_tinymce_destroy(editor);
}
function pdl_tinymce_destroy(editor) {
    tinymce.get(editor).destroy();
}

function pdl_tinymce_init(editor, content) {
    tinymce.init({
        selector: `textarea#${editor}`,
        height: 400,
        menubar: false,
        plugins: [
        'advlist autolink fullscreen lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | fullscreen | help',
        images_upload_handler: pdl_image_upload_handler,
        automatic_uploads: true,
        paste_data_images: true,
        setup: function(editor) {
            editor.on('change', function(e) {
                document.querySelector(`textarea#${editor.settings.id}`).value = tinymce.activeEditor.getContent()
            });
            editor.on('init', function(e) {
                editor.setContent(content || '');
            });
        }
    });
}
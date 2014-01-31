jQueryUploader
==============

This is a jquery plugin for upload images or videos.

Dependencies:
jquery.form.js
jquery.colorbox.js http://www.jacklmoore.com/colorbox/

Usage:
    $(function () {
        $('.uploader').uploader({
            url: 'upload.ashx',
            onSuccess: function (data) {
                $(this).uploader('preview', data);
            },
            rel: 'rel'
        });
    });

jQueryUploader
==============

This is a jquery plugin that upload images and videos.

Dependencies:

* jquery.form.js</li>
* jquery.colorbox.js (http://www.jacklmoore.com/colorbox/)


##Usage:
```html
    <div>
        <span class="uploader"></span>
        <span class="uploader"></span>
        <span class="uploader"></span>
        <span class="uploader"></span>
    </div>
```

```js
    $(function () {
        $('.uploader').uploader({
            url: 'upload.ashx',
            onSuccess: function (data) {
                $(this).uploader('preview', data);
            },
            rel: 'rel'
        });
    });
```

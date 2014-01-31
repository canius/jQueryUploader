/* 
 * jQueryUploader - v1.0.0 - 2014-01-30
 * 
 * https://github.com/caniusq/jQueryUploader
 * Copyright (c) 2014 canius; Licensed MIT
 * 
 * Dependencies:jquery.form.js
 *              jquery.colorbox.js http://www.jacklmoore.com/colorbox/
 * 
 */

(function ($) {

    function init(target) {
        var uploader = $(target);

        var preview = $('<div class="uploader_preview">' +
            '<img class="preview_image" /><span class="preview_status" /><span class="preview_remove">✘</span></div>');

        var form = $('<form class="uploader_form" method="post" enctype="multipart/form-data">' +
            '<div class="wrapper">' +
            '<input type="file" /><div class="btup"><div class="progress" /><div class="bar" /></div>' +
            '</div></form>');

        uploader.append(preview, form);

        var input = form.find('input');
        var btup = form.find('.btup');
        var btremove = preview.find('.preview_remove');

        input.change(function () {
            var fileName = input.val().replace(/.*fakepath(\/|\\)/, '');
            upload(target, fileName);
        }).hover(function () {
            btup.addClass('btup_hover');
        }, function () {
            btup.removeClass('btup_hover');
        });

        preview.hover(function () {
            btremove.show();
        }, function () {
            btremove.hide();
        });

        btremove.click(function () {
            remove(target);
        }).hide();

        return uploader;
    }

    function reload(target) {
        var state = $.data(target, 'uploader');
        var opts = state.options;
        var uploader = state.uploader;

        var preview = uploader.find('.uploader_preview');
        var image = preview.find('.preview_image');

        image.css({ width: opts.width, height: opts.height });
        preview.hide();

        var form = uploader.find('.uploader_form');
        var input = form.find('input');
        var btup = form.find('.btup');
        var progress = form.find('.progress');
        var bar = form.find('.bar');

        form.css({ width: opts.width, height: opts.height }).show();
        progress.hide();
        bar.height('0%');
        form.prop('action', opts.url);
        input.prop('name', opts.paramName).prop('accept', opts.accept).val('');
        btup.css({ width: opts.width, height: opts.height });
    }

    function remove(target) {
        var state = $.data(target, 'uploader');
        var opts = state.options;

        reload(target);

        if (opts.onRemove) {
            opts.onRemove.call(target);
        }
    }

    function upload(target, fileName) {
        var state = $.data(target, 'uploader');
        var opts = state.options;
        var uploader = state.uploader;

        var form = uploader.find('.uploader_form');
        var progress = form.find('.progress');
        var bar = form.find('.bar');

        form.ajaxSubmit({
            data: opts.otherParams,
            beforeSend: function () {
                progress.show();
                bar.height('0%');
            },
            uploadProgress: function (event, position, total, percentComplete) {
                bar.height(percentComplete + '%');
            },
            success: function (data, status, xhr) {
                bar.height('100%');
                if (opts.onSuccess) {
                    opts.onSuccess.call(target, data);
                }
            },
            error: function (xhr, status, error) {
                preview(target, null, error);
            },
            complete: function (xhr, status) {
            }
        });
    }

    function preview(target, url, err) {
        var state = $.data(target, 'uploader');
        var opts = state.options;
        var uploader = state.uploader;

        var preview = uploader.find('.uploader_preview');
        var status = preview.find('.preview_status');
        var form = uploader.find('.uploader_form');
        form.hide();
        preview.show();

        var image = preview.find('.preview_image');
        image.removeClass('play');

        if (url) {
            status.hide();

            if (url.match(/.mp4|.mov$/)) {
                image.addClass('play');
                if (opts.onPreviewVideo) {
                    opts.onPreviewVideo.call(target, image, url);
                }
            }
            else {
                image.prop('src', url);
                if (opts.onPreviewImage) {
                    opts.onPreviewImage.call(target, image, url);
                }
            }
        }
        else {
            status.html(err);
            status.show();
        }
    }

    $.fn.uploader = function (options, param) {
        if (typeof options == 'string') {
            return $.fn.uploader.methods[options](this, param);
        }

        options = options || {};
        return this.each(function () {
            var state = $.data(this, 'uploader');
            if (state) {
                $.extend(state.options, options);
            } else {
                state = $.data(this, 'uploader', {
                    options: $.extend({}, $.fn.uploader.defaults, options),
                    uploader: init(this)
                });
            }
            reload(this);
        });
    };

    $.fn.uploader.methods = {
        options: function (jq) {
            return $.data(jq[0], 'uploader').options;
        },
        reload: function (jq) {
            return jq.each(function () {
                reload(this);
            });
        },
        preview: function (jq, url) {
            return jq.each(function () {
                preview(this, url);
            });
        },
        error: function (jq, err) {
            return jq.each(function () {
                preview(this, null, err);
            });
        }
    };

    $.fn.uploader.defaults = {
        width: '84px',
        height: '84px',
        accept: '*/*',      //image/*,video/*
        url: '',            //upload url
        paramName: 'file',  //upload input file name
        otherParams: {},    //upload data
        rel: null,          //colorbox rel
        onSuccess: null,    //function(data){}
        onRemove: null,     //function(){}
        onPreviewImage: function (image, url) {
            var $this = $(this);
            var rel = $this.uploader('options').rel;
            image.colorbox({ html: null, href: null });
            image.colorbox({
                rel: rel,
                href: url,
                maxWidth: '1024px',
                maxHeight: '768px'
            });
        },
        onPreviewVideo: function (image, url) {
            var $this = $(this);
            var rel = $this.uploader('options').rel;
            image.colorbox({ html: null, href: null });
            var video = $('<video controls="controls" />').prop('src', url)[0];
            video.addEventListener('loadedmetadata', function () {
                video.width = video.videoWidth;
                video.height = video.videoHeight;
                image.colorbox({
                    rel: rel,
                    html: video.outerHTML,
                    maxWidth: '1024px',
                    maxHeight: '768px'
                });
            }, true);
            video.addEventListener('error', function (err) {
                $this.uploader('error', this.error.toString());
            }, true);
        }
    };
}(jQuery));

// gnb
var App = App || {};

$(document).ready(function () {
    App.MainGnb.init();

    // kích thước màn hình ở logo
    var $logoSpan = $('.logo a span');
    if ($logoSpan.length > 0) {
        var baseText = $logoSpan.text().replace(/\s*\(\d+\)$/, '');
        function updateLogoSize() {
            $logoSpan.text(baseText + ' (' + window.innerWidth + ')');
        }
        updateLogoSize();
        $(window).on('resize', updateLogoSize);
    }
});

// check hover và touch
var isHoverGnb = false;
var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;

// body.header-action
function updateHeaderAction() {
    var hasActiveAction = $('body').hasClass('gnb-open') ||
        $('body').hasClass('search-open') ||
        $('body').hasClass('lang-open') ||
        $('body').hasClass('mmenu-open') ||
        $('body').hasClass('popup-open');

    if (hasActiveAction) {
        $('body').addClass('header-action');
    } else {
        $('body').removeClass('header-action');
    }
}

// clear util
function closeAllExcept(activeType) {
    if (activeType !== 'gnb') {
        $('body').removeClass('gnb-open');
        $('.depth01 > li').removeClass('on');
        isHoverGnb = false;
    }
    if (activeType !== 'search') $('body').removeClass('search-open');
    if (activeType !== 'lang') $('body').removeClass('lang-open');
    if (activeType !== 'mmenu') $('body').removeClass('mmenu-open');
    if (activeType !== 'popup') $('body').removeClass('popup-open');
}

// gnb
App.MainGnb = function () {
    var self;
    return {
        init: function () {
            self = this;

            // chiều cao mặc định cho gnb bg
            $('.gnb-bg').css({ height: 'auto' });
            if ($('.sub-mn-box .depth02 > li').find('a').hasClass('active')) {
                $('.sub-mn-box .depth02 > li a.active').parents('li').addClass('active');
            }
            $('.depth01 > li > a').on('mouseenter focusin', self.onMouseOver);
            $('.sub-mn-box .depth02 > li:last-of-type > a').on('focusout', self.onMouseLeave);
            $('.header-inner').on('mouseleave', self.onMouseLeave);

            // tính toán kích thước cố định ban đầu để tránh lặp lại trên mỗi sự kiện resize (gây giật lag)
            var GNB_BASE_WIDTH = 170;
            var $gnbBox = $(".header-inner .gnb-box");
            var $depth01 = $gnbBox.find(".depth01");
            var $gnbLis = $depth01.find("> li");
            var $subBoxes = $('.sub-mn-box');
            var liCount = $gnbLis.length;
            var boxWidth = GNB_BASE_WIDTH * liCount;

            var logoWidth = $(".header-inner .logo").outerWidth(true) || 0;
            var utilWidth = $(".header-inner .util-wrap").outerWidth(true) || 0;
            var requiredWidth = logoWidth + boxWidth + utilWidth + 40;

            function depth02Set() {
                var headerWidth = $(".header-inner").width();
                var shouldBeCustom = (window.innerWidth < 1400) || (headerWidth < requiredWidth);

                if (window.innerWidth >= 1024) {
                    if (window.innerWidth >= 1400) {
                        if (shouldBeCustom) {
                            if (!$gnbBox.hasClass("gnb-custom")) {
                                $gnbBox.addClass("gnb-custom");
                                $depth01.css({ 'max-width': '' });
                                $gnbLis.css({ 'width': '' });
                            }
                        } else {
                            if ($gnbBox.hasClass("gnb-custom") || !$depth01[0].style.maxWidth) {
                                $gnbBox.removeClass("gnb-custom");
                                $depth01.css({ 'max-width': boxWidth + 'px' });
                                $gnbLis.css({ 'width': GNB_BASE_WIDTH + 'px' });
                            }
                        }
                    } else {
                        if ($gnbBox.hasClass("gnb-custom") || $depth01[0].style.maxWidth) {
                            $gnbBox.removeClass("gnb-custom");
                            $depth01.css({ 'max-width': '' });
                            $gnbLis.css({ 'width': '' });
                        }
                    }
                } else {
                    if ($gnbBox.hasClass("gnb-custom") || $depth01[0].style.maxWidth || ($subBoxes.length && $subBoxes[0].style.width)) {
                        $gnbBox.removeClass("gnb-custom");
                        $depth01.css({ 'max-width': '' });
                        $gnbLis.css({ 'width': '' });
                        $subBoxes.css({ 'width': '', 'left': '' });
                    }
                    return;
                }

                // căn chỉnh chiều rộng và vị trí cho sub-mn-box
                $gnbLis.each(function () {
                    var $li = $(this);
                    var liWidth = $li.outerWidth();
                    var leftPos = $li.position().left;

                    $li.find('.sub-mn-box').css({
                        'width': liWidth + 'px',
                        'left': leftPos + 'px'
                    });
                });
            }

            // độ trễ hỗ trợ chuyển ngữ
            function depth02SetDelay() {
                setTimeout(function () {
                    depth02Set();
                    setTimeout(function () {
                        if (isHoverGnb) {
                            $('.depth01 > li.on > a').trigger('mouseenter');
                        }
                    }, 500);
                }, 500);
            }

            // chạy lần đầu
            depth02Set();

            // cập nhật khi thay đổi kích thước
            $(window).on("load resize", depth02Set);

            // theo dõi thay đổi ngôn ngữ
            var htmlLang = $('html').attr('lang');
            if (htmlLang) {
                depth02SetDelay();
            }
            var htmlLangObserver = new MutationObserver(function () {
                depth02SetDelay();
            });
            htmlLangObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['lang']
            });

            // cập nhật lại khi thay đổi kích thước lúc đang mở menu
            $(window).on('resize', function () {
                if (isHoverGnb) {
                    $('.depth01 > li.on > a').trigger('mouseenter');
                    setTimeout(function () {
                        if (isHoverGnb) {
                            $('.depth01 > li.on > a').trigger('mouseenter');
                        }
                    }, 500);
                }
            });
        },

        // hover
        onMouseOver: function () {
            isHoverGnb = true;
            var subMnBox = $(this).next('.sub-mn-box');

            // clear util
            closeAllExcept('gnb');

            // height gnb-bg
            var $allSub = $('.sub-mn-box');
            $allSub.css({ height: 'auto' });
            var maxHeight = 0;
            $allSub.each(function () {
                maxHeight = Math.max(maxHeight, $(this).outerHeight());
            });
            $(".sub-mn-box").css({ height: maxHeight + "px" });
            var bgHeight = maxHeight;
            // Khi gnb-box rớt xuống (tablet hoặc gnb-custom) thì cộng thêm 50px vào chiều cao nền
            if (window.innerWidth < 1400 || $('.gnb-box').hasClass('gnb-custom')) {
                bgHeight += 50;
            }
            $('.gnb-bg').css({ height: bgHeight + 'px' });

            $('.depth01 > li').removeClass('on');
            $(this).parent('li').addClass('on');

            if (subMnBox.find('.depth02 > li').length > 0) {
                $('body').addClass('gnb-open');
            } else {
                $('body').removeClass('gnb-open');
            }
            updateHeaderAction();
        },

        // rê chuột ra ngoài
        onMouseLeave: function () {
            isHoverGnb = false;
            // độ trễ để tăng trải nghiệm người dùng
            setTimeout(function () {
                if (!isHoverGnb) {
                    $('body').removeClass('gnb-open');
                    $('.gnb-bg').css({ height: '' });
                    $('.sub-mn-box').css({ height: '' });
                    $('.depth01 > li').removeClass('on');
                    updateHeaderAction();
                }
            }, 100);
        }
    };
}();

// scroll
$(function () {
    // sự kiện cuộn trang
    $(window).on('scroll', function () {
        $('header').toggleClass('fixed', $(window).scrollTop() > 0);
    }).trigger('scroll');
});
// cuộn lên đầu trang
$('.scroll-top').on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
});

// popup
$(function () {
    // nút mở popup
    $('.openpopup > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('popup-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('popup');
            $('body').addClass('popup-open');
            const paddingTopVal = $('.header-inner').outerHeight() + 20;
            $('.popup-box').css('padding-top', paddingTopVal + 'px');
        }
        updateHeaderAction();
    });
    $('.popup-close').on('click', function (e) {
        e.preventDefault();
        closeAllExcept(null);
        updateHeaderAction();
    });
});

// search
$(function () {
    // nút mở tìm kiếm
    $('.opensearch > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('search-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('search');
            $('body').addClass('search-open');
        }
        updateHeaderAction();
    });
    $('.search-close').on('click', function (e) {
        e.preventDefault();
        closeAllExcept(null);
        updateHeaderAction();
    });
});

// lang
$(function () {
    // nút mở ngôn ngữ
    $('.openlang > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('lang-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('lang');
            $('body').addClass('lang-open');

            const $parent = $('.openlang');
            const headerHeight = $('.header-inner').outerHeight();
            const openlangHeight = $parent.outerHeight();
            const offset = (headerHeight - openlangHeight) / 2;
            $parent.find('> ul').css('top', 'calc(100% + ' + offset + 'px)');
        }
        updateHeaderAction();
    });
    $('.header-inner').on('mouseleave', function () {
        if ($('body').hasClass('lang-open')) {
            closeAllExcept(null);
            updateHeaderAction();
        }
    });
});

// gnb mobile
$(function () {
    // nút mở menu di động
    $('.openmenu > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('mmenu-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('mmenu');
            $('body').addClass('mmenu-open');
        }
        updateHeaderAction();
    });
    $('.gnb-mobile-inner .depth01 > li > a').on('click', function (e) {
        e.preventDefault();
        $('.gnb-mobile-inner .depth01 > li').removeClass('active');
        $(this).parent('li').addClass('active');
    });
});

// main visual
$(function () {
    const swiper = new Swiper('.main-vi-swiper', {
        loop: true,
        watchOverflow: true,
        speed: 1000,
        effect: 'fade',
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.main-vi-swiper .pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.main-vi-swiper .next',
            prevEl: '.main-vi-swiper .prev',
        },
    });
});

// copy
$(document).on('click', '.copy-button', function (e) {
    e.preventDefault();
    const dataType = $(this).attr('data-type'); // 'quick-box01', 'quick-box02', 'main-vi-swiper', or 'header-inner'

    // html
    const $clone = $('.' + dataType).clone();
    const htmlContent = $clone[0].outerHTML;

    // css
    $.get('css/style.css', function (cssContent) {
        const lines = cssContent.split('\n');
        let cssLines = [];
        let inSection = false;

        if (dataType === 'quick-box01') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('/* quick-box01 */')) {
                    inSection = true;
                }
                if (lines[i].includes('/* quick-box02 */')) {
                    inSection = false;
                }
                if (inSection) {
                    cssLines.push(lines[i]);
                }
            }
        } else if (dataType === 'quick-box02') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('/* quick-box02 */')) {
                    inSection = true;
                }
                if (lines[i].includes('/* main */')) {
                    inSection = false;
                }
                if (inSection) {
                    cssLines.push(lines[i]);
                }
            }
        } else if (dataType === 'main-vi-swiper') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('/* visual */')) {
                    inSection = true;
                }
                if (lines[i].includes('/* quick-box01 */')) {
                    inSection = false;
                }
                if (inSection) {
                    cssLines.push(lines[i]);
                }
            }
        } else if (dataType === 'header-inner') {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes('/* header */')) {
                    inSection = true;
                }
                if (lines[i].includes('/* visual */')) {
                    inSection = false;
                }
                if (inSection) {
                    cssLines.push(lines[i]);
                }
            }
        }

        const cssContentFiltered = cssLines.join('\n').trim();

        // js
        let jsContent = '';
        if (dataType === 'quick-box02') {
            jsContent = `$(function () {
                $('.scroll-top').on('click', function () {
                    $('html, body').animate({
                        scrollTop: 0
                    }, 500);
                });
            });`;
        } else if (dataType === 'main-vi-swiper') {
            jsContent = `$(function () {
                const swiper = new Swiper('.main-vi-swiper', {
                    loop: true,
                    watchOverflow: true,
                    speed: 1000,
                    effect: 'fade',
                    autoplay: {
                        delay: 5000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: '.main-vi-swiper .pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.main-vi-swiper .next',
                        prevEl: '.main-vi-swiper .prev',
                    },
                });
            });`;
        } else if (dataType === 'header-inner') {
            jsContent = `var App = App || {};

$(document).ready(function () {
    App.MainGnb.init();

    // kích thước màn hình ở logo
    var $logoSpan = $('.logo a span');
    if ($logoSpan.length > 0) {
        var baseText = $logoSpan.text().replace(/\\s*\\(\\d+\\)$/, '');
        function updateLogoSize() {
            $logoSpan.text(baseText + ' (' + window.innerWidth + ')');
        }
        updateLogoSize();
        $(window).on('resize', updateLogoSize);
    }
});

// check hover và touch
var isHoverGnb = false;
var isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia("(pointer: coarse)").matches;

// body.header-action
function updateHeaderAction() {
    var hasActiveAction = $('body').hasClass('gnb-open') ||
        $('body').hasClass('search-open') ||
        $('body').hasClass('lang-open') ||
        $('body').hasClass('mmenu-open') ||
        $('body').hasClass('popup-open');

    if (hasActiveAction) {
        $('body').addClass('header-action');
    } else {
        $('body').removeClass('header-action');
    }
}

// clear util
function closeAllExcept(activeType) {
    if (activeType !== 'gnb') {
        $('body').removeClass('gnb-open');
        $('.depth01 > li').removeClass('on');
        isHoverGnb = false;
    }
    if (activeType !== 'search') $('body').removeClass('search-open');
    if (activeType !== 'lang') $('body').removeClass('lang-open');
    if (activeType !== 'mmenu') $('body').removeClass('mmenu-open');
    if (activeType !== 'popup') $('body').removeClass('popup-open');
}

// gnb
App.MainGnb = function () {
    var self;
    return {
        init: function () {
            self = this;

            // chiều cao mặc định cho gnb bg
            $('.gnb-bg').css({ height: 'auto' });
            if ($('.sub-mn-box .depth02 > li').find('a').hasClass('active')) {
                $('.sub-mn-box .depth02 > li a.active').parents('li').addClass('active');
            }
            $('.depth01 > li > a').on('mouseenter focusin', self.onMouseOver);
            $('.sub-mn-box .depth02 > li:last-of-type > a').on('focusout', self.onMouseLeave);
            $('.header-inner').on('mouseleave', self.onMouseLeave);

            // tính toán kích thước cố định ban đầu để tránh lặp lại trên mỗi sự kiện resize (gây giật lag)
            var GNB_BASE_WIDTH = 170;
            var $gnbBox = $(".header-inner .gnb-box");
            var $depth01 = $gnbBox.find(".depth01");
            var $gnbLis = $depth01.find("> li");
            var $subBoxes = $('.sub-mn-box');
            var liCount = $gnbLis.length;
            var boxWidth = GNB_BASE_WIDTH * liCount;

            var logoWidth = $(".header-inner .logo").outerWidth(true) || 0;
            var utilWidth = $(".header-inner .util-wrap").outerWidth(true) || 0;
            var requiredWidth = logoWidth + boxWidth + utilWidth + 40;

            function depth02Set() {
                var headerWidth = $(".header-inner").width();
                var shouldBeCustom = (window.innerWidth < 1400) || (headerWidth < requiredWidth);

                if (window.innerWidth >= 1024) {
                    if (window.innerWidth >= 1400) {
                        if (shouldBeCustom) {
                            if (!$gnbBox.hasClass("gnb-custom")) {
                                $gnbBox.addClass("gnb-custom");
                                $depth01.css({ 'max-width': '' });
                                $gnbLis.css({ 'width': '' });
                            }
                        } else {
                            if ($gnbBox.hasClass("gnb-custom") || !$depth01[0].style.maxWidth) {
                                $gnbBox.removeClass("gnb-custom");
                                $depth01.css({ 'max-width': boxWidth + 'px' });
                                $gnbLis.css({ 'width': GNB_BASE_WIDTH + 'px' });
                            }
                        }
                    } else {
                        if ($gnbBox.hasClass("gnb-custom") || $depth01[0].style.maxWidth) {
                            $gnbBox.removeClass("gnb-custom");
                            $depth01.css({ 'max-width': '' });
                            $gnbLis.css({ 'width': '' });
                        }
                    }
                } else {
                    if ($gnbBox.hasClass("gnb-custom") || $depth01[0].style.maxWidth || ($subBoxes.length && $subBoxes[0].style.width)) {
                        $gnbBox.removeClass("gnb-custom");
                        $depth01.css({ 'max-width': '' });
                        $gnbLis.css({ 'width': '' });
                        $subBoxes.css({ 'width': '', 'left': '' });
                    }
                    return;
                }

                // căn chỉnh chiều rộng và vị trí cho sub-mn-box
                $gnbLis.each(function () {
                    var $li = $(this);
                    var liWidth = $li.outerWidth();
                    var leftPos = $li.position().left;

                    $li.find('.sub-mn-box').css({
                        'width': liWidth + 'px',
                        'left': leftPos + 'px'
                    });
                });
            }

            // độ trễ hỗ trợ chuyển ngữ
            function depth02SetDelay() {
                setTimeout(function () {
                    depth02Set();
                    setTimeout(function () {
                        if (isHoverGnb) {
                            $('.depth01 > li.on > a').trigger('mouseenter');
                        }
                    }, 500);
                }, 500);
            }

            // chạy lần đầu
            depth02Set();

            // cập nhật khi thay đổi kích thước
            $(window).on("load resize", depth02Set);

            // theo dõi thay đổi ngôn ngữ
            var htmlLang = $('html').attr('lang');
            if (htmlLang) {
                depth02SetDelay();
            }
            var htmlLangObserver = new MutationObserver(function () {
                depth02SetDelay();
            });
            htmlLangObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['lang']
            });

            // cập nhật lại khi thay đổi kích thước lúc đang mở menu
            $(window).on('resize', function () {
                if (isHoverGnb) {
                    $('.depth01 > li.on > a').trigger('mouseenter');
                    setTimeout(function () {
                        if (isHoverGnb) {
                            $('.depth01 > li.on > a').trigger('mouseenter');
                        }
                    }, 500);
                }
            });
        },

        // hover
        onMouseOver: function () {
            isHoverGnb = true;
            var subMnBox = $(this).next('.sub-mn-box');

            // clear util
            closeAllExcept('gnb');

            // height gnb-bg
            var $allSub = $('.sub-mn-box');
            $allSub.css({ height: 'auto' });
            var maxHeight = 0;
            $allSub.each(function () {
                maxHeight = Math.max(maxHeight, $(this).outerHeight());
            });
            $(".sub-mn-box").css({ height: maxHeight + "px" });
            var bgHeight = maxHeight;
            // Khi gnb-box rớt xuống (tablet hoặc gnb-custom) thì cộng thêm 50px vào chiều cao nền
            if (window.innerWidth < 1400 || $('.gnb-box').hasClass('gnb-custom')) {
                bgHeight += 50;
            }
            $('.gnb-bg').css({ height: bgHeight + 'px' });

            $('.depth01 > li').removeClass('on');
            $(this).parent('li').addClass('on');

            if (subMnBox.find('.depth02 > li').length > 0) {
                $('body').addClass('gnb-open');
            } else {
                $('body').removeClass('gnb-open');
            }
            updateHeaderAction();
        },

        // rê chuột ra ngoài
        onMouseLeave: function () {
            isHoverGnb = false;
            // độ trễ để tăng trải nghiệm người dùng
            setTimeout(function () {
                if (!isHoverGnb) {
                    $('body').removeClass('gnb-open');
                    $('.gnb-bg').css({ height: '' });
                    $('.sub-mn-box').css({ height: '' });
                    $('.depth01 > li').removeClass('on');
                    updateHeaderAction();
                }
            }, 100);
        }
    };
}();

// scroll
$(function () {
    // sự kiện cuộn trang
    $(window).on('scroll', function () {
        $('header').toggleClass('fixed', $(window).scrollTop() > 0);
    }).trigger('scroll');
});
// cuộn lên đầu trang
$('.scroll-top').on('click', function () {
    $('html, body').animate({
        scrollTop: 0
    }, 500);
});

// popup
$(function () {
    // nút mở popup
    $('.openpopup > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('popup-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('popup');
            $('body').addClass('popup-open');
            const paddingTopVal = $('.header-inner').outerHeight() + 20;
            $('.popup-box').css('padding-top', paddingTopVal + 'px');
        }
        updateHeaderAction();
    });
    $('.popup-close').on('click', function (e) {
        e.preventDefault();
        closeAllExcept(null);
        updateHeaderAction();
    });
});

// search
$(function () {
    // nút mở tìm kiếm
    $('.opensearch > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('search-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('search');
            $('body').addClass('search-open');
        }
        updateHeaderAction();
    });
    $('.search-close').on('click', function (e) {
        e.preventDefault();
        closeAllExcept(null);
        updateHeaderAction();
    });
});

// lang
$(function () {
    // nút mở ngôn ngữ
    $('.openlang > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('lang-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('lang');
            $('body').addClass('lang-open');

            const $parent = $('.openlang');
            const headerHeight = $('.header-inner').outerHeight();
            const openlangHeight = $parent.outerHeight();
            const offset = (headerHeight - openlangHeight) / 2;
            $parent.find('> ul').css('top', 'calc(100% + ' + offset + 'px)');
        }
        updateHeaderAction();
    });
    $('.header-inner').on('mouseleave', function () {
        if ($('body').hasClass('lang-open')) {
            closeAllExcept(null);
            updateHeaderAction();
        }
    });
});

// gnb mobile
$(function () {
    // nút mở menu di động
    $('.openmenu > a').on('click', function (e) {
        e.preventDefault();
        if ($('body').hasClass('mmenu-open')) {
            closeAllExcept(null);
        } else {
            closeAllExcept('mmenu');
            $('body').addClass('mmenu-open');
        }
        updateHeaderAction();
    });
    $('.gnb-mobile-inner .depth01 > li > a').on('click', function (e) {
        e.preventDefault();
        $('.gnb-mobile-inner .depth01 > li').removeClass('active');
        $(this).parent('li').addClass('active');
    });
});`;
        }

        // string of copy
        let clipboardContent = '';
        clipboardContent += `/* HTML */\n${htmlContent}\n\n`;
        clipboardContent += `/* CSS */\n${cssContentFiltered}`;
        if (jsContent) {
            clipboardContent += `\n\n/* JS */\n${jsContent}`;
        }

        // copy to clipboard
        navigator.clipboard.writeText(clipboardContent).then(function () {
            alert('Copied [' + dataType + '].');
        }).catch(function (err) {
            console.error('Error copying: ', err);
        });
    }).fail(function () {
        console.error('Could not read css/style.css');
    });
});
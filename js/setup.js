$(function () {
    function html(type, itemQty, textQty, useLink) {
        let htmlLines = [];
        if (type === 'list05') {
            const qty = itemQty || 3;
            htmlLines.push('<ul class="list05">');
            for (let i = 1; i <= qty; i++) {
                const activeClass = (i === 1) ? ' class="active"' : '';
                htmlLines.push('    <li>');
                htmlLines.push('        <a href="#a" title="Tab ' + i + '"' + activeClass + '>Tab ' + i + '</a>');
                htmlLines.push('        <div class="con">');
                if (i === 1) {
                    htmlLines.push('            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>');
                } else {
                    htmlLines.push('            <p>Tab content ' + i + '</p>');
                }
                htmlLines.push('        </div>');
                htmlLines.push('    </li>');
            }
            htmlLines.push('</ul>');
            return htmlLines.join('\n');
        }
        if (type === 'list06') {
            const qty = itemQty || 3;
            htmlLines.push('<div class="list06">');
            htmlLines.push('    <p class="list06-button"><span class="list06-name">Tab 1</span></p>');
            htmlLines.push('    <ul class="list06-tit">');
            for (let i = 1; i <= qty; i++) {
                const activeClass = (i === 1) ? ' class="active"' : '';
                htmlLines.push('        <li>');
                htmlLines.push('            <a href="#a" title="Tab ' + i + '"' + activeClass + '>Tab ' + i + '</a>');
                htmlLines.push('        </li>');
            }
            htmlLines.push('    </ul>');
            htmlLines.push('    <div class="list06-con">');
            for (let i = 1; i <= qty; i++) {
                const activeClass = (i === 1) ? ' active' : '';
                htmlLines.push('        <div class="con' + activeClass + '">');
                if (i === 1) {
                    htmlLines.push('            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>');
                } else {
                    htmlLines.push('            <p>Tab content ' + i + '</p>');
                }
                htmlLines.push('        </div>');
            }
            htmlLines.push('    </div>');
            htmlLines.push('</div>');
            return htmlLines.join('\n');
        }
        if (type === 'list07') {
            const qty = itemQty || 5;
            htmlLines.push('<div class="list07-swiper swiper">');
            htmlLines.push('    <div class="swiper-wrapper">');
            for (let i = 1; i <= qty; i++) {
                htmlLines.push('        <div class="swiper-slide">');
                htmlLines.push('            <a href="#a">');
                htmlLines.push('                <div class="img"><img src="img/img.jpg" alt="" /></div>');
                htmlLines.push('                <div class="txt">');
                for (let t = 1; t <= textQty; t++) {
                    const numStr = String(t).padStart(2, '0');
                    htmlLines.push('                    <p class="txt' + numStr + '">Text' + numStr + '</p>');
                }
                htmlLines.push('                </div>');
                htmlLines.push('            </a>');
                htmlLines.push('        </div>');
            }
            htmlLines.push('    </div>');
            htmlLines.push('    <a href="#a" class="navigation prev">이전</a>');
            htmlLines.push('    <a href="#a" class="navigation next">다음</a>');
            htmlLines.push('    <div class="list07-pagination pagination"></div>');
            htmlLines.push('</div>');
            return htmlLines.join('\n');
        }
        if (type === 'list00') {
            const isLink = useLink;
            htmlLines.push('<ul class="list00">');
            for (let i = 1; i <= itemQty; i++) {
                htmlLines.push('    <li>');
                if (isLink) {
                    htmlLines.push('        <a href="#a" title="Text01">');
                    htmlLines.push('            <div class="txt">');
                    for (let t = 1; t <= textQty; t++) {
                        const numStr = String(t).padStart(2, '0');
                        htmlLines.push('                <p class="txt' + numStr + '">Text' + numStr + '</p>');
                    }
                    htmlLines.push('            </div>');
                    htmlLines.push('        </a>');
                } else {
                    htmlLines.push('        <div class="txt">');
                    for (let t = 1; t <= textQty; t++) {
                        const numStr = String(t).padStart(2, '0');
                        htmlLines.push('            <p class="txt' + numStr + '">Text' + numStr + '</p>');
                    }
                    htmlLines.push('        </div>');
                }
                htmlLines.push('    </li>');
            }
            htmlLines.push('</ul>');
            return htmlLines.join('\n');
        }
        if (type === 'list01' || type === 'list02' || type === 'list03' || type === 'list04') {
            const imgSrc = (type === 'list04') ? 'img/img.jpg' : '/img/ico-img.png';
            const isLink = (type === 'list04') ? true : useLink;
            const imgAlt = (type === 'list04') ? '' : 'Text01';
            htmlLines.push('<ul class="' + type + '">');
            for (let i = 1; i <= itemQty; i++) {
                htmlLines.push('    <li>');
                if (isLink) {
                    const titleAttr = (type === 'list04') ? '' : ' title="Text01"';
                    htmlLines.push('        <a href="#a"' + titleAttr + '>');
                    htmlLines.push('            <div class="img"><img src="' + imgSrc + '" alt="' + imgAlt + '" /></div>');
                    htmlLines.push('            <div class="txt">');
                    for (let t = 1; t <= textQty; t++) {
                        const numStr = String(t).padStart(2, '0');
                        htmlLines.push('                <p class="txt' + numStr + '">Text' + numStr + '</p>');
                    }
                    htmlLines.push('            </div>');
                    htmlLines.push('        </a>');
                } else {
                    htmlLines.push('        <div class="img"><img src="' + imgSrc + '" alt="' + imgAlt + '" /></div>');
                    htmlLines.push('        <div class="txt">');
                    for (let t = 1; t <= textQty; t++) {
                        const numStr = String(t).padStart(2, '0');
                        htmlLines.push('            <p class="txt' + numStr + '">Text' + numStr + '</p>');
                    }
                    htmlLines.push('        </div>');
                }
                htmlLines.push('    </li>');
            }
            htmlLines.push('</ul>');
        }
        return htmlLines.join('\n');
    }

    function css(type, textQty, useLink, cssContent) {
        const isLink = (type === 'list04') ? true : useLink;
        const parts = cssContent.split('/* ' + type + ' */');
        if (parts.length < 2) return '';
        let section = parts[1].split('/* ')[0].trim();

        let mediaQuery = '';
        const mediaIdx = section.indexOf('@media');
        if (mediaIdx !== -1) {
            let braceCount = 0;
            let startIdx = section.indexOf('{', mediaIdx);
            if (startIdx !== -1) {
                braceCount = 1;
                let i = startIdx + 1;
                for (; i < section.length; i++) {
                    if (section[i] === '{') braceCount++;
                    else if (section[i] === '}') braceCount--;
                    if (braceCount === 0) {
                        break;
                    }
                }
                mediaQuery = section.substring(mediaIdx, i + 1);
                section = section.replace(mediaQuery, '').trim();
            }
        }

        const lines = section.split('\n').map(l => l.trim()).filter(l => l.length > 0);

        const parsedLines = lines.map(line => {
            const m = line.match(/^([^{]+)\{([^}]*)\}/);
            return m ? { selector: m[1].trim(), props: m[2].trim() } : null;
        }).filter(x => x !== null);

        let outputLines = [];

        if (type === 'list05' || type === 'list06' || type === 'list07') {
            parsedLines.forEach(rule => {
                const isTextRule = rule.selector.match(/\.txt\d+$/);
                if (!isTextRule) {
                    outputLines.push(rule.selector + '{' + rule.props + '}');
                }
            });

            if (type === 'list07') {
                for (let t = 1; t <= textQty; t++) {
                    const numStr = String(t).padStart(2, '0');
                    const txtChildRule = parsedLines.find(x => x.selector.endsWith('.txt' + numStr));
                    const txtChildProps = txtChildRule ? txtChildRule.props : '';
                    outputLines.push('.list07-swiper > .swiper-wrapper > .swiper-slide > a > .txt > .txt' + numStr + '{' + txtChildProps + '}');
                }
            }

            if (mediaQuery) {
                outputLines.push(mediaQuery);
            }

            return outputLines.join('\n');
        }

        const rootRule = parsedLines.find(x => x.selector === '.' + type);
        const rootProps = rootRule ? rootRule.props : '';

        const widthRule = parsedLines.find(x => x.selector.includes('li') && x.props.includes('width'));
        const widthProps = widthRule ? widthRule.props : '';

        const styleRule = parsedLines.find(x => (x.selector.endsWith('li') || x.selector.endsWith('> a')) && !x.props.includes('width'));
        const styleProps = styleRule ? styleRule.props : '';

        const imgContainerRule = parsedLines.find(x => x.selector.includes('.img') && !x.selector.endsWith('img') && !x.selector.includes(':hover'));
        const imgContainerProps = imgContainerRule ? imgContainerRule.props : '';

        const imgRule = parsedLines.find(x => x.selector.endsWith('img') && !x.selector.includes(':hover'));
        const imgProps = imgRule ? imgRule.props : '';

        const txtRule = parsedLines.find(x => x.selector.includes('.txt') && !x.selector.match(/\.txt\d/));
        const txtProps = txtRule ? txtRule.props : '';

        outputLines.push('.' + type + '{' + rootProps + '}');

        if (isLink) {
            outputLines.push('.' + type + ' > li{' + widthProps + '}');
            let displayStyle = '';
            if (!styleProps.includes('display:')) {
                displayStyle = (type === 'list02' || type === 'list03') ? 'display: flex;' : 'display: block;';
            }
            outputLines.push('.' + type + ' > li > a{' + displayStyle + styleProps + '}');
            if (type !== 'list00') {
                outputLines.push('.' + type + ' > li > a > .img{' + imgContainerProps + '}');
                outputLines.push('.' + type + ' > li > a > .img > img{' + imgProps + '}');
            }
            outputLines.push('.' + type + ' > li > a > .txt{' + txtProps + '}');

            const hoverRule = parsedLines.find(x => x.selector.includes(':hover'));
            if (hoverRule && type !== 'list00') {
                outputLines.push('.' + type + ' > li > a:hover > .img > img{' + hoverRule.props + '}');
            }

            for (let t = 1; t <= textQty; t++) {
                const numStr = String(t).padStart(2, '0');
                const txtChildRule = parsedLines.find(x => x.selector.includes('.txt' + numStr));
                const txtChildProps = txtChildRule ? txtChildRule.props : '';
                outputLines.push('.' + type + ' > li > a > .txt > .txt' + numStr + '{' + txtChildProps + '}');
            }
        } else {
            outputLines.push('.' + type + ' > li{' + widthProps + '}');
            outputLines.push('.' + type + ' > li{' + styleProps + '}');
            if (type !== 'list00') {
                outputLines.push('.' + type + ' > li > .img{' + imgContainerProps + '}');
                outputLines.push('.' + type + ' > li > .img > img{' + imgProps + '}');
            }
            outputLines.push('.' + type + ' > li > .txt{' + txtProps + '}');

            const hoverRule = parsedLines.find(x => x.selector.includes(':hover'));
            if (hoverRule && type !== 'list00') {
                outputLines.push('.' + type + ' > li:hover > .img > img{' + hoverRule.props + '}');
            }

            for (let t = 1; t <= textQty; t++) {
                const numStr = String(t).padStart(2, '0');
                const txtChildRule = parsedLines.find(x => x.selector.includes('.txt' + numStr));
                const txtChildProps = txtChildRule ? txtChildRule.props : '';
                outputLines.push('.' + type + ' > li > .txt > .txt' + numStr + '{' + txtChildProps + '}');
            }
        }

        if (mediaQuery) {
            if (type === 'list05' || type === 'list06' || type === 'list07') {
                outputLines.push(mediaQuery);
            } else {
                const mediaWidthMatch = mediaQuery.match(/\{([^}]*)\}/g);
                if (mediaWidthMatch && mediaWidthMatch.length >= 2) {
                    const innerProps = mediaWidthMatch[1].replace(/[\{\}]/g, '').trim();
                    outputLines.push('@media(max-width:768px){.' + type + ' > li{' + innerProps + '}}');
                } else {
                    outputLines.push('@media(max-width:768px){.' + type + ' > li{width: 100%;}}');
                }
            }
        }

        return outputLines.join('\n');
    }

    $(document).on('click', '.btn_copy_html', function (e) {
        e.preventDefault();
        const $item = $(this).closest('.main-item');
        const dataType = $item.attr('data-type');
        let defaultQty = 1;
        if (dataType === 'list05' || dataType === 'list06') {
            defaultQty = 3;
        } else if (dataType === 'list07') {
            defaultQty = 1;
        }
        const itemQty = parseInt($item.find('.so_item').val()) || defaultQty;
        const textQty = parseInt($item.find('.so_text').val()) || 2;
        const useLink = $item.find('.use_link_chk').is(':checked');
        const generatedHTML = html(dataType, itemQty, textQty, useLink);
        navigator.clipboard.writeText(generatedHTML).then(function () {
            alert('Copied HTML [' + dataType + '].');
        }).catch(function (err) {
            console.error('Error copying HTML: ', err);
        });
    });

    $(document).on('click', '.btn_copy_css', function (e) {
        e.preventDefault();
        const $item = $(this).closest('.main-item');
        const dataType = $item.attr('data-type');
        const textQty = parseInt($item.find('.so_text').val()) || 2;
        const useLink = $item.find('.use_link_chk').is(':checked');

        $.get('css/setup.css', function (cssContent) {
            const generatedCSS = css(dataType, textQty, useLink, cssContent);
            navigator.clipboard.writeText(generatedCSS).then(function () {
                alert('Copied CSS [' + dataType + '].');
            }).catch(function (err) {
                console.error('Error copying CSS: ', err);
            });
        }).fail(function () {
            console.error('Could not read css/setup.css');
        });
    });

    // list05
    $(document).on('click', '.btn_copy_js', function (e) {
        e.preventDefault();
        const $item = $(this).closest('.main-item');
        const dataType = $item.attr('data-type');

        if (dataType === 'list05') {
            const jsCode = `$(function () {
                function adjustTabHeight($list) {
                    const $activeCon = $list.find('li a.active').next('.con');
                    if ($activeCon.length) {
                        const conHeight = $activeCon.outerHeight();
                        $list.css('padding-bottom', conHeight + 'px');
                    } else {
                        $list.css('padding-bottom', '0px');
                    }
                }

                $(document).on('click', '.list05 li a', function (e) {
                    e.preventDefault();
                    const $list = $(this).closest('.list05');
                    $list.find('li a').removeClass('active');
                    $(this).addClass('active');
                    adjustTabHeight($list);
                });

                $(window).on('load resize', function () {
                    $('.list05').each(function () {
                        adjustTabHeight($(this));
                    });
                });
            });`;
            navigator.clipboard.writeText(jsCode).then(function () {
                alert('Copied JS [' + dataType + '].');
            }).catch(function (err) {
                console.error('Error copying JS: ', err);
            });
        } else if (dataType === 'list06') {
            const jsCode = `$(function () {
                // Toggle mobile menu dropdown
                $(document).on('click', '.list06-button', function (e) {
                    e.stopPropagation();
                    $(this).closest('.list06').toggleClass('list06-open');
                });

                // Close menu when clicking outside
                $(document).on('click', function () {
                    $('.list06').removeClass('list06-open');
                });

                // Click tab handler
                $(document).on('click', '.list06-tit li a', function (e) {
                    e.preventDefault();
                    const $list = $(this).closest('.list06');
                    $list.find('.list06-tit li a').removeClass('active');
                    $(this).addClass('active');
                    
                    // Update button text
                    const txt = $(this).text();
                    $list.find('.list06-name').text(txt);
                    
                    $list.removeClass('list06-open');

                    const idx = $(this).parent().index();
                    const $cons = $list.find('.list06-con .con');
                    $cons.removeClass('active').hide();
                    $cons.eq(idx).addClass('active').fadeIn(300);
                });
            });`;
            navigator.clipboard.writeText(jsCode).then(function () {
                alert('Copied JS [' + dataType + '].');
            }).catch(function (err) {
                console.error('Error copying JS: ', err);
            });
        } else if (dataType === 'list07') {
            const jsCode = `$(function () {
                var list07Swiper = new Swiper('.list07-swiper', {
                    loop: true,
                    watchOverflow: true,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    navigation: {
                        nextEl: '.list07-swiper .navigation.next',
                        prevEl: '.list07-swiper .navigation.prev',
                    },
                    pagination: {
                        el: '.list07-swiper .pagination',
                        clickable: true,
                    },
                });
            });`;
            navigator.clipboard.writeText(jsCode).then(function () {
                alert('Copied JS [' + dataType + '].');
            }).catch(function (err) {
                console.error('Error copying JS: ', err);
            });
        } else {
            alert('Error copying JS.');
        }
    });

    // list05
    function adjustTabHeight($list) {
        const $activeCon = $list.find('li a.active').next('.con');
        if ($activeCon.length) {
            const conHeight = $activeCon.outerHeight();
            $list.css('padding-bottom', conHeight + 'px');
        } else {
            $list.css('padding-bottom', '0px');
        }
    }

    $(document).on('click', '.list05 li a', function (e) {
        e.preventDefault();
        const $list = $(this).closest('.list05');
        $list.find('li a').removeClass('active');
        $(this).addClass('active');
        adjustTabHeight($list);
    });

    $(window).on('load resize', function () {
        $('.list05').each(function () {
            adjustTabHeight($(this));
        });
    });

    // list06
    // Toggle mobile menu dropdown
    $(document).on('click', '.list06-button', function (e) {
        e.stopPropagation();
        $(this).closest('.list06').toggleClass('list06-open');
    });

    // Close menu when clicking outside
    $(document).on('click', function () {
        $('.list06').removeClass('list06-open');
    });

    // Click tab handler
    $(document).on('click', '.list06-tit li a', function (e) {
        e.preventDefault();
        const $list = $(this).closest('.list06');
        $list.find('.list06-tit li a').removeClass('active');
        $(this).addClass('active');

        // Update button text
        const txt = $(this).text();
        $list.find('.list06-name').text(txt);

        $list.removeClass('list06-open');

        const idx = $(this).parent().index();
        const $cons = $list.find('.list06-con .con');
        $cons.removeClass('active').hide();
        $cons.eq(idx).addClass('active').fadeIn(300);
    });

    $(window).on('load', function () {
        $('.list06').each(function () {
            const $activeLink = $(this).find('.list06-tit li a.active');
            const activeIndex = $activeLink.parent().index();
            $(this).find('.list06-con .con').removeClass('active').eq(activeIndex >= 0 ? activeIndex : 0).addClass('active');

            // Set initial name of active tab
            if ($activeLink.length) {
                $(this).find('.list06-name').text($activeLink.text());
            }
        });
    });

    $(window).on('load', function () {
        if (typeof Swiper !== 'undefined') {
            var list07Swiper = new Swiper('.list07-swiper', {
                loop: true,
                watchOverflow: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },
                slidesPerView: 'auto',
                spaceBetween: 20,
                navigation: {
                    nextEl: '.list07-swiper .next',
                    prevEl: '.list07-swiper .prev',
                },
                pagination: {
                    el: '.list07-swiper .pagination',
                    clickable: true,
                },
            });
        }
    });
});
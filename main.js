// Generated by CoffeeScript 1.6.3
/*

Regex Builder

Sep 2013 ys
*/


(function() {
  var $exp, $exp_dsp, $flags, $match, $txt, $window, anchor, anchor_c, clean_past_data, create_match_list, delay_id, delay_run_match, entityMap, escape_exp, escape_html, init, init_affix, init_bind, init_hide_switches, init_key_events, input_clear, is_paste, load_data, match_elem_show_tip, match_visual, on_window_resize, override_return, run_match, save_data, select_all_text, syntax_highlight;

  $window = $(window);

  $exp = $('#exp');

  $exp_dsp = $('#exp_dsp');

  $txt = $('#txt');

  $match = $('#match');

  $flags = $('#flags');

  is_paste = false;

  init = function() {
    load_data();
    $window.on('beforeunload', save_data);
    on_window_resize();
    $window.resize(on_window_resize);
    run_match();
    init_key_events();
    init_bind();
    $('[title]').tooltip();
    setTimeout(function() {
      return $exp.select();
    }, 500);
    init_affix();
    return init_hide_switches();
  };

  init_key_events = function() {
    $txt.keydown(override_return);
    $exp.keydown(override_return);
    $txt.keyup(delay_run_match);
    $exp.keyup(delay_run_match);
    $txt.on('paste', function() {
      return is_paste = true;
    });
    $flags.keyup(delay_run_match);
    return $exp_dsp.click(select_all_text);
  };

  init_affix = function() {
    var $af, $ap;
    $af = $('.affix');
    $ap = $('.affix-placeholder');
    $ap.height($af.outerHeight());
    return $window.scroll(function() {
      return $ap.height($af.outerHeight());
    });
  };

  init_bind = function() {
    return $('[bind]').each(function() {
      var $this;
      $this = $(this);
      window[$this.attr('bind')] = $this.val();
      return $this.change(function() {
        return window[$this.attr('bind')] = $this.val();
      });
    });
  };

  init_hide_switches = function() {
    return $('.switch_hide').click(function() {
      var $tar, $this;
      $this = $(this);
      $tar = $('#' + $this.attr('target'));
      if ($this.prop('checked')) {
        return $tar.hide();
      } else {
        return $tar.show();
      }
    });
  };

  on_window_resize = function() {
    if ($window.width() < 768) {
      $('.col-xs-8').removeClass('col-xs-8').addClass('col-xs-12');
      return $('.col-xs-2').removeClass('col-xs-2').addClass('col-xs-6');
    } else {
      $('.col-xs-12').removeClass('col-xs-12').addClass('col-xs-8');
      return $('.col-xs-6').removeClass('col-xs-6').addClass('col-xs-2');
    }
  };

  delay_id = null;

  delay_run_match = function() {
    var elem;
    elem = this;
    clearTimeout(delay_id);
    return delay_id = setTimeout(function() {
      var saved_sel;
      if (elem.id === 'txt' || elem.id === 'exp') {
        saved_sel = saveSelection(elem);
      }
      run_match();
      if (elem.id === 'txt' || elem.id === 'exp') {
        return restoreSelection(elem, saved_sel);
      }
    }, window.exe_delay);
  };

  anchor_c = 0;

  anchor = function(index) {
    var c;
    c = anchor_c++ % 4;
    switch (c) {
      case 0:
        return "<i index='" + index + "'>";
      case 1:
        return "</i>";
      case 2:
        return "<b index='" + index + "'>";
      case 3:
        return "</b>";
    }
  };

  entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
  };

  escape_exp = /[&<>]/g;

  escape_html = function(str) {
    return String(str).replace(escape_exp, function(s) {
      return entityMap[s];
    });
  };

  select_all_text = function() {
    var range;
    if (document.selection) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      return range.select();
    } else if (window.getSelection) {
      range = document.createRange();
      range.selectNode(this);
      return window.getSelection().addRange(range);
    }
  };

  override_return = function(e) {
    if (e.keyCode === 13) {
      document.execCommand('insertHTML', false, '\n');
      return false;
    }
  };

  run_match = function() {
    var count, e, exp, flags, i, is_match_shown, is_txt_shown, j, k, list, m, ms, r, txt, visual;
    $txt.find('div').remove();
    exp = $exp.text();
    flags = $flags.val();
    if (is_paste) {
      $txt.html(clean_past_data($txt.html()));
      is_paste = false;
    }
    txt = $txt.text();
    if (!exp) {
      input_clear();
      return;
    }
    try {
      r = new RegExp(exp, flags);
    } catch (_error) {
      e = _error;
      input_clear(e);
      return;
    }
    syntax_highlight(exp, flags);
    ms = [];
    is_txt_shown = $txt.is(":visible");
    is_match_shown = $match.is(":visible");
    visual = '';
    count = 0;
    if (r.global) {
      i = 0;
      while ((m = r.exec(txt)) !== null) {
        ms.push(m[0]);
        k = r.lastIndex;
        j = k - m[0].length;
        if (is_txt_shown) {
          visual += match_visual(txt, i, j, k, count++);
        }
        i = k;
        if (m[0].length === 0) {
          r.lastIndex++;
        }
      }
    } else {
      txt.replace(r, function(m) {
        var _i, _ref;
        for (i = _i = 0, _ref = arguments.length - 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          ms.push(arguments[i]);
        }
        i = 0;
        j = arguments[arguments.length - 2];
        k = j + m.length;
        if (is_txt_shown) {
          visual += match_visual(txt, i, j, k, count++);
        }
        return i = k;
      });
    }
    if (is_txt_shown) {
      visual += escape_html(txt.slice(i));
      $txt.empty().html(visual);
      $txt.find('[index]').hover(match_elem_show_tip, function() {
        return $(this).popover('destroy');
      });
    }
    if (is_match_shown) {
      list = create_match_list(ms);
      return $match.html(list);
    }
  };

  match_visual = function(str, i, j, k, c) {
    return escape_html(str.slice(i, j)) + anchor(c) + escape_html(str.slice(j, k)) + anchor();
  };

  input_clear = function(err) {
    var msg;
    if (err) {
      msg = err.message.replace('Invalid regular expression: ', '');
      $exp_dsp.html("<span class='error'>" + msg + "</span>");
    } else {
      $exp_dsp.text('');
    }
    $match.text('');
    return $txt.text($txt.text());
  };

  clean_past_data = function(txt) {
    return txt.replace(/<br[^>]+?>/ig, '\n');
  };

  syntax_highlight = function(exp, flags) {
    var exp_escaped;
    exp_escaped = exp.replace(/\\\//g, '/').replace(/\//g, '\\/');
    $exp_dsp.text("/" + exp_escaped + "/" + flags);
    exp = RegexColorizer.colorizeText(exp);
    return $exp.html(exp);
  };

  create_match_list = function(m) {
    var es, i, list, _i, _len;
    list = '<ol start="0">';
    if (m) {
      for (_i = 0, _len = m.length; _i < _len; _i++) {
        i = m[_i];
        es = escape_html(i);
        list += "<li><span class='g'>" + es + "</span></li>";
      }
    }
    list += '</ol>';
    return list;
  };

  match_elem_show_tip = function() {
    var $this, index, m, reg;
    $this = $(this);
    index = $this.attr('index');
    reg = new RegExp($exp.text(), $flags.val().replace('g', ''));
    m = $this.text().match(reg);
    return $this.popover({
      html: true,
      title: 'Group: ' + index,
      content: create_match_list(m),
      placement: 'bottom'
    }).popover('show');
  };

  save_data = function(e) {
    $('[save]').each(function() {
      var $this, val;
      $this = $(this);
      $this.find('.popover').remove();
      val = $this[$this.attr('save')]();
      return localStorage.setItem($this.attr('id'), val);
    });
    return e.preventDefault();
  };

  load_data = function() {
    return $('[save]').each(function() {
      var $this, v;
      $this = $(this);
      v = localStorage.getItem($this.attr('id'));
      if (v !== null) {
        return $this[$this.attr('save')](v);
      }
    });
  };

  
if (window.getSelection && document.createRange) {
    saveSelection = function(containerEl) {
        var range = window.getSelection().getRangeAt(0);
        var preSelectionRange = range.cloneRange();
        preSelectionRange.selectNodeContents(containerEl);
        preSelectionRange.setEnd(range.startContainer, range.startOffset);
        var start = preSelectionRange.toString().length;

        return {
            start: start,
            end: start + range.toString().length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
    	if (!savedSel) return;
        var charIndex = 0, range = document.createRange();
        range.setStart(containerEl, 0);
        range.collapse(true);
        var nodeStack = [containerEl], node, foundStart = false, stop = false;

        while (!stop && (node = nodeStack.pop())) {
            if (node.nodeType == 3) {
                var nextCharIndex = charIndex + node.length;
                if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
                    range.setStart(node, savedSel.start - charIndex);
                    foundStart = true;
                }
                if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
                    range.setEnd(node, savedSel.end - charIndex);
                    stop = true;
                }
                charIndex = nextCharIndex;
            } else {
                var i = node.childNodes.length;
                while (i--) {
                    nodeStack.push(node.childNodes[i]);
                }
            }
        }

        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    }
} else if (document.selection && document.body.createTextRange) {
    saveSelection = function(containerEl) {
        var selectedTextRange = document.selection.createRange();
        var preSelectionTextRange = document.body.createTextRange();
        preSelectionTextRange.moveToElementText(containerEl);
        preSelectionTextRange.setEndPoint("EndToStart", selectedTextRange);
        var start = preSelectionTextRange.text.length;

        return {
            start: start,
            end: start + selectedTextRange.text.length
        }
    };

    restoreSelection = function(containerEl, savedSel) {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(containerEl);
        textRange.collapse(true);
        textRange.moveEnd("character", savedSel.end);
        textRange.moveStart("character", savedSel.start);
        textRange.select();
    };
}
;

  init();

}).call(this);

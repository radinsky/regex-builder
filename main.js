// Generated by CoffeeScript 1.6.3
var $cur_exp, $exp, $flag, $input, $match, $visual_pre, anchor, anchor_c, delay, delay_id, delay_run_match, entityMap, escape_exp, escape_html, init, run_match, select_all_text;

$exp = $('#exp');

$cur_exp = $('#cur_exp');

$input = $('#input');

$match = $('#match');

$visual_pre = $('#visual-pre');

$flag = $('#flag');

init = function() {
  $input.keyup(run_match);
  $exp.keyup(run_match);
  $flag.keyup(run_match);
  $('[save]').each(function() {
    var $this, v;
    $this = $(this);
    v = localStorage.getItem($this.attr('id'));
    if (v !== null) {
      return $this.val(v);
    }
  });
  delay_run_match();
  $cur_exp.click(select_all_text);
  $('[title]').tooltip();
  return $exp.select();
};

delay = $('#exe_delay').change(function() {
  return delay = $(this).val();
}).val();

$('.switch_hide').click(function() {
  var $tar, $this;
  $this = $(this);
  $tar = $('#' + $this.attr('target'));
  if ($this.prop('checked')) {
    return $tar.hide();
  } else {
    return $tar.show();
  }
});

delay_id = null;

run_match = function() {
  clearTimeout(delay_id);
  return delay_id = setTimeout(delay_run_match, delay);
};

anchor_c = 0;

anchor = function() {
  var c;
  c = anchor_c++ % 4;
  switch (c) {
    case 0:
      return '<i>';
    case 1:
      return '</i>';
    case 2:
      return '<b>';
    case 3:
      return '</b>';
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

select_all_text = function(containerid) {
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

delay_run_match = function() {
  var e, exp, flag, i, input, j, json, k, m, r, visual;
  exp = $exp.val();
  flag = $flag.val();
  input = $input.val();
  if (!exp) {
    $match.text('');
    $cur_exp.html('');
    return;
  }
  try {
    r = new RegExp(exp, flag);
  } catch (_error) {
    e = _error;
    $match.text(e);
    return;
  }
  $cur_exp.html(RegexColorizer.colorizeText(r.toString()));
  m = input.match(r);
  json = JSON.stringify(m, null, 1);
  $match.text(json);
  visual = '';
  i = 0;
  while ((m = r.exec(input)) !== null) {
    k = r.lastIndex;
    j = k - m[0].length;
    visual += escape_html(input.slice(i, j)) + anchor();
    visual += input.slice(j, k) + anchor();
    i = k;
    if (m[0].length === 0) {
      r.lastIndex++;
    }
    if (!r.global) {
      break;
    }
  }
  visual += escape_html(input.slice(i));
  return $visual_pre.html(visual);
};

window.onbeforeunload = function() {
  $('[save]').each(function() {
    var $this;
    $this = $(this);
    return localStorage.setItem($this.attr('id'), $this.val());
  });
  return null;
};

init();

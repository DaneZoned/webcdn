//LINE 540


// Alright let's do this
var q = function (parameter, context) {
  if (!(this instanceof q)) {
    return new q(parameter, context);
  }

  if (parameter instanceof q) {
    return parameter;
  }

  // Strings go CSS
  if (typeof parameter === 'string') {
    parameter = this.select(parameter, context);
  }
  if (parameter && parameter.nodeName) {
    parameter = [parameter];
  }

  // ARRAYS. ARRAYS EVERYWHERE!
  this.nodes = this.slice(parameter);
};

// length = nodes.length
q.prototype = {
  get length () {
    return this.nodes.length;
  }
};

// Initializing instance variables
q.prototype.nodes = [];

// Add class to nodes
q.prototype.addClass = function () {
  return this.eacharg(arguments, function (el, name) {
    el.classList.add(name);
  });
};


// Text to position
// PROTOTYPE -- 
q.prototype.adjacent = function (html, data, callback) {
  if (typeof data === 'number') {
    if (data === 0) {
      data = [];
    } else {
      data = new Array(data).join().split(',').map(Number.call, Number);
    }
  }

  // Loop through every node
  return this.each(function (node, j) {
    var fragment = document.createDocumentFragment();

    // Even blue pills get to ride once
    q(data || {}).map(function (el, i) {
      // Get data - callback - ??? - profit
      var part = (typeof html === 'function') ? html.call(this, el, i, node, j) : html;

      if (typeof part === 'string') {
        return this.generate(part);
      }

      return q(part);
    }).each(function (n) {
      this.isInPage(n)
        ? fragment.appendChild(q(n).clone().first())
        : fragment.appendChild(n);
    });

    callback.call(this, node, fragment);
  });
};

// Add sibling element
q.prototype.after = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.parentNode.insertBefore(fragment, node.nextSibling);
  });
};


// HTTP Request for sumbits 
// Still work to be done. Doesn't work properly
// FUCK YOU AJAX
q.prototype.ajax = function (done, before) {
  return this.handle('submit', function (e) {
    ajax(
      q(this).attr('action'),
      { body: q(this).serialize(), method: q(this).attr('method') },
      done && done.bind(this),
      before && before.bind(this)
    );
  });
};


// Add child element
q.prototype.append = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.appendChild(fragment);
  });
};

// Arguments as array strings
// YOUR MOVE, JQUERY.
q.prototype.args = function (args, node, i) {
  if (typeof args === 'function') {
    args = args(node, i);
  }

  // All the f(l)at none the slice
  if (typeof args !== 'string') {
    args = this.slice(args).map(this.str(node, i));
  }

  // Non-null string to array conversion
  return args.toString().split(/[\s,]+/).filter(function (e) {
    return e.length;
  });
};

// Callback returns => array
q.prototype.array = function (callback) {
  callback = callback;
  var self = this;
  return this.nodes.reduce(function (list, node, i) {
    var val;
    if (callback) {
      val = callback.call(self, node, i);
      if (!val) val = false;
      if (typeof val === 'string') val = q(val);
      if (val instanceof q) val = val.nodes;
    } else {
      val = node.innerHTML;
    }
    return list.concat(val !== false ? val : []);
  }, []);
};


// Elements' attributes handler
q.prototype.attr = function (name, value, data) {
  data = data ? 'data-' : '';

  if (value !== undefined) {
    var nm = name;
    name = {};
    name[nm] = value;
  }

  if (typeof name === 'object') {
    return this.each(function (node) {
      for (var key in name) {
        node.setAttribute(data + key, name[key]);
      }
    });
  }

  return this.length ? this.first().getAttribute(data + name) : '';
};


// Add element before
q.prototype.before = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.parentNode.insertBefore(fragment, node);
  });
};


// Get children of filtered nodes
q.prototype.children = function (selector) {
  return this.map(function (node) {
    return this.slice(node.children);
  }).filter(selector);
};



// Deep clone
q.prototype.clone = function () {
  return this.map(function (node, i) {
    var clone = node.cloneNode(true);
    var dest = this.getAll(clone);

    this.getAll(node).each(function (src, i) {
      for (var key in this.mirror) {
        this.mirror[key](src, dest.nodes[i]);
      }
    });

    return clone;
  });
};

//Return array of DOM nodes from a Source node.
q.prototype.getAll = function getAll (context) {
  return q([context].concat(q('*', context).nodes));
};

// Store operations to be performed when cloning elements
q.prototype.mirror = {};

// Copy all events of source to destination node.
q.prototype.mirror.events = function (src, dest) {
  if (!src._e) return;

  for (var type in src._e) {
    src._e[type].forEach(function (event) {
      q(dest).on(type, event);
    });
  }
};

// Copy select input value to clone
q.prototype.mirror.select = function (src, dest) {
  if (q(src).is('select')) {
    dest.value = src.value;
  }
};

// Copy text-area input value to clone
q.prototype.mirror.textarea = function (src, dest) {
  if (q(src).is('textarea')) {
    dest.value = src.value;
  }
};


// First element that matches selector for each node
q.prototype.closest = function (selector) {
  return this.map(function (node) {
    do {
      if (q(node).is(selector)) {
        return node;
      }
    } while ((node = node.parentNode) && node !== document);
  });
};


// Handle data-* attributes
q.prototype.data = function (name, value) {
  return this.attr(name, value, true);
};


// Loop through every node of current call
q.prototype.each = function (callback) {
  this.nodes.forEach(callback.bind(this));

  return this;
};


// Loop through the combination of every node and every argument passed
q.prototype.eacharg = function (args, callback) {
  return this.each(function (node, i) {
    this.args(args, node, i).forEach(function (arg) {
      callback.call(this, node, arg);
    }, this);
  });
};


// .filter(selector)
// Remove nodes that don't pass the selector.
q.prototype.filter = function (selector) {
  // -case CSS
  var callback = function (node) {
    // Browser compatibility 
    node.matches = node.matches || node.msMatchesSelector || node.webkitMatchesSelector;

    // -case No selector
    // If same element..
    return node.matches(selector || '*');
  };

  // filter() receives functions as in .filter(e => q(e).children().length)
  if (typeof selector === 'function') callback = selector;

  // filter() receives an instance of lib as in .filter(q('a'))
  if (selector instanceof q) {
    callback = function (node) {
      return (selector.nodes).indexOf(node) !== -1;
    };
  }

  // Native filtering -- speed improvements
  return q(this.nodes.filter(callback));
};


// Node's children by selector
q.prototype.find = function (selector) {
  return this.map(function (node) {
    return q(selector || '*', node);
  });
};


// Get first of nodes
q.prototype.first = function () {
  return this.nodes[0] || false;
};


// AJAX Calls.
function ajax (action, opt, done, before) {
  // Sanity check
  done = done || function () {};

  // A bunch of options
  opt = opt || {};
  opt.body = opt.body || '';
  opt.method = (opt.method || 'GET').toUpperCase();
  opt.headers = opt.headers || {};
  opt.headers['X-Requested-With'] = opt.headers['X-Requested-With'] || 'XMLHttpRequest';

  if (typeof window.FormData === 'undefined' || !(opt.body instanceof window.FormData)) {
    opt.headers['Content-Type'] = opt.headers['Content-Type'] || 'application/x-www-form-urlencoded';
  }

  if (/json/.test(opt.headers['Content-Type'])) {
    this.encode = function (data) {
      return JSON.stringify(opt.body || {});
    };
  }

  if ((typeof opt.body === 'object') && !(opt.body instanceof window.FormData)) {
    opt.body = q().param(opt.body);
  }

  // Create and send the request
  var request = new window.XMLHttpRequest();


  // Everything that has a beginning has an.. error?
  // This little shit passes an array to q() so 'on' can be used.
  // Must have nodeName. Can't be sliced
  q(request).on('error timeout abort', function () {
    done(new Error(), null, request);
  }).on('load', function () {
    // 2 or 3 -- Sanity check
    var err = !/^(2|3)/.test(request.status) ? new Error(request.status) : null;

    // Attempt to parse the body into JSON
    var body = parseJson(request.response) || request.response;

    return done(err, body, request);
  });

  // Create a request of the specified type to the URL and ASYNC
  request.open(opt.method, action);

  // Set the corresponding headers
  for (var name in opt.headers) {
    request.setRequestHeader(name, opt.headers[name]);
  }

  // Load the callback before sending the data
  if (before) before(request);

  request.send(opt.body);

  return request;
}


// Parse JSON without throwing an error
function parseJson (jsonString) {
  try {
    var o = JSON.parse(jsonString);
    if (o && typeof o === 'object') {
      return o;
    }
  } catch (e) {}

  return false;
}


// Generate a fragment of HTML. This irons out the inconsistences
q.prototype.generate = function (html) {
  // Table elements need to be child of <table> for some fucked up reason.
  if (/^\s*<t(h|r|d)/.test(html)) {
    return q(document.createElement('table')).html(html).children().nodes;
  } else if (/^\s*</.test(html)) {
    return q(document.createElement('div')).html(html).children().nodes;
  } else {
    return document.createTextNode(html);
  }
};

// Default event for callback.
q.prototype.handle = function (events, callback) {
  return this.on(events, function (e) {
    e.preventDefault();
    callback.apply(this, arguments);
  });
};

// Does it have a class though?
q.prototype.hasClass = function () {
  // DOES ANY HAVE ALL?
  return this.is('.' + this.args(arguments).join('.'));
};


// Set/Get html from matched nodes
q.prototype.html = function (text) {
  // Need to check cuz ""
  if (text === undefined) {
    return this.first().innerHTML || '';
  }

  // Loop through ALL nodes if /set.text()
  return this.each(function (node) {
    // Set the inner html to the node
    node.innerHTML = text;
  });
};


// Check if ANY matches Selector
q.prototype.is = function (selector) {
  return this.filter(selector).length > 0;
};

// Check if THIS in page.body
q.prototype.isInPage = function isInPage (node) {
  return (node === document.body) ? false : document.body.contains(node);
};

  // Get LAST node
q.prototype.last = function () {
  return this.nodes[this.length - 1] || false;
};


// Merge ALL callback nodes
q.prototype.map = function (callback) {
  return callback ? q(this.array(callback)).unique() : this;
};


// Remove nodes that match filter
q.prototype.not = function (filter) {
  return this.filter(function (node) {
    return !q(node).is(filter || true);
  });
};


// Remove callback to e. for each node
q.prototype.off = function (events) {
  return this.eacharg(events, function (node, event) {
    q(node._e ? node._e[event] : []).each(function (cb) {
      node.removeEventListener(event, cb);
    });
  });
};


// Attach a callback to the specified events
q.prototype.on = function (events, cb, cb2) {
  if (typeof cb === 'string') {
    var sel = cb;
    cb = function (e) {
      var args = arguments;
      q(e.currentTarget).find(sel).each(function (target) {
        if (target === e.target || target.contains(e.target)) {
          cb2.apply(e.target, args);
        }
      });
    };
  }

  // Add custom data as arguments
  var callback = function (e) {
    return cb.apply(this, [e].concat(e.detail || []));
  };

  return this.eacharg(events, function (node, event) {
    node.addEventListener(event, callback);

    // Store it so we can dereference it with .off()
    node._e = node._e || {};
    node._e[event] = node._e[event] || [];
    node._e[event].push(callback);
  });
};



// Parametize(IS THIS A WORD?) an object: { a: 'b', c: 'd' } => 'a=b&c=d'
q.prototype.param = function (obj) {
  return Object.keys(obj).map(function (key) {
    return this.uri(key) + '=' + this.uri(obj[key]);
  }.bind(this)).join('&');
};

// Climb one node up
q.prototype.parent = function (selector) {
  return this.map(function (node) {
    return node.parentNode;
  }).filter(selector);
};


// Add nodes to beginning of each node
q.prototype.prepend = function (html, data) {
  return this.adjacent(html, data, function (node, fragment) {
    node.insertBefore(fragment, node.firstChild);
  });
};


// Remove all matched nodes from DOM
q.prototype.remove = function () {
  // Loop through all the nodes
  return this.each(function (node) {
    // Remove
    node.parentNode.removeChild(node);
  });
};


// Remove a class from all matched nodes
q.prototype.removeClass = function () {
  // Loop the combination of each node with each argument
  return this.eacharg(arguments, function (el, name) {
    // Remove using native method
    el.classList.remove(name);
  });
};

// SAVE-GAME 


// Replace matched elements with the passed argument.
q.prototype.replace = function (html, data) {
  var nodes = [];
  this.adjacent(html, data, function (node, fragment) {
    nodes = nodes.concat(this.slice(fragment.children));
    node.parentNode.replaceChild(fragment, node);
  });
  return q(nodes);
};


// Scroll to first matched element
q.prototype.scroll = function () {
  this.first().scrollIntoView({ behavior: 'smooth' });
  return this;
};


// Select part based on context
q.prototype.select = function (parameter, context) {
  // Allow spaces
  parameter = parameter.replace(/^\s*/, '').replace(/\s*$/, '');

  if (context) {
    return this.select.byCss(parameter, context);
  }

  for (var key in this.selectors) {
    // Saving the precious space
    context = key.split('/');
    if ((new RegExp(context[1], context[2])).test(parameter)) {
      return this.selectors[key](parameter);
    }
  }

  return this.select.byCss(parameter);
};

// Select based on CSS Selector
q.prototype.select.byCss = function (parameter, context) {
  return (context || document).querySelectorAll(parameter);
};

// Allow adding/removing regexes and parsing functions
// It stores a regex: function pair to process the parameter and context
q.prototype.selectors = {};

// Find html nodes using an Id
q.prototype.selectors[/^\.[\w\-]+$/] = function (param) {
  return document.getElementsByClassName(param.substring(1));
};

// The tag nodes
q.prototype.selectors[/^\w+$/] = function (param) {
  return document.getElementsByTagName(param);
};

// Find html nodes using an Id
// Yes. Again.
q.prototype.selectors[/^\#[\w\-]+$/] = function (param) {
  return document.getElementById(param.substring(1));
};

// Create a new element
q.prototype.selectors[/^</] = function (param) {
  return q().generate(param);
};


// Convert forms into a string able to be submitted
q.prototype.serialize = function () {
  var self = this;

  // Store the class in a variable for manipulation
  return this.slice(this.first().elements).reduce(function (query, el) {
    // Match enabled elements with names, but not files
    if (!el.name || el.disabled || el.type === 'file') return query;

    // Ignore the checkboxes that are not checked
    if (/(checkbox|radio)/.test(el.type) && !el.checked) return query;

    // Handle multiple selects
    if (el.type === 'select-multiple') {
      q(el.options).each(function (opt) {
        if (opt.selected) {
          query += '&' + self.uri(el.name) + '=' + self.uri(opt.value);
        }
      });
      return query;
    }

    // Add the element to the object
    return query + '&' + self.uri(el.name) + '=' + self.uri(el.value);
  }, '').slice(1);
};


// Travel the matched elements at the same level
q.prototype.siblings = function (selector) {
  return this.parent().children(selector).not(this);
};


// Find the size of the first matched element
q.prototype.size = function () {
  return this.first().getBoundingClientRect();
};


// Force it to be an array AND also clone
q.prototype.slice = function (pseudo) {
  // Check that it's not a valid object
  if (!pseudo ||
      pseudo.length === 0 ||
      typeof pseudo === 'string' ||
      pseudo.toString() === '[object Function]') return [];

  // Accept also a q() object (that has .nodes)
  return pseudo.length ? [].slice.call(pseudo.nodes || pseudo) : [pseudo];
};

// Create a string from different things
q.prototype.str = function (node, i) {
  return function (arg) {
    // Call the function with the corresponding nodes
    if (typeof arg === 'function') {
      return arg.call(this, node, i);
    }

    // From an array or other 'weird' things
    return arg.toString();
  };
};


// Set/Get text content from  matched nodes
q.prototype.text = function (text) {
  // "" goddamit
  if (text === undefined) {
    return this.first().textContent || '';
  }
  // Loop through all the nodes
  return this.each(function (node) {
    // Set the text content to the node
    node.textContent = text;
  });
};


// Toggle classes in elements
q.prototype.toggleClass = function (classes, addOrRemove) {
  // Check if addOrRemove was passed as a boolean
  if (!!addOrRemove === addOrRemove) {
    return this[addOrRemove ? 'addClass' : 'removeClass'](classes);
  }

  // Loop through all the nodes and classes combinations
  return this.eacharg(classes, function (el, name) {
    el.classList.toggle(name);
  });
};


// Call an event manually on all the nodes
q.prototype.trigger = function (events) {
  var data = this.slice(arguments).slice(1);

  return this.eacharg(events, function (node, event) {
    var ev;

    // Allow the event to bubble up and to be cancelable
    var opts = { bubbles: true, cancelable: true, detail: data };

    try {
      // Accept different types of event names or an event itself
      ev = new window.CustomEvent(event, opts);
    } catch (e) {
      ev = document.createEvent('CustomEvent');
      ev.initCustomEvent(event, true, true, data);
    }

    node.dispatchEvent(ev);
  });
};


// Removed duplicated nodes, used for some specific methods
q.prototype.unique = function () {
  return q(this.nodes.reduce(function (clean, node) {
    var istruthy = node !== null && node !== undefined && node !== false;
    return (istruthy && clean.indexOf(node) === -1) ? clean.concat(node) : clean;
  }, []));
};

// Encode the different strings
q.prototype.uri = function (str) {
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
};


q.prototype.wrap = function (selector) {
  function findDeepestNode (node) {
    while (node.firstElementChild) {
      node = node.firstElementChild;
    }

    return q(node);
  }
  // 1) Construct dom node e.g. q('<a>'),
  // 2) clone the currently matched node
  // 3) append cloned dom node to constructed node based on selector
  return this.map(function (node) {
    return q(selector).each(function (n) {
      findDeepestNode(n)
        .append(node.cloneNode(true));

      node
        .parentNode
        .replaceChild(n, node);
    });
  });
};

// Export it for webpack
if (typeof module === 'object' && module.exports) {
  module.exports = {
    q: q,
    ajax: ajax
  };
}
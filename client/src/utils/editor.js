const { error } = require("components/shared-components/Toast/Toast");

const addNode = (t, key, node) => {
  if (t?.opt) {
    if (t?.key == key) {
      t.opt.push(node);
      return t;
    }

    t.opt.forEach((opt, i) => {
      t.opt[i] = addNode(opt, key, node);
    });
  } else if (t?.key == key) {
    if (node?.type === "list") {
      node.opt[0].next = t?.next || null;
      t.next = node;
    } else {
      t.next = { ...node, next: t?.next || null };
    }
    return t;
  } else if (t?.next) {
    addNode(t.next, key, node);
  }
  return t;
};

const updateNode = (t, key, data) => {
  if (t.key == key) {
    t = { ...t, ...data };
  } else {
    if (t?.next) {
      t.next = updateNode(t?.next, key, data);
    } else if (t?.opt) {
      t?.opt.forEach((opt, i) => {
        t.opt[i] = updateNode(opt, key, data);
      });
    }
  }
  return t;
};

const getNode = (t, key) => {
  let node = null;
  if (t.key == key) {
    node = t;
  } else {
    if (t?.next) {
      node = getNode(t?.next, key);
    } else if (t?.opt) {
      t?.opt.forEach((opt, i) => {
        if (!node) {
          node = getNode(opt, key);
        }
      });
    }
  }
  return node;
};

const moveNodeHori = (t, key, direction) => {
  if (t?.next) {
    t.next = moveNodeHori(t?.next, key, direction);
  } else if (t?.opt) {
    const options = [...t?.opt];
    for (let i = 0; i < options.length; i++) {
      if (t.opt[i]?.key == key) {
        if (direction === "left" && i > 0) {
          [t.opt[i - 1], t.opt[i]] = [t.opt[i], t.opt[i - 1]];
        } else if (direction === "right" && i < options.length - 1) {
          [t.opt[i + 1], t.opt[i]] = [t.opt[i], t.opt[i + 1]];
        }
        return t;
      }
    }

    options.forEach((opt, i) => {
      t.opt[i] = moveNodeHori(opt, key, direction);
    });
  }
  return t;
};

const getParentkey = (t, key) => {
  let k = null;
  if (t?.next) {
    if (t.next?.key == key) {
      k = t.key;
    } else k = getParentkey(t?.next, key);
  } else if (t?.opt) {
    if (t.opt[0].next?.key == key) {
      k = t.key;
    } else
      t?.opt.forEach((opt, i) => {
        if (!k) {
          k = getParentkey(opt?.next, key);
        }
      });
  }
  return k;
};

const moveNodeUp = (t, key) => {
  if (t?.next) {
    if (t.key == key) {
      const next = t.next;
      if (t.next?.opt) {
        t.next = t.next.opt[0].next;
        next.opt[0].next = t;
      } else {
        t.next = t.next?.next;
        next.next = t;
      }
      return next;
    } else {
      t.next = moveNodeUp(t?.next, key);
    }
  } else if (t?.opt) {
    if (t.key == key) {
      if (t.opt[0]?.next) {
        const next = t.opt[0].next;
        if (t.opt[0].next?.opt) {
          t.opt[0].next = t.opt[0].next?.opt[0]?.next;
          next.opt[0].next = t;
        } else {
          t.opt[0].next = t.opt[0].next?.next;
          next.next = t;
        }
        return next;
      }
      return t;
    }

    t.opt.forEach((opt, i) => {
      t.opt[i] = moveNodeUp(opt, key);
    });
  }
  return t;
};

const moveNodeDown = (t, key) => {
  if (t?.next) {
    if (t.key == key) {
      const next = t.next;
      if (t.next?.opt) {
        t.next = t.next.opt[0].next;
        next.opt[0].next = t;
      } else {
        t.next = t.next?.next;
        next.next = t;
      }
      return next;
    } else {
      t.next = moveNodeDown(t?.next, key);
    }
  } else if (t?.opt) {
    if (t.key == key) {
      if (t.opt[0]?.next) {
        const next = t.opt[0].next;
        if (t.opt[0].next?.opt) {
          t.opt[0].next = t.opt[0].next?.opt[0]?.next;
          next.opt[0].next = t;
        } else {
          t.opt[0].next = t.opt[0].next?.next;
          next.next = t;
        }
        return next;
      }
      return t;
    }

    t.opt.forEach((opt, i) => {
      t.opt[i] = moveNodeDown(opt, key);
    });
  }
  return t;
};

const deleteNode = (t, key) => {
  if (t?.next) {
    if (t?.next?.key == key) {
      if (t.next?.next) {
        t.next = t.next?.next;
      } else {
        delete t.next;
      }
      return t;
    }
    deleteNode(t?.next, key);
  } else if (t?.opt) {
    const options = [...t?.opt];
    for (let i = 0; i < options.length; i++) {
      if (t.opt[i]?.key == key) {
        if (options.length === 1)
          error("Only one option present, you can't delete it");
        else t.opt.splice(i, 1);
        return t;
      }
    }

    options.forEach((opt, i) => {
      t.opt[i] = deleteNode(opt, key);
    });
  }
  return t;
};

const isURL = (str) => {
  let pattern = new RegExp(
    "^(https?:\\/\\/)|(http?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  );
  return !!pattern.test(str);
};

module.exports = {
  addNode,
  updateNode,
  getNode,
  moveNodeHori,
  getParentkey,
  moveNodeUp,
  moveNodeDown,
  deleteNode,
  isURL,
};

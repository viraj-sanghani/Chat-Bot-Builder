const { error } = require("components/shared-components/Toast/Toast");

const addNode = (t, node, cur) => {
  const curNext = getNode(t, cur?.next);

  if (node?.opt) {
    node.opt[0].next = cur.next;
  } else node.next = cur.next;

  cur.next = node.key;

  if (curNext) {
    curNext.prev = node?.opt ? node.opt[0].key : node.key;
    t[curNext.key] = curNext;
  }

  if (cur?.parent) {
    node.prev = cur.parent;
    t[cur.parent].opt = t[cur?.parent].opt.map((e) => {
      if (e.key === cur.key) {
        return cur;
      }
      return e;
    });
  } else {
    node.prev = cur.key;
    t[cur.key] = cur;
  }

  t[node.key] = node;

  return t;
}; // 👍

const updateNode = (t, key, data) => {
  t[key] = { ...t[key], ...data };
  return t;
}; // 👍

const getNode = (t, key, parent = null) => {
  return parent
    ? { ...t[parent]?.opt.filter((e) => e.key == key)[0] }
    : t[key]
    ? { ...t[key] }
    : false;
}; // 👍

const moveNodeHori = (t, key, parent, direction) => {
  const options = [...t[parent]?.opt];
  const index = options.findIndex((e) => e.key == key);

  if (direction === "left" && index > 0) {
    [options[index], options[index - 1]] = [options[index - 1], options[index]];
  }

  if (direction === "right" && index < options.length - 1) {
    [options[index], options[index + 1]] = [options[index + 1], options[index]];
  }

  t[parent] = {
    ...t[parent],
    opt: options,
  };

  return t;
}; // 👍

const moveNodeUp = (t, key) => {
  const cur = t[key];

  if (cur?.opt) return t;

  const curPrev = getNode(t, cur?.prev);
  const curNext = getNode(t, cur?.next);
  const newPrev = getNode(t, curPrev?.prev);

  // case 1:

  if (curPrev) {
    const cprev = cur.prev;
    cur.prev = curPrev.prev;

    if (curPrev?.opt) {
      curPrev.opt = curPrev.opt.map((e) => {
        if (e.next === key) {
          e.next = cur.next;
        }
        return e;
      });
    } else {
      curPrev.next = cur.next;
    }

    curPrev.prev = cur.key;
    t[curPrev.key] = curPrev;
    cur.next = cprev;

    if (curNext) {
      curNext.prev = curPrev.key;
      t[curNext.key] = curNext;
    }

    if (newPrev) {
      if (newPrev?.opt) {
        newPrev.opt = newPrev.opt.map((e) => {
          if (e.next === curPrev.key) {
            e.next = cur.key;
          }
          return e;
        });
      } else {
        newPrev.next = cur.key;
      }
      t[newPrev.key] = newPrev;
    }

    t[cur.key] = cur;
  }

  return t;
}; // 👍

const moveNodeDown = (t, key) => {
  const cur = t[key];

  if (cur?.opt) return t;

  const curPrev = getNode(t, cur?.prev);
  const curNext = getNode(t, cur?.next);
  const newNext = getNode(t, curNext?.next);

  if (curNext) {
    const cnext = cur.next;
    curNext.prev = cur.prev;

    if (curNext?.opt) {
      const optNext = curNext?.opt[0];
      cur.next = optNext.next;
      optNext.next = cur.key;
      curNext.opt[0] = optNext;
    } else {
      cur.next = curNext.next;
      curNext.next = cur.key;
    }

    cur.prev = curNext.key;
    t[curNext.key] = curNext;

    if (curPrev) {
      if (curPrev?.opt) {
        curPrev.opt = curPrev.opt.map((e) => {
          if (e.next === key) {
            e.next = cnext;
          }
          return e;
        });
        t[curPrev.key] = curPrev;
      } else {
        curPrev.next = cnext;
        t[curPrev.key] = curPrev;
      }
    }

    if (newNext) {
      newNext.prev = cur.key;
      t[newNext.key] = newNext;
    }

    t[cur.key] = cur;
  }

  return t;
}; // 👍

const deleteNode = (t, cur) => {
  const curPrev = getNode(t, cur?.parent || cur?.prev);
  const curNext = getNode(t, cur?.next);
  if (cur?.parent) {
    if (curPrev.opt.length > 1)
      t[cur.parent].opt = curPrev.opt.filter((e) => e.key !== cur.key);
    else error("Only one child present, you can't delete it");
  } else if (curPrev?.opt) {
    t[cur.prev].opt = curPrev.opt.map((e) => {
      if (e.next === cur.key) {
        if (curNext) {
          e.next = cur.next;
          curNext.prev = cur.prev;
          t[curNext.key] = curNext;
        } else {
          e.next = null;
        }
        delete t[cur.key];
      }
      return e;
    });
  } else {
    if (curNext) {
      curPrev.next = cur.next;
      curNext.prev = cur.prev;
      t[curNext.key] = curNext;
    } else {
      curPrev.next = null;
    }
    delete t[cur.key];
    t[curPrev.key] = curPrev;
  }

  return t;
}; // 👍

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
  moveNodeUp,
  moveNodeDown,
  deleteNode,
  isURL,
};

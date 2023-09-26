interface Item {
  value: any;
  expiresAt: number;
  storedAt: number;
}

interface Cache {
  [key: string]: Item;
}

let cache: Cache = {};

export default {
  get(key: string): Item | undefined {
    const cached = cache[key];
    if (!cached) {
      return;
    }

    if (cached.expiresAt < Date.now()) {
      delete cache[key];
      return;
    }

    return cached;
  },

  set(key: string, value: any, ttl: number = 1000 * 3): Item {
    cache[key] = {
      value,
      expiresAt: Date.now() + ttl,
      storedAt: Date.now()
    };

    return cache[key];
  }
}
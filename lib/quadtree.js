class QuadTree {
    constructor(w, h, x = 0, y = 0, level = 0, maxObjects = 8, maxDepth = 8) {
        this.w = w
        this.h = h
        this.x = x
        this.y = y
        this.maxObjects = maxObjects
        this.maxDepth = maxDepth
        this.level = level
        this.objects = []
        this.nodes = null
    }

    split() {
        const w = this.w / 2
        const h = this.h / 2
        const x = this.x
        const y = this.y;

        const tl = new QuadTree(w, h, x, y, this.level + 1)
        const tr = new QuadTree(w, h, x + w, y, this.level + 1)
        const bl = new QuadTree(w, h, x, y + h, this.level + 1)
        const br = new QuadTree(w, h, x + w, y + h, this.level + 1)

        this.nodes = [tl, tr, bl, br]
    }

    getIndex(x, y, r = 10) {
        const vm = this.x + (this.w / 2)
        const hm = this.y + (this.h / 2)

        if (x + r < this.x || x - r > this.x + this.w || y + r < this.y || y - r > this.y + this.h) return []

        const left = (x - r) <= vm
        const right = (x + r) >= vm
        const top = (y - r) <= hm
        const bottom = (y + r) >= hm

        const indexes = []
        if (top) {
            if (left) indexes.push(0)
            if (right) indexes.push(1)
        }
        if (bottom) {
            if (left) indexes.push(2)
            if (right) indexes.push(3)
        }

        return indexes
    }
    insert(obj) {
        if (this.nodes != null) {
            let indexes = this.getIndex(obj.x, obj.y)
            for (let i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].insert(obj)
            }
            return
        }
        this.objects.push(obj)
        if (this.objects.length > this.maxObjects && this.level < this.maxDepth) {
            if (this.nodes == null) {
                this.split();
            }
            for (let i = 0; i < this.objects.length; i++) {
                let indexes = this.getIndex(this.objects[i].x, this.objects[i].y);
                for (let k = 0; k < indexes.length; k++) {
                    this.nodes[indexes[k]].insert(this.objects[i]);
                }
            }
            this.objects = [];
        }
    }
    retrieve(x, y, r = 10) {
        let results = this.objects.slice(0)
        if (this.nodes != null) {
            const indexes = this.getIndex(x, y, r)
            for (let i = 0; i < indexes.length; i++) {
                results = [...results, ...this.nodes[indexes[i]].retrieve(x, y, r)]
            }
        }
        return results

    }
    remove(obj, r = 10) {
        if (this.nodes != null) {
            const indexes = this.getIndex(obj.x, obj.y, r)
            for (let i = 0; i < indexes.length; i++) {
                this.nodes[indexes[i]].remove(obj, r)
            }
        }
        this.objects = this.objects.filter(o => o !== obj)
    }
    getAll() {
        if (this.nodes != null) return this.nodes.reduce((arr, n) => [...arr, ...n.getAll()], [])
        return this.objects
    }
    join() {
        if (this.nodes != null) {
            let objects = []
            for (let i = 0; i < 4; i++) {
                objects = [...objects, ...this.nodes[i].join()]
            }
            if (objects.length < this.maxObjects) {
                this.clear()
                this.objects = objects
            }
        }
        return this.objects
    }
    clear() {
        this.objects = [];
        if (this.nodes != null) {
            for (var i = 0; i < this.nodes.length; i++) {
                if (this.nodes.length) {
                    this.nodes[i].clear();
                }
            }
        }
        this.nodes = null;
    }
}
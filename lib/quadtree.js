class QuadTree {
    constructor(w, h, x = 0, y = 0, level = 0, maxObjects = 10, maxDepth = 4) {
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

    getIndicies(x, y, r = 4) {
        const vm = this.x + (this.w / 2)
        const hm = this.y + (this.h / 2)

        if (x + r < this.x || x - r > this.x + this.w || y + r < this.y || y - r > this.y + this.h) return []

        const left = (x - r) <= vm
        const right = (x + r) >= vm
        const top = (y - r) <= hm
        const bottom = (y + r) >= hm

        const indicies = []
        if (top) {
            if (left) indicies.push(0)
            if (right) indicies.push(1)
        }
        if (bottom) {
            if (left) indicies.push(2)
            if (right) indicies.push(3)
        }

        return indicies
    }

    insert(obj) {
        if (this.nodes != null) {
            let indicies = this.getIndicies(obj.position.x, obj.position.y)
            for (let i = 0; i < indicies.length; i++) {
                this.nodes[indicies[i]].insert(obj)
            }
            return
        }
        this.objects.push(obj)
        if (this.objects.length > this.maxObjects && this.level < this.maxDepth) {
            if (this.nodes == null) {
                this.split();
            }
            for (let i = 0; i < this.objects.length; i++) {
                let indicies = this.getIndicies(this.objects[i].position.x, this.objects[i].position.y);
                for (let k = 0; k < indicies.length; k++) {
                    this.nodes[indicies[k]].insert(this.objects[i]);
                }
            }
            this.objects = [];
        }
    }

    query(x, y, r = 4) {
        let results = this.objects.slice(0)
        if (this.nodes != null) {
            const indicies = this.getIndicies(x, y, r)
            for (let i = 0; i < indicies.length; i++) {
                results = [...results, ...this.nodes[indicies[i]].query(x, y, r)]
            }
        }
        return [...new Set(results)]

    }

    remove(obj, r = 4) {
        if (this.nodes != null) {
            const indicies = this.getIndicies(obj.position.x, obj.position.y, r)
            for (let i = 0; i < indicies.length; i++) {
                this.nodes[indicies[i]].remove(obj, r)
            }
        }
        this.objects = this.objects.filter(o => o != obj)
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
export class BasicMovie {
    constructor(
        public id: number,
        public name: string,
        public imageUrl: string,
        public categories: string[],
        public rating?: number
    ) { }
}

export class Movie extends BasicMovie {
    constructor(
        public id: number,
        public name: string,
        public imageUrl: string,
        public categories: string[],
        public rating?: number,
        public actors?: string,
        public year?: string,
        public director?: string,
        public description?: string,
        public runtime?: string
    ) {
        super(id, name, imageUrl, categories, rating)
    }
}
export class BasicMovie {
    constructor(
        public name: string,
        public imageUrl: string,
        public categories: string[],
        public rating: number
    ) { }
}

export class Movie extends BasicMovie {
    constructor(
        public name: string,
        public imageUrl: string,
        public categories: string[],
        public rating: number,
        public actors: string[]
    ) {
        super(name, imageUrl, categories, rating)
    }
}
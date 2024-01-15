// const valueFactory = (x: number) => x
//
// const myValue = valueFactory(22)
//
// type TypeFactory<X> = X
// type MyType = TypeFactory<string>
//
//
// interface ValueContainer<Value> {
//     value: Value
//
// }
//
// type StringContainer = ValueContainer<number>
//
// const x: StringContainer ={
//     value:1
// }
//


class ArrayOfNumbers {
    constructor(public collection: number[]) {
    }

    get(index: number): number {
        return this.collection[index]
    }
}

class ArrayOfString {
    constructor(public collection: string[]) {
    }

    get(index: number): string {
        return this.collection[index]
    }
}

class ArrOfAnything<Type> {
    constructor(public collection: Type[]) {
    }

    get(index: number): Type {
        return this.collection[index]
    }
}

new ArrOfAnything<string>(['1', '2', '3'])
new ArrOfAnything<number>([1, 2, 3])


export default {}
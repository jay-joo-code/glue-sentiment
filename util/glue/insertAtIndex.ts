const insertAtIndex = ({ array, index, newItem }) =>
  array
    ? [
        // part of the array before the specified index
        ...array.slice(0, index),
        // inserted item
        newItem,
        // part of the array after the specified index
        ...array.slice(index),
      ]
    : [newItem]

export default insertAtIndex

const deepCopy = (item) => {
  return JSON.parse(JSON.stringify(item));
};

class RangeList {
  constructor() {
    this.ranges = [];
  }

  getListByRange(range, remove = 0) {
    const start = range[0];
    const size = range[1] - range[0] + Number(remove);
    return [...Array(size).keys()].map((number) => number + start);
  }

  getAllCurrentLists() {
    return this.ranges.map((range) => this.getListByRange(range));
  }

  mergeLists(flatenRanges) {
    const merged = [];
    flatenRanges.forEach((flatenRange) => {
      merged.push(...flatenRange);
    });

    return merged;
  }

  isValidRange(range) {
    if (!Array.isArray(range)) {
      return false;
    }

    return (
      range.length === 2 &&
      !isNaN(range[0]) &&
      !isNaN(range[1]) &&
      range[0] <= range[1]
    );
  }

  hasIntersaction(existingRange, newRange) {
    const newRangeStart = newRange[0];
    const newRangeEnd = newRange[1];
    const existingRangeStart = existingRange[0];
    const existingRangeEnd = existingRange[1];
    if (newRangeEnd < existingRangeStart || newRangeStart > existingRangeEnd) {
      return false;
    }

    return true;
  }

  hasNoIntersactionToAllExistingRange(newRange) {
    return this.ranges.every((range) => {
      return !this.hasIntersaction(range, newRange);
    });
  }

  convertToRanges(list) {
    const ranges = [];
    const tempList = [];
    let previousNumber = null;
    list.forEach((number) => {
      if (tempList.length === 0) {
        tempList.push(number);
        previousNumber = number;
        return;
      }

      if (number - previousNumber > 1) {
        ranges.push(deepCopy(tempList));
        tempList.length = 0;
      }

      tempList.push(number);
      previousNumber = number;
    });

    if (tempList.length !== 0) {
      ranges.push(deepCopy(tempList));
    }

    return ranges.map((list) => {
      return [list[0], list[list.length - 1] + 1];
    });
  }

  formatRangeForOutput(range) {
    return `[${range[0]} ${range[range.length - 1]})`;
  }

  add(newRange) {
    if (!this.isValidRange(newRange)) {
      console.log("Invalid Range. Please use a format of [1, 2]");
      return false;
    }

    if (this.hasNoIntersactionToAllExistingRange(newRange)) {
      this.ranges.push(newRange);
      return;
    }

    const newList = this.getListByRange(newRange);
    const allCurrentLists = this.getAllCurrentLists();

    allCurrentLists.push(newList);

    const mergedList = this.mergeLists(allCurrentLists);
    const sortedMergedListWithDuplicationRemoved = [
      ...new Set(mergedList),
    ].sort((a, b) => a - b);

    // console.log("list", sortedMergedListWithDuplicationRemoved);
    this.ranges = this.convertToRanges(sortedMergedListWithDuplicationRemoved);
  }

  remove(range) {
    if (!this.isValidRange(range)) {
      console.log("Invalid range. Please use a format of [1, 2]");
      return false;
    }

    if (this.hasNoIntersactionToAllExistingRange(range)) {
      console.log("No range is removed");
      return false;
    }

    const numbersToRemove = this.getListByRange(range);
    const allCurrentNumbers = this.mergeLists(this.getAllCurrentLists());
    const mirroredNumbers = deepCopy(allCurrentNumbers);

    mirroredNumbers.forEach((number) => {
      if (numbersToRemove.indexOf(number) !== -1) {
        const index = allCurrentNumbers.indexOf(number);
        allCurrentNumbers.splice(index, 1);
      }
    });

    this.ranges = this.convertToRanges(allCurrentNumbers);
  }

  print() {
    const output = this.ranges.map((range) => {
      return this.formatRangeForOutput(range);
    });

    console.log(output.join(" "));
  }
}

const rl = new RangeList();

rl.add([1, 5]);
rl.print(); // Should display: [1, 5)
rl.add([10, 20]);
rl.print(); // Should display: [1, 5) [10, 20)
rl.add([20, 20]);
rl.print(); // Should display: [1, 5) [10, 20)
rl.add([20, 21]);
rl.print(); // Should display: [1, 5) [10, 21)
rl.add([2, 4]);
rl.print(); // Should display: [1, 5) [10, 21)
rl.add([3, 8]);
rl.print(); // Should display: [1, 8) [10, 21)
rl.remove([10, 10]);
rl.print(); // Should display: [1, 8) [10, 21)
rl.remove([10, 11]);
rl.print(); // Should display: [1, 8) [11, 21)
rl.remove([15, 17]);
rl.print(); // Should display: [1, 8) [11, 15) [17, 21)
rl.remove([3, 19]);
rl.print(); // Should display: [1, 3) [19, 21)

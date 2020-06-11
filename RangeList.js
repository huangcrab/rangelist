const deepCopy = (item) => {
  return JSON.parse(JSON.stringify(item));
};

const sortAsc = (a, b) => a - b;

class RangeList {
  constructor() {
    this.ranges = [];
  }

  getListByRange(range) {
    if (!this.isValidRange(range)) {
      return [];
    }
    const start = range[0];
    const size = range[1] - range[0];
    return [...Array(size).keys()].map((number) => number + start);
  }

  getAllCurrentNumbers() {
    const mergedNumbers = [];
    this.ranges
      .map((range) => this.getListByRange(range))
      .forEach((list) => {
        mergedNumbers.push(...list);
      });

    return mergedNumbers;
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

  hasIntersection(existingRange, newRange) {
    if (!this.isValidRange(existingRange) || !this.isValidRange(newRange)) {
      return false;
    }
    const newRangeStart = newRange[0];
    const newRangeEnd = newRange[1];
    const existingRangeStart = existingRange[0];
    const existingRangeEnd = existingRange[1];
    if (newRangeEnd < existingRangeStart || newRangeStart > existingRangeEnd) {
      return false;
    }

    return true;
  }

  hasNoIntersectionToAllExistingRange(newRange) {
    if (!this.isValidRange(newRange)) {
      return true;
    }
    return this.ranges.every((range) => {
      return !this.hasIntersection(range, newRange);
    });
  }

  convertNumberListToRange(list) {
    if (!list) {
      return [];
    }

    list.sort(sortAsc);

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
    if (!this.isValidRange(range)) {
      return "";
    }
    return `[${range[0]} ${range[range.length - 1]})`;
  }

  add(newRange) {
    if (!this.isValidRange(newRange)) {
      console.log("Invalid Range. Please use a format of [1, 2]");
      return false;
    }

    const listOfNumbersToAdd = this.getListByRange(newRange);
    const allCurrentNumbers = this.getAllCurrentNumbers();
    const mergedListOfNumbers = [...listOfNumbersToAdd, ...allCurrentNumbers];
    const mergedListWithDuplicationRemoved = [...new Set(mergedListOfNumbers)];

    this.ranges = this.convertNumberListToRange(
      mergedListWithDuplicationRemoved
    );
  }

  remove(range) {
    if (!this.isValidRange(range)) {
      console.log("Invalid range. Please use a format of [1, 2]");
      return false;
    }

    if (this.hasNoIntersectionToAllExistingRange(range)) {
      return false;
    }

    const numbersToRemove = this.getListByRange(range);
    const allCurrentNumbers = this.getAllCurrentNumbers();
    const mirroredNumbers = deepCopy(allCurrentNumbers);

    mirroredNumbers.forEach((number) => {
      if (numbersToRemove.indexOf(number) !== -1) {
        const index = allCurrentNumbers.indexOf(number);
        allCurrentNumbers.splice(index, 1);
      }
    });

    this.ranges = this.convertNumberListToRange(allCurrentNumbers);
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

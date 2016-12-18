function reduce (matrix) {
	let list = [];
	let count = 0;
	function push (num) {
		if (count) {
			if (count == 1) list.push(0);
			else list.push(-count);
			count = 0;
		}
		if (num) list.push(num);
	}
	for (let num of matrix) {
		if (num == 0) count++;
		else push(num);
	}
	push();
	return list;
}

function expand (list) {
	let matrix = [];
	function zeros(count) {
		while (count--) matrix.push(0);
	}
	for (let num of list) {
		if (num < 0) zeros(-num);
		else matrix.push(num);
	}
	return matrix;
}

function load (list) {
    return PathFinder.CostMatrix.deserialize(expand(list));
}

function save (matrix) {
    return reduce(matrix.serialize());
}

module.exports = {load, save};

function solveNewtonForward(xVals, yVals, targetX) {
    let n = xVals.length;

    if (n < 2) throw new Error("At least two data points required for interpolation.");
    let h = xVals[1] - xVals[0];
    if (Math.abs(h) < 1e-10) throw new Error("Spacing between x values must be non-zero.");

    for (let i = 1; i < n - 1; i++) {
        if (Math.abs((xVals[i + 1] - xVals[i]) - h) > 1e-5) {
            throw new Error("Error: X values must be equally spaced for Newton Forward Interpolation. Check your inputs.");
        }
    }

    let diffTable = Array.from({ length: n }, () => new Array(n).fill("-"));
    for (let i = 0; i < n; i++) {
        diffTable[i][0] = yVals[i];
    }

    for (let j = 1; j < n; j++) {
        for (let i = 0; i < n - j; i++) {
            let diff = diffTable[i + 1][j - 1] - diffTable[i][j - 1];
            // Format to avoid floating point anomalies (e.g. 0.000000004)
            diffTable[i][j] = Number(diff.toPrecision(10));
        }
    }

    let u = (targetX - xVals[0]) / h;
    let result = diffTable[0][0];
    let uTerm = 1;
    let fact = 1;

    for (let j = 1; j < n; j++) {
        uTerm = uTerm * (u - (j - 1));
        fact = fact * j;
        let term = (uTerm * diffTable[0][j]) / fact;
        result += term;
    }

    return { result, diffTable };
}

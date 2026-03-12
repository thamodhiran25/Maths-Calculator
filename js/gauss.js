function solveGauss(matrix, constants) {
    let n = matrix.length;
    let augmented = [];

    for (let i = 0; i < n; i++) {
        augmented.push([...matrix[i], constants[i]]);
    }

    let steps = [];
    steps.push({ label: "Initial Augmented Matrix", state: augmented.map(row => [...row]) });

    for (let i = 0; i < n; i++) {
        // Find pivot
        let maxEl = Math.abs(augmented[i][i]);
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(augmented[k][i]) > maxEl) {
                maxEl = Math.abs(augmented[k][i]);
                maxRow = k;
            }
        }

        // Swap rows
        for (let k = i; k < n + 1; k++) {
            let tmp = augmented[maxRow][k];
            augmented[maxRow][k] = augmented[i][k];
            augmented[i][k] = tmp;
        }

        if (Math.abs(augmented[i][i]) < 1e-10) {
            throw new Error("Matrix is singular or nearly singular. The system has no unique solution.");
        }

        // Eliminate
        let eliminated = false;
        for (let k = i + 1; k < n; k++) {
            let c = -augmented[k][i] / augmented[i][i];
            for (let j = i; j < n + 1; j++) {
                if (i === j) {
                    augmented[k][j] = 0;
                } else {
                    augmented[k][j] += c * augmented[i][j];
                }
            }
            eliminated = true;
        }
        if (eliminated) {
            steps.push({ label: `Elimination for Column ${i + 1}`, state: augmented.map(row => [...row]) });
        }
    }

    // Back substitution
    let solution = new Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        solution[i] = augmented[i][n] / augmented[i][i];
        for (let k = i - 1; k >= 0; k--) {
            augmented[k][n] -= augmented[k][i] * solution[i];
        }
    }

    return { solution, steps };
}

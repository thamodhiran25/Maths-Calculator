function solveRK4(funcStr, x0, y0, h, xn) {
    if (h <= 0) throw new Error("Step size 'h' must be greater than 0");
    if (x0 >= xn) throw new Error("Target 'xn' must be strictly greater than initial 'x0'");

    let node;
    try {
        node = math.parse(funcStr);
        node.compile();
    } catch (e) {
        throw new Error("Invalid differential equation expression. Ensure valid math syntax (e.g., 'x + y', 'sin(x)*y').");
    }

    const f = (x, y) => {
        try {
            let scope = { x: x, y: y };
            return node.evaluate(scope);
        } catch (e) {
            throw new Error("Error evaluating function at x=" + x + ", y=" + y);
        }
    };

    let x = x0;
    let y = y0;
    let iterations = [{ x: Number(x0.toFixed(6)), y: Number(y0.toFixed(6)), k1: "-", k2: "-", k3: "-", k4: "-" }];

    let maxSteps = 10000;
    let stepCount = 0;

    while (x < xn - 1e-9 && stepCount < maxSteps) {
        let currentH = Math.min(h, xn - x); // avoid overshooting

        let k1 = currentH * f(x, y);
        let k2 = currentH * f(x + currentH / 2, y + k1 / 2);
        let k3 = currentH * f(x + currentH / 2, y + k2 / 2);
        let k4 = currentH * f(x + currentH, y + k3);

        y = y + (k1 + 2 * k2 + 2 * k3 + k4) / 6;
        x = x + currentH;

        iterations.push({
            x: Number(x.toFixed(6)),
            y: Number(y.toFixed(6)),
            k1: Number(k1.toFixed(6)),
            k2: Number(k2.toFixed(6)),
            k3: Number(k3.toFixed(6)),
            k4: Number(k4.toFixed(6))
        });

        stepCount++;
    }

    if (stepCount >= maxSteps) {
        throw new Error("Maximum iterations reached. Check your step size.");
    }

    return { finalY: y, iterations };
}

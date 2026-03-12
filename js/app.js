document.addEventListener('DOMContentLoaded', () => {

    // --- Splash Screen Logic ---
    const splashScreen = document.getElementById('splash-screen');
    const enterWorkspaceBtn = document.getElementById('enter-workspace-btn');
    const returnSplashBtn = document.getElementById('nav-splash');

    // Add class to body initially to hide overflow scrollbars during splash
    document.body.classList.add('splash-active');

    if (enterWorkspaceBtn && splashScreen) {
        enterWorkspaceBtn.addEventListener('click', () => {
            splashScreen.classList.add('hidden-splash');
            document.body.classList.remove('splash-active');
        });
    }

    if (returnSplashBtn && splashScreen) {
        returnSplashBtn.addEventListener('click', () => {
            splashScreen.classList.remove('hidden-splash');
            document.body.classList.add('splash-active');
        });
    }

    // --- View Navigation System ---
    const navBtns = document.querySelectorAll('.nav-btn, .method-card[data-trigger]');
    const views = document.querySelectorAll('.view-section');

    function switchView(targetId) {
        views.forEach(v => v.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById(targetId).classList.add('active');
        const correspondingNav = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
        if (correspondingNav) correspondingNav.classList.add('active');
    }

    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = btn.dataset.target || btn.dataset.trigger;
            if (target) switchView(target);
        });
    });

    // --- Accordion Logic ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            header.parentElement.classList.toggle('open');
        });
    });

    // --- UI Helpers ---
    function showError(elementId, msg) {
        const el = document.getElementById(elementId);
        el.textContent = msg;
        el.classList.remove('hidden');
    }
    function hideError(elementId) {
        document.getElementById(elementId).classList.add('hidden');
    }

    // ==========================================
    // MODULE 1: GAUSS ELIMINATION
    // ==========================================
    const btnGaussGen = document.getElementById('gauss-generate');
    const containerGaussInputs = document.getElementById('gauss-inputs');
    const containerGaussMatrix = document.getElementById('gauss-matrix-container');
    const btnGaussSolve = document.getElementById('gauss-solve');

    btnGaussGen.addEventListener('click', () => {
        const n = parseInt(document.getElementById('gauss-n').value);
        if (n < 2 || n > 10) return showError('gauss-error', 'n must be between 2 and 10');
        hideError('gauss-error');

        containerGaussInputs.innerHTML = '';
        containerGaussInputs.style.gridTemplateColumns = `1fr`;

        for (let i = 0; i < n; i++) {
            const row = document.createElement('div');
            row.className = 'matrix-row';
            for (let j = 0; j < n; j++) {
                row.innerHTML += `<input type="number" step="any" class="stylish-input matrix-input coeff" data-r="${i}" data-c="${j}" placeholder="x${j + 1}">`;
            }
            row.innerHTML += `<div class="matrix-divider"></div>`;
            row.innerHTML += `<input type="number" step="any" class="stylish-input matrix-input const" data-r="${i}" placeholder="b${i + 1}">`;
            containerGaussInputs.appendChild(row);
        }

        containerGaussMatrix.classList.remove('hidden');
        document.getElementById('gauss-results').classList.add('hidden');
    });

    btnGaussSolve.addEventListener('click', () => {
        hideError('gauss-error');
        const n = parseInt(document.getElementById('gauss-n').value);
        let matrix = Array(n).fill().map(() => Array(n).fill(0));
        let constants = Array(n).fill(0);
        let valid = true;

        document.querySelectorAll('#gauss-inputs .coeff').forEach(inp => {
            let val = parseFloat(inp.value);
            if (isNaN(val)) valid = false;
            matrix[inp.dataset.r][inp.dataset.c] = val;
        });
        document.querySelectorAll('#gauss-inputs .const').forEach(inp => {
            let val = parseFloat(inp.value);
            if (isNaN(val)) valid = false;
            constants[inp.dataset.r] = val;
        });

        if (!valid) return showError('gauss-error', 'Please fill all matrix values with valid numbers.');

        try {
            const result = solveGauss(matrix, constants);
            displayGaussResults(result.solution, result.steps);
        } catch (e) {
            showError('gauss-error', e.message);
        }
    });

    document.getElementById('gauss-reset').addEventListener('click', () => {
        document.getElementById('gauss-n').value = 3;
        containerGaussMatrix.classList.add('hidden');
        document.getElementById('gauss-results').classList.add('hidden');
        hideError('gauss-error');
    });

    function displayGaussResults(solution, steps) {
        document.getElementById('gauss-results').classList.remove('hidden');
        const solDiv = document.getElementById('gauss-solution');
        let html = '<div>x = [ <span>';
        html += solution.map(val => Number(val.toFixed(4))).join(', ');
        html += '</span> ]<sup>T</sup></div>';
        // Individual vars
        html += '<div style="margin-top:0.5rem; font-size: 0.95rem; color: var(--text-muted);">';
        solution.forEach((val, i) => html += `x<sub>${i + 1}</sub> = ${Number(val.toFixed(4))} &nbsp;&nbsp;&nbsp;`);
        html += '</div>';
        solDiv.innerHTML = html;

        const stepsDiv = document.getElementById('gauss-steps');
        stepsDiv.innerHTML = '';
        steps.forEach(step => {
            let box = document.createElement('div');
            box.className = 'step-matrix';
            box.innerHTML = `<div class="step-label">${step.label}</div>`;

            let tableHTML = `<table class="modern-table" style="margin:0; background:rgba(0,0,0,0.5)"><tbody>`;
            step.state.forEach(row => {
                tableHTML += `<tr>`;
                row.forEach((v, idx) => {
                    let st = idx === row.length - 1 ? `style="border-left: 1px solid var(--panel-border)"` : '';
                    tableHTML += `<td ${st}>${Number(v.toFixed(4))}</td>`;
                });
                tableHTML += `</tr>`;
            });
            tableHTML += `</tbody></table>`;
            box.innerHTML += tableHTML;
            stepsDiv.appendChild(box);
        });
    }


    // ==========================================
    // MODULE 2: NEWTON FORWARD
    // ==========================================
    const btnNewtonGen = document.getElementById('newton-generate');
    const containerNewtonData = document.getElementById('newton-data-container');
    const tbodyNewton = document.getElementById('newton-inputs-tbody');
    const btnNewtonSolve = document.getElementById('newton-solve');

    btnNewtonGen.addEventListener('click', () => {
        const n = parseInt(document.getElementById('newton-n').value);
        if (n < 2) return showError('newton-error', 'Need at least 2 points.');
        hideError('newton-error');

        tbodyNewton.innerHTML = '';
        for (let i = 0; i < n; i++) {
            tbodyNewton.innerHTML += `
                <tr>
                    <td>${i}</td>
                    <td><input type="number" step="any" class="nx" data-idx="${i}" placeholder="x${i}"></td>
                    <td><input type="number" step="any" class="ny" data-idx="${i}" placeholder="y${i}"></td>
                </tr>
            `;
        }
        containerNewtonData.classList.remove('hidden');
        document.getElementById('newton-results').classList.add('hidden');
    });

    btnNewtonSolve.addEventListener('click', () => {
        hideError('newton-error');
        const n = parseInt(document.getElementById('newton-n').value);
        let xVals = [], yVals = [];
        let valid = true;

        document.querySelectorAll('.nx').forEach(inp => {
            let v = parseFloat(inp.value);
            if (isNaN(v)) valid = false;
            xVals.push(v);
        });
        document.querySelectorAll('.ny').forEach(inp => {
            let v = parseFloat(inp.value);
            if (isNaN(v)) valid = false;
            yVals.push(v);
        });

        const targetX = parseFloat(document.getElementById('newton-target').value);
        if (isNaN(targetX)) valid = false;

        if (!valid) return showError('newton-error', 'Please fill all fields with valid numbers.');

        try {
            const result = solveNewtonForward(xVals, yVals, targetX);
            displayNewtonResults(result.result, result.diffTable, targetX);
        } catch (e) {
            showError('newton-error', e.message);
        }
    });

    document.getElementById('newton-reset').addEventListener('click', () => {
        containerNewtonData.classList.add('hidden');
        document.getElementById('newton-results').classList.add('hidden');
        hideError('newton-error');
    });

    function displayNewtonResults(res, table, targetVal) {
        document.getElementById('newton-results').classList.remove('hidden');
        document.getElementById('newton-solution').innerHTML = `f(${targetVal}) ≈ <span>${Number(res.toFixed(6))}</span>`;

        const tDiv = document.getElementById('newton-table');
        let html = `<table class="modern-table"><thead><tr><th>y</th><th>Δy</th><th>Δ²y</th><th>Δ³y</th><th>...</th></tr></thead><tbody>`;

        for (let i = 0; i < table.length; i++) {
            html += `<tr>`;
            for (let j = 0; j < table.length - i; j++) {
                html += `<td>${table[i][j]}</td>`;
            }
            html += `</tr>`;
        }
        html += `</tbody></table>`;
        tDiv.innerHTML = html;
    }


    // ==========================================
    // MODULE 3: RK4
    // ==========================================
    const btnRk4Solve = document.getElementById('rk4-solve');

    btnRk4Solve.addEventListener('click', () => {
        hideError('rk4-error');
        const eqStr = document.getElementById('rk4-eq').value;
        const x0 = parseFloat(document.getElementById('rk4-x0').value);
        const y0 = parseFloat(document.getElementById('rk4-y0').value);
        const h = parseFloat(document.getElementById('rk4-h').value);
        const xn = parseFloat(document.getElementById('rk4-xn').value);

        if (!eqStr || isNaN(x0) || isNaN(y0) || isNaN(h) || isNaN(xn)) {
            return showError('rk4-error', 'Please fill all inputs appropriately.');
        }

        try {
            const result = solveRK4(eqStr, x0, y0, h, xn);
            displayRK4Results(result.finalY, result.iterations, xn);
        } catch (e) {
            showError('rk4-error', e.message);
        }
    });

    document.getElementById('rk4-reset').addEventListener('click', () => {
        document.querySelectorAll('#rk4 input').forEach(inp => inp.value = '');
        document.getElementById('rk4-results').classList.add('hidden');
        hideError('rk4-error');
    });

    function displayRK4Results(finalY, iter, targetX) {
        document.getElementById('rk4-results').classList.remove('hidden');
        document.getElementById('rk4-solution').innerHTML = `y(${targetX}) ≈ <span>${Number(finalY.toFixed(6))}</span>`;

        const tDiv = document.getElementById('rk4-table');
        let html = `<table class="modern-table"><thead><tr>
            <th>x</th><th>y</th><th>k1</th><th>k2</th><th>k3</th><th>k4</th>
        </tr></thead><tbody>`;

        iter.forEach(row => {
            html += `<tr>
                <td>${row.x}</td>
                <td>${row.y}</td>
                <td>${row.k1}</td>
                <td>${row.k2}</td>
                <td>${row.k3}</td>
                <td>${row.k4}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        tDiv.innerHTML = html;
    }

    // ==========================================
    // SAMPLES
    // ==========================================
    document.querySelectorAll('.load-sample-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const c = e.target.dataset.case;
            if (c === 'gauss') {
                document.getElementById('gauss-n').value = 3;
                document.getElementById('gauss-generate').click();

                const vals = [[2, 1, -1, 8], [-3, -1, 2, -11], [-2, 1, 2, -3]]; // sol: 2, 3, -1
                document.querySelectorAll('#gauss-inputs .matrix-row').forEach((row, r) => {
                    const coeffs = row.querySelectorAll('.coeff');
                    coeffs[0].value = vals[r][0]; coeffs[1].value = vals[r][1]; coeffs[2].value = vals[r][2];
                    row.querySelector('.const').value = vals[r][3];
                });
            }
            if (c === 'newton') {
                document.getElementById('newton-n').value = 4;
                document.getElementById('newton-generate').click();
                const x = [0, 1, 2, 3];
                const y = [1, 2, 1, 10];
                document.querySelectorAll('.nx').forEach((inp, i) => inp.value = x[i]);
                document.querySelectorAll('.ny').forEach((inp, i) => inp.value = y[i]);
                document.getElementById('newton-target').value = 1.5;
            }
            if (c === 'rk4') {
                document.getElementById('rk4-eq').value = 'x + y';
                document.getElementById('rk4-x0').value = 0;
                document.getElementById('rk4-y0').value = 1;
                document.getElementById('rk4-h').value = 0.1;
                document.getElementById('rk4-xn').value = 0.2;
            }
        });
    });
});

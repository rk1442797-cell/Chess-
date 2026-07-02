  const board = [...document.querySelectorAll("#board td")];
        let selected = null, turn = "White";
        let whiteScore = 0, blackScore = 0;
        let whiteTime = 600, blackTime = 600;
        let timerStarted = false;

        const values = { "♙": 1, "♟": 1, "♘": 3, "♞": 3, "♗": 3, "♝": 3, "♖": 5, "♜": 5, "♕": 9, "♛": 9 };
        const whiteSet = "♙♘♗♖♕♔", blackSet = "♟♞♝♜♛♚";

        const wTimer = document.getElementById("whiteTimer");
        const bTimer = document.getElementById("blackTimer");
        const wScore = document.getElementById("whiteScore");
        const bScore = document.getElementById("blackScore");
        const turnEl = document.getElementById("turn");

        let interval = setInterval(() => {
            if (!timerStarted) return;
            turn === "White" ? whiteTime-- : blackTime--;
            updateTimers();
            if (whiteTime <= 0 || blackTime <= 0) {
                alert((whiteTime <= 0 ? "Black" : "White") + " wins on time!");
                clearInterval(interval);
            }
        }, 1000);

        function updateTimers() {
            wTimer.textContent = format(whiteTime);
            bTimer.textContent = format(blackTime);
            wTimer.classList.toggle("active", turn === "White");
            bTimer.classList.toggle("active", turn === "Black");
        }
        function format(t) { return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`; }

        board.forEach(c => c.onclick = () => handle(c));

        function handle(cell) {
            if (!selected) {
                if (isOwn(cell)) select(cell);
            } else {
                if (cell.classList.contains("move")) makeMove(cell);
                clear();
            }
        }

        function isOwn(cell) {
            let p = cell.textContent;
            return p && ((turn === "White" && whiteSet.includes(p)) || (turn === "Black" && blackSet.includes(p)));
        }

        function select(cell) {
            selected = cell;
            cell.classList.add("selected");
            showMoves(cell);
        }

        function makeMove(cell) {
            timerStarted = true;
            if (cell.textContent) {
                let v = values[cell.textContent];
                turn === "White" ? whiteScore += v : blackScore += v;
                wScore.textContent = whiteScore;
                bScore.textContent = blackScore;
            }
            cell.textContent = selected.textContent;
            selected.textContent = "";
            turn = turn === "White" ? "Black" : "White";
            turnEl.textContent = turn;
        }

        function showMoves(cell) {
            const i = board.indexOf(cell), r = Math.floor(i / 8), c = i % 8;
            const p = cell.textContent;
            const add = (x, y, capture = false) => {
                if (x < 0 || x > 7 || y < 0 || y > 7) return false;
                let t = board[x * 8 + y];
                if (capture) {
                    if (t.textContent && !isOwn(t)) t.classList.add("move");
                    return false;
                }
                if (t.textContent) {
                    if (!isOwn(t)) t.classList.add("move");
                    return false;
                }
                t.classList.add("move");
                return true;
            };

            if (p === "♙") { add(r - 1, c); add(r - 1, c - 1, true); add(r - 1, c + 1, true); }
            if (p === "♟") { add(r + 1, c); add(r + 1, c - 1, true); add(r + 1, c + 1, true); }
            if ("♖♜".includes(p)) line(add, r, c, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
            if ("♗♝".includes(p)) line(add, r, c, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
            if ("♕♛".includes(p)) line(add, r, c, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);
            if ("♘♞".includes(p)) [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]].forEach(d => add(r + d[0], c + d[1]));
            if ("♔♚".includes(p)) [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(d => add(r + d[0], c + d[1]));
        }

        function line(add, r, c, dirs) {
            dirs.forEach(d => {
                for (let i = 1; i < 8; i++) if (!add(r + i * d[0], c + i * d[1])) break;
            });
        }

        function clear() {
            board.forEach(c => c.classList.remove("move", "selected"));
            selected = null;
        }
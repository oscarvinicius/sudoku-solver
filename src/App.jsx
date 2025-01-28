import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [sudoku, setSudoku] = useState([
    [8, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 3, 6, 0, 0, 0, 0, 0],
    [0, 7, 0, 0, 9, 0, 2, 0, 0],
    [0, 5, 0, 0, 0, 7, 0, 0, 0],
    [0, 0, 0, 0, 4, 5, 7, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 3, 0],
    [0, 0, 1, 0, 0, 0, 0, 6, 8],
    [0, 0, 8, 5, 0, 0, 0, 1, 0],
    [0, 9, 0, 0, 0, 0, 4, 0, 0],
  ]);

  const [solveSudoku, setSolveSudoku] = useState(false);
  const [sudokuError, setSudokuError] = useState(null);

  useEffect(() => {
    if (solveSudoku) {
      let isSudokuValid = checkSudoku();
      setSudokuError(!isSudokuValid);
      if (isSudokuValid) {
        solve();
      }
      setSolveSudoku(false);
    }
  }, [solveSudoku]);

  /**
   * @returns true if sudoku is correctly filled
   */
  function checkSudoku() {
    //checks rows
    for (let i = 0; i < 9; ++i) {
      let hashMap = {};
      for (let j = 0; j < 9; ++j) {
        let cell = sudoku[i][j];
        if (cell != 0) {
          if (hashMap[cell]) {
            return false;
          }
          hashMap[cell] = true;
        }
      }
    }

    //checks columns
    for (let i = 0; i < 9; ++i) {
      let hashMap = {};
      for (let j = 0; j < 9; ++j) {
        let cell = sudoku[j][i];
        if (cell != 0) {
          if (hashMap[cell]) {
            return false;
          }
          hashMap[cell] = true;
        }
      }
    }

    //checks subgrids 3x3
    for (let i = 0; i < 9; i += 3) {
      for (let j = 0; j < 9; j += 3) {
        let hashMap = {};
        let startRow = Math.floor(i / 3) * 3;
        let startCol = Math.floor(j / 3) * 3;

        for (let k = 0; k < 3; ++k) {
          for (let p = 0; p < 3; ++p) {
            let row = startRow + k;
            let col = startCol + p;

            let cell = sudoku[row][col];
            if (cell != 0) {
              if (hashMap[cell]) {
                return false;
              }
              hashMap[cell] = true;
            }
          }
        }
      }
    }

    return true;
  }

  /**
   * Check if can place a number inside the sudoku board
   * @param {int} row
   * @param {int} col
   * @param {int} num
   * @returns {Boolean} true if num can be inserted at position (row,col)
   */
  function isValid(row, col, num) {
    //checks row
    for (let i = 0; i < 9; ++i) {
      if (sudoku[row][i] == num) {
        return false;
      }
    }

    //checks column
    for (let j = 0; j < 9; ++j) {
      if (sudoku[j][col] == num) {
        return false;
      }
    }

    //checks subgrid
    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (sudoku[startRow + i][startCol + j] == num) {
          return false;
        }
      }
    }

    return true;
  }

  function solve() {
    let stack = [];
    let row = 0;
    let col = 0;
    let last = null;

    let solvingSudoku = sudoku.slice(0);

    while (row < 9) {
      if (solvingSudoku[row][col] == 0) {
        let found = false;
        for (let num = 1; num <= 9; ++num) {
          if (last != null && num <= last.stackNum) {
            continue;
          }
          if (isValid(row, col, num)) {
            solvingSudoku[row][col] = num;
            stack.push({
              stackRow: row,
              stackCol: col,
              stackNum: num,
            });
            found = true;
            break;
          }
        }
        if (!found) {
          last = stack.pop();
          if (last == null) {
            return false;
          }
          row = last.stackRow;
          col = last.stackCol;
          solvingSudoku[row][col] = 0;
        } else {
          last = null;
          col = (col + 1) % 9;
          if (col == 0) {
            row += 1;
          }
        }
      } else {
        col = (col + 1) % 9;
        if (col == 0) {
          row += 1;
        }
      }
    }
    setSudoku(solvingSudoku);

    return true;
  }

  /**
   * Place the num at position (row,col) on sudoku board
   * @param {int} num
   * @param {int} row
   * @param {int} col
   */
  function changeCell(num, row, col) {
    let newSudoku = sudoku.slice(0);
    newSudoku[row][col] = num;
    setSudoku(newSudoku);
  }

  /**
   * Handles cell input change
   * @param {Event} e
   * @param {int} row
   * @param {int} col
   */
  function onCellChange(e, row, col) {
    if (/[1-9]/.test(e.key)) {
      changeCell(parseInt(e.key), row, col);
    }
    if (e.keyCode == 8 || e.keyCode == 46) {
      changeCell(0, row, col);
    }
  }

  let html = [];
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      let cells = [];
      let startRow = Math.floor(i / 3) * 3;
      let startCol = Math.floor(j / 3) * 3;

      for (let k = 0; k < 3; ++k) {
        for (let p = 0; p < 3; ++p) {
          let row = startRow + k;
          let col = startCol + p;
          cells.push(
            <div
              className="hover:opacity-90 hover:border-blue-600 hover:shadow-blue-400 hover:shadow-xs border-1 rounded-sm border-gray-300 flex justify-center items-center text-[1.2rem]"
              key={row.toString() + "-" + col.toString()}
            >
              <p>
                <input
                  className="w-[32px] h-[32px] sm:min-h-[3rem] sm:min-w-[3rem] text-center"
                  type="tel"
                  value={sudoku[row][col] == 0 ? "" : sudoku[row][col]}
                  onChange={(e) => onCellChange(e, row, col)}
                  onKeyUp={(e) => onCellChange(e, row, col)}
                />
              </p>
            </div>
          );
        }
      }

      let cellsHtml = [];
      for (let i = 0; i < 9; i += 3) {
        cellsHtml.push(
          <div className="flex gap-1" key={"cell-" + (i + 1).toString()}>
            {cells.slice(i, i + 3)}
          </div>
        );
      }

      html.push(cellsHtml);
    }
  }

  return (
    <>
      <div className="bg-[#4b4b4b] w-full min-h-screen py-[2rem] text-center">
        <div className="bg-custom sm:px-[2rem] pb-[2rem] shadow-2xl rounded-[0.6rem] inline-block text-center relative">
          {solveSudoku && (
            <div className="absolute  z-20 top-0 left-0 right-0 bottom-0  flex items-center justify-center">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-[4rem] h-[4rem] text-gray-200 animate-spin dark:text-gray-600 fill-[#ffd43b]"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {solveSudoku && (
            <div className="absolute z-10 left-0 right-0 top-0 bottom-0 bg-black rounded-[1rem] opacity-50 flex"></div>
          )}
          <h1 className="block text-center text-[2rem] px-[2rem] my-4 font-semibold">
            Resolvedor de Sudoku
          </h1>
          {sudokuError && (
            <div className="bg-red-400 rounded-lg text-[1rem] text-center py-2 mb-4 text-white">
              Sudoku inválido!
            </div>
          )}
          <div className="inline-grid grid-cols-3 gap-1">
            {html.map((v, i) => (
              <div
                key={"grid-" + (i + 1).toString()}
                className={i % 2 == 0 ? "bg-white" : "bg-transparent"}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="block text-right">
            <button
              onClick={(e) => {
                setSolveSudoku(true);
              }}
              className="bg-[#0067c0] hover:bg-[#6e9cc4] text-white shadow-blue-400 shadow-xs w-full max-w-[150px] text-[1.2rem] font-bold py-3 px-5 rounded-sm cursor-pointer mt-4"
            >
              Resolver
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

<style></style>;

export default App;
